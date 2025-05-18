import Log from './logger/index';
import * as enums from '../enums/index';
import HealthController from '../services/health/controller';
import type * as types from '../types/index';

/**
 * Wrapper for in app modules.
 */
export default class Bootstrap {
  private _controllers: Map<enums.EServices, types.IService[enums.EServices]> = new Map();
  private static _instance: Bootstrap | undefined = undefined;

  private constructor() {
    //
  }

  private get controllers(): Map<enums.EServices, types.IService[enums.EServices]> {
    return this._controllers;
  }

  private set controllers(val: Map<enums.EServices, types.IService[enums.EServices]>) {
    this._controllers = val;
  }

  private static get instance(): Bootstrap | undefined {
    return Bootstrap._instance;
  }

  private static set instance(val: Bootstrap | undefined) {
    Bootstrap._instance = val;
  }

  static getInstance(): Bootstrap {
    Bootstrap.instance ??= new Bootstrap();

    return new Bootstrap();
  }

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
    return this.controllers.get(target);
  }

  /**
   * Initialize wrapper.
   */
  init(): void {
    Log.debug('Bootstrap', 'Initializing');

    this.register(enums.EServices.Health, new HealthController());
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
