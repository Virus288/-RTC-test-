import type HealthController from '../controllers/health/controller';
import type GetHealthController from '../controllers/health/subModules/get/index';
import type * as enums from '../enums/index';

export type IControllerActions = enums.EHealthActions;

type IControllerActionsMap = {
  [K in IControllerActions]: unknown;
};

export interface IHealthControllers extends IControllerActionsMap {
  [enums.EHealthActions.Get]: GetHealthController;
}

export interface IController {
  [enums.EControllers.Health]: HealthController;
}

export interface IInnerController {
  [enums.EControllers.Health]: IHealthControllers;
}
