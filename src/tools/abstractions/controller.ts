import type * as enums from '../../enums/index';
import type * as types from '../../types/index';

export default abstract class AbstractController<T extends enums.EServices> {
  private readonly _services: Map<types.IServiceActions, types.IInnerService[T][keyof types.IInnerService[T]]> =
    new Map<types.IServiceActions, types.IInnerService[T][keyof types.IInnerService[T]]>();

  constructor() {
    this.init();
  }

  private get services(): Map<types.IServiceActions, types.IInnerService[T][keyof types.IInnerService[T]]> {
    return this._services;
  }

  /**
   * Register new controller.
   * @param target Target to register.
   * @param value Initialized controller.
   */
  register<N extends keyof types.IInnerService[T]>(target: N, value: types.IInnerService[T][N]): void {
    this.services.set(target as types.IServiceActions, value);
  }

  /**
   * Resolve new controller.
   * @param target Registered target.
   * @returns Registered target.
   */
  resolve<N extends keyof types.IInnerService[T]>(target: N): types.IInnerService[T][N] | undefined {
    return this.services.get(target as types.IServiceActions) as types.IInnerService[T][N] | undefined;
  }

  protected abstract init(): void;
}
