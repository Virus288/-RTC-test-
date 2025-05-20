import { ESimulationKeys } from './enums';
import { diffSimulations } from './utils';
import { ESimulationCompetitors, ESimulationStatus } from '../../enums';
import { MissingMappingsError } from '../../errors';
import Log from '../../tools/logger/index';
import type {
  IRepositoryGetData,
  ISimulationMappings,
  ISimulationMappingsBody,
  ISimulationScores,
  ISimulationState,
  ISimulationStateBody,
} from './types';
import type { IFullError } from '../../types/index';

export default class ClientState {
  protected static accessor instance: ClientState | undefined = undefined;

  static getInstance(): ClientState {
    ClientState.instance ??= new ClientState();

    return ClientState.instance;
  }

  private accessor mappings: Map<string, string> = new Map();
  private accessor simulations: Map<string, ISimulationState> = new Map();
  private accessor rawSimulations: ISimulationStateBody[] = [];

  /**
   * Update simulation data.
   * @param reqBody New game received from server.
   * @param mappings
   */
  updateSimulation(reqBody: ISimulationStateBody): boolean {
    Log.debug('Client state', 'Updating simulation');

    let callback: boolean = false;

    try {
      callback = this.decodeSimulation(reqBody);
    } catch (err) {
      if ((err as IFullError).code === new MissingMappingsError().code) {
        Log.error('Client state', 'Mappings are missing. Will redo previous batch on the next run'); // In my opinion, this should be a warning, but according to guide, error

        this.simulations.clear();
        return false;
      }
    }

    if (!callback) {
      // This assumes that callback can fail only because mappings are missing.
      this.simulations.clear();
    }

    return callback;
  }

  /**
   * Update local mappings.
   * @param mappings
   */
  updateMappings(mappings: ISimulationMappingsBody): void {
    Log.log('Client state', 'Starting new simulation');
    Log.debug('Client state', 'Updating mappings');

    this.mappings.clear();
    this.decodeMappings(mappings);
  }

  /**
   * Get all games.
   */
  getGames(): ISimulationState[] {
    return Array.from(this.simulations.values()).filter((s) => s.status !== ESimulationStatus.REMOVED);
  }

  /**
   * Close state.
   */
  close(): void {
    this.mappings.clear();
    this.simulations.clear();
    this.rawSimulations = [];
  }

  /**
   * Decode mappings.
   * @param mappings Mappings received from api.
   */
  private decodeMappings(mappings: ISimulationMappingsBody): void {
    Log.debug('Client state', 'Decoding mappings');
    const ob = Object.fromEntries(mappings.mappings.split(';').map((m) => m.split(':'))) as ISimulationMappings;
    this.mappings = new Map(Object.entries(ob));
  }

  /**
   * Decode simulation.
   * @param simulation Simulation received from api.
   * @param raw
   */
  private decodeSimulation(simulation: ISimulationStateBody, raw = false): boolean {
    Log.debug('Client state', 'Decoding simulation');

    if (!this.mappings || Array.from(this.mappings.values()).length === 0) {
      Log.warn('Client state', 'Received simulation data, but no mappings');
      this.rawSimulations.push(simulation);
      return false;
    }

    if (this.rawSimulations.length > 0 && !raw) {
      Log.debug('Client state', 'Found raw simulation from previous run. Reading it first');
      try {
        const outputs = this.rawSimulations.map((r) => this.decodeSimulation(r, true));
        this.rawSimulations = [];
        if (outputs.includes(false)) {
          this.rawSimulations.push(simulation);
          return false;
        }
      } catch (err) {
        if ((err as IFullError)?.code === new MissingMappingsError().code) {
          Log.error(
            'Client state',
            'Started next batch, but mappings are still missing. It is possible that this error happen multiple times, because external server broke.',
          );

          return false;
        }

        throw err;
      }
    }

    const keys = Object.values(ESimulationKeys);
    const matches = simulation.odds.split('\n');
    let baseMatch: Partial<ISimulationState> = {};
    baseMatch.competitors ??= {
      [ESimulationCompetitors.HOME]: {
        type: ESimulationCompetitors.HOME,
        name: '',
      },
      [ESimulationCompetitors.AWAY]: {
        type: ESimulationCompetitors.AWAY,
        name: '',
      },
    };

    const ids: string[] = [];

    matches
      .filter((m) => !!m)
      .forEach((m) => {
        const match = m.split(',');

        keys.forEach((k) => {
          switch (k) {
            case ESimulationKeys.ID:
              ids.push(match[0]!);
              baseMatch.id = match[0]!;
              break;
            case ESimulationKeys.SPORT:
              baseMatch.sport = this.findMapping(match[1]!, k);
              break;
            case ESimulationKeys.COMPETITION:
              baseMatch.competition = this.findMapping(match[2]!, k);
              break;
            case ESimulationKeys.START_TIME:
              baseMatch.startTime = new Date(parseInt(match[3]!)).toISOString();
              break;
            case ESimulationKeys.HOME_COMPETITOR:
              baseMatch.competitors!.HOME.name = this.findMapping(match[4]!, k);
              break;
            case ESimulationKeys.AWAY_COMPETITOR:
              baseMatch.competitors!.AWAY.name = this.findMapping(match[5]!, k);
              break;
            case ESimulationKeys.STATUS:
              baseMatch.status = this.findMapping(match[6]!, k);
              break;
            case ESimulationKeys.SCORES:
              baseMatch.scores = this.getScoreMapping(match[7]!);
              break;
            default:
              Log.error(
                'Client state',
                'Unknown field in state response. If you see this error, contact your administrator!',
              );
              break;
          }
        });

        if ((Object.values(baseMatch) as (string | undefined)[]).includes(undefined)) {
          Log.debug('Client state', 'Mappings are outdated');
          this.rawSimulations.push(simulation);

          throw new MissingMappingsError();
        }

        this.compareChanges(baseMatch.id!, baseMatch as ISimulationState);
        this.simulations.set(baseMatch.id!, baseMatch as ISimulationState);

        baseMatch = {};
        baseMatch.competitors ??= {
          [ESimulationCompetitors.HOME]: {
            type: ESimulationCompetitors.HOME,
            name: '',
          },
          [ESimulationCompetitors.AWAY]: {
            type: ESimulationCompetitors.AWAY,
            name: '',
          },
        };
      });

    this.filterFinishedSimulations(ids);

    return true;
  }

  /**
   * Mark finished simulations as removed.
   * @param ids
   */
  private filterFinishedSimulations(ids: string[]): void {
    Array.from(this.simulations.entries()).forEach(([k, v]) => {
      if (!ids.includes(k) && v.status !== ESimulationStatus.REMOVED) {
        Log.debug('Client state', `Simulation ${k} was finished. Marking as removed`);
        this.simulations.set(k, { ...v, status: ESimulationStatus.REMOVED });
      }
    });
  }

  /**
   * Compare old data with new and log if anything changed.
   * @param key
   * @param value
   */
  private compareChanges(key: string, value: ISimulationState): void {
    const existingValue = this.simulations.get(key);
    if (!existingValue) {
      Log.log('Client state', 'Received new simulation', JSON.stringify(value, null, 2));
      return;
    }

    const differences = diffSimulations(value, existingValue);
    if (Object.keys(differences).length === 0) return;
    Log.log('Client state', 'Simulation updated', JSON.stringify(differences, null, 2));
  }

  /**
   * Find mapping based on uuid.
   * @param data UUID to find.
   * @param target Target type.
   */
  private findMapping<T extends ESimulationKeys>(data: string, target: T): IRepositoryGetData[T] {
    let mappedData: IRepositoryGetData[T] | undefined = undefined;

    switch (target) {
      default:
        mappedData = this.mappings.get(data) as IRepositoryGetData[T];
        break;
    }

    return mappedData;
  }

  /**
   * Util function to build scores from mappings.
   * @param score
   */
  private getScoreMapping(score: string): Record<string, ISimulationScores> {
    const scores: Record<string, ISimulationScores> = {};

    if (!score || score.length === 0) return scores;

    const split = score.split('|').map((e) => e.split('@')) as [string, string][];

    split.forEach((s) => {
      const type = this.findMapping(s[0], ESimulationKeys.SCORES);
      const gameScores = s[1].split(':') as [string, string];

      scores[type] = {
        type,
        home: gameScores[0],
        away: gameScores[1],
      };
    });

    return scores;
  }
}
