import Log from '../../../../tools/logger/index';
import State from '../../../../tools/state';
import type { IGetHealth } from './types';
import type { IAbstractSubService } from '../../../../types/index';

export default class GetHealthService implements IAbstractSubService<IGetHealth> {
  async execute(): Promise<IGetHealth> {
    return new Promise((resolve) => {
      Log.debug('Health get service', 'Getting health');
      resolve({ alive: State.alive });
    });
  }
}
