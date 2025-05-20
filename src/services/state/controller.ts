import SimulationRepository from './repository/factory';
import * as enums from '../../enums/index';
import GetStateService from './subModules/get/index';
import AbstractController from '../../tools/abstractions/controller';

export default class StateController extends AbstractController<enums.EServices.State> {
  /**
   * Register state controllers.
   * @returns Void.
   */
  protected init(): void {
    const repo = SimulationRepository.getInstance();

    this.register(enums.EStateActions.Get, new GetStateService(repo));
  }
}
