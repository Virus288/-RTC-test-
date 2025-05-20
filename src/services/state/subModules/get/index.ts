import Log from '../../../../tools/logger/index';
import State from '../../../../tools/state';
import type { IGetSimulationState } from './types';

export default class GetStateService {
  /**
   * Execute logic for get state service.
   * @param repo
   */
  async execute(): Promise<IGetSimulationState> {
    return new Promise((resolve) => {
      Log.debug('State get service', 'Getting simulation state');

      const cached = State.clientLogic.getCurrentState();

      resolve(
        Object.fromEntries(
          cached.map((e) => {
            return [e.id, e];
          }),
        ),
      );
    });
  }
}
