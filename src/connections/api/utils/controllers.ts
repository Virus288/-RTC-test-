import * as errors from '../../../errors/index.js';
import State from '../../../tools/state.js';
import type * as enums from '../../../enums/index.js';
import type * as types from '../../../types/index.js';

const getController = <T extends enums.EControllers, N extends types.IControllerActions>(
  target: T,
  subTarget: N,
): types.IInnerController[T][N] => {
  const controller = State.controllers.resolve(target);
  if (!controller) throw new errors.UnregisteredControllerError(target);

  const subController = controller.resolve(subTarget) as types.IInnerController[T][N];
  if (!subController) throw new errors.UnregisteredControllerError(subTarget as string);

  return subController;
};

export default getController;
