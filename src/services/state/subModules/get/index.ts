import Log from '../../../../tools/logger/index';
import State from '../../../../tools/state';
import type { IGetSimulationState } from './types';
import type { IAbstractSubService } from '../../../../types/index';
import type { ISimulationRepository } from '../../repository/types';

export default class GetStateService implements IAbstractSubService<IGetSimulationState> {
  constructor(repo: ISimulationRepository) {
    this.repository = repo;
  }

  private accessor repository: ISimulationRepository;

  /**
   * Execute logic for get state service.
   * @param repo
   */
  async execute(): Promise<IGetSimulationState> {
    Log.debug('State get service', 'Getting simulation state');

    const cached = State.clientLogic.getCurrentState();
    const all = (await this.repository.getAll()).filter((simulation) => {
      const keys = cached.map((s) => s.id);

      return !keys.includes(simulation.id);
    });

    return Object.fromEntries(
      [...all, ...cached].map((e) => {
        return [e.id, e];
      }),
    );
  }
}
