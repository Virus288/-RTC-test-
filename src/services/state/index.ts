import ClientState from './clientState';
import SimulationFactory from './repository/factory';
import { RequestTimedOut } from '../../errors/index';
import ConfigLoader from '../../tools/configLoader';
import Log from '../../tools/logger';
import State from '../../tools/state';
import type { ISimulationMappingsBody, ISimulationState, ISimulationStateBody } from './types';
import type { IPossiblyFullError } from '../../types';

export default class ClientLogic {
  protected constructor() {
    this.state = ClientState.getInstance(SimulationFactory.getInstance());
  }

  protected static accessor instance: ClientLogic | undefined = undefined;

  static getInstance(): ClientLogic {
    ClientLogic.instance ??= new ClientLogic();

    return ClientLogic.instance;
  }

  protected accessor state: ClientState;
  private accessor interval: NodeJS.Timeout | undefined = undefined;
  private accessor busy: boolean = false;
  private accessor newGame: boolean = true;
  private accessor retries: number = 0;

  /**
   * Initialize interval, used for crawling.
   */
  init(): void {
    Log.debug('Client logic', 'Starting application');

    this.startTimer();
  }

  /**
   * Close client.
   */
  close(): void {
    clearInterval(this.interval);
  }

  /*
   * Get current cached data
   */
  getCurrentState(): ISimulationState[] {
    return this.state.getGames();
  }

  /**
   * Function, which controls data flow.
   */
  private fetchData(): void {
    Log.debug('Client logic', 'Starting fetching data');

    // Handle logic for application, whenever external api died, or something really bad happen
    if (this.retries >= 50) {
      Log.error(
        'Client logic',
        'Request failed 50 times already. Either external api broke, or something is wrong with me. Closing application, due to fatal error',
      );
      State.kill(1);
      return;
    }

    if (this.busy) {
      // External api did not answer or fetch got stuck. Restart
      if (this.retries >= 5) {
        Log.error('Client logic', `Request still busy after ${this.retries} retries. Assuming it died and retrying.`);

        this.resetTimers();
        return;
      }

      this.retries++;
      Log.warn('Client logic', 'Requested new data fetch, but previous one did not finish!');
      return;
    }

    this.busy = true;

    this.handleFetchData()
      .then((callback) => {
        if (!callback) Log.debug('Client logic', 'Mappings are outdated. Will recreate them on the new run');

        this.newGame = !callback;
        this.resetTimers();
      })
      .catch((err) => {
        if ((err as IPossiblyFullError)?.code === new RequestTimedOut().code) {
          Log.error('Client logic', 'Request timed out. Retrying');

          this.retries++;
          this.busy = false;
        } else {
          Log.error(
            'Client logic',
            "Caught unknown error. Retrying requests again, until firewall won't trigger. Error: ",
            (err as Error).message,
            (err as Error).stack,
          );
          this.retries++;
          this.busy = false;
        }
      });
  }

  /**
   * Send request for new simulation data.
   * @param newSimulation
   */
  protected async handleFetchData(): Promise<boolean> {
    Log.debug('Client logic', 'Sending request');

    if (this.newGame) {
      const mappings = await this.getMappings();
      this.state.updateMappings(mappings);
    }

    const simulations = await this.getSimulation();
    return this.state.updateSimulation(simulations);
  }

  private async getMappings(): Promise<ISimulationMappingsBody> {
    return this.sendReq('/api/mappings') as Promise<ISimulationMappingsBody>;
  }

  private async getSimulation(): Promise<ISimulationStateBody> {
    return this.sendReq('/api/state') as Promise<ISimulationStateBody>;
  }

  private async sendReq(path: string): Promise<unknown> {
    try {
      const res = await fetch(`${ConfigLoader.getConfig().apiTarget}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(ConfigLoader.getConfig().apiReqTimeout),
      });

      if (res.ok) {
        return await res.json();
      }

      const err = (await res.json()) as { error: Error };
      throw err.error;
    } catch (err) {
      Log.error('Client logic', 'Got error while sending a request', (err as Error).message, (err as Error).stack);

      switch ((err as Error)?.name) {
        case 'TimeoutError':
          throw new RequestTimedOut();
        default:
          throw err;
      }
    }
  }

  /**
   * Reset local timer blockers.
   */
  private resetTimers(): void {
    this.busy = false;
    this.retries = 0;
  }

  /**
   * Start local timers.
   */
  private startTimer(): void {
    this.interval = setInterval(() => this.fetchData(), ConfigLoader.getConfig().iterationsTimeout);
  }
}
