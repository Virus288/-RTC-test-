import HealthController from '../../../../src/services/health/controller';

/**
 * Fake health controller, with init overwritten for tests.
 */
export default class FakeHealthController extends HealthController {
  /**
   * Register health controllers.
   * @returns Void.
   */
  protected override init(): void {
    //
  }
}
