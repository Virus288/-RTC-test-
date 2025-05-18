import * as errors from '../../../errors/index';
import State from '../../../tools/state';
import type * as enums from '../../../enums/index';
import type * as types from '../../../types/index';

/**
 * Resolve service from any controller.
 * @param target Controller to resolve from.
 * @param subTarget Service to resolve.
 */
const getService = <T extends enums.EServices, N extends types.IServiceActions>(
  target: T,
  subTarget: N,
): types.IInnerService[T][N] => {
  const controller = State.controllers.resolve(target);
  if (!controller) throw new errors.UnregisteredControllerError(target);

  const service = controller.resolve(subTarget) as types.IInnerService[T][N];
  if (!service) throw new errors.UnregisteredControllerError(subTarget as string);

  return service;
};

export default getService;
