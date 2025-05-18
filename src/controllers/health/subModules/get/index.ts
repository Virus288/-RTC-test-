import State from '../../../../tools/state';
import type { IGetHealth } from './types';
import type { IAbstractSubController } from '../../../../types/index';

export default class GetHealthController implements IAbstractSubController<IGetHealth> {
  async execute(): Promise<IGetHealth> {
    return new Promise((resolve) => {
      resolve({ alive: State.alive });
    });
  }
}
