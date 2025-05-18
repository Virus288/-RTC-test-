import * as enums from '../../enums/index';
import GetHealthController from './subModules/get/index';
import AbstractController from '../../tools/abstractions/controller';

export default class HealthController extends AbstractController<enums.EControllers.Health> {
  /**
   * Register health controllers.
   * @returns Void.
   */
  protected init(): void {
    this.register(enums.EHealthActions.Get, new GetHealthController());
  }
}
