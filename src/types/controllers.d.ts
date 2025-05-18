import type * as enums from '../enums/index';
import type HealthController from '../services/health/controller';
import type GetHealthController from '../services/health/subModules/get/index';

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
