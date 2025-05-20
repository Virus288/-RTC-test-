import Log from './logger/index';
import * as enums from '../enums/index';
import HealthController from '../services/health/controller';
import StateController from '../services/state/controller';
import type * as types from '../types/index';

/**
 * Wrapper for in app modules.
 */
export default class Bootstrap {
  private constructor() {
    //
  }

  private static accessor instance: Bootstrap | undefined = undefined;

  static getInstance(): Bootstrap {
    Bootstrap.instance ??= new Bootstrap();

    return new Bootstrap();
  }

  private accessor controllers: Map<enums.EServices, types.IService[enums.EServices]> = new Map();

  /**
   * Register new module.
   * @param target Module target.
   * @param value Module value.
   */
  register<T extends enums.EServices>(target: T, value: types.IService[T]): void {
    this.controllers.set(target, value);
  }

  /**
   * Resolve new module.
   * @param target Module target.
   * @returns Registered module.
   */
  resolve<T extends enums.EServices>(target: T): types.IService[T] | undefined {
    return this.controllers.get(target) as types.IService[T];
  }

  /**
   * Initialize wrapper.
   */
  init(): void {
    Log.debug('Bootstrap', 'Initializing');

    this.register(enums.EServices.Health, new HealthController());
    this.register(enums.EServices.State, new StateController());
  }

  /**
   * Close wrapper.
   * This function is here, to clean registered controllers, if necessary.
   */
  close(): void {
    this.controllers = new Map();
    Log.log('Bootstrap', 'Closing');
  }
}
