import express from 'express';
import * as errors from '../../errors/index';
import State from '../state';
import type * as enums from '../../enums/index';
import type * as types from '../../types/index';

export default abstract class AbstractRouter<T extends enums.EServices, N extends types.IServiceActions> {
  readonly _router: express.Router;
  protected readonly _controller: types.IInnerService[T][N];

  constructor(target: T, subTarget: N) {
    this._router = express.Router();

    const controller = State.controllers.resolve(target);
    if (!controller) throw new errors.UnregisteredControllerError(target);

    const service = controller.resolve(subTarget) as types.IInnerService[T][N];
    if (!service) throw new errors.UnregisteredControllerError(subTarget as string);

    this._controller = service;
  }

  get router(): express.Router {
    return this._router;
  }

  get controller(): types.IInnerService[T][N] {
    return this._controller;
  }
}
