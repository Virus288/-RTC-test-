import type * as enums from '../enums/index';
import type HealthController from '../services/health/controller';
import type GetHealthService from '../services/health/subModules/get/index';
import type StateController from '../services/state/controller';
import type GetStateService from '../services/state/subModules/get/index';

export type IServiceActions = enums.EHealthActions | enums.EStateActions;

type IServiceActionsMap = {
  [K in IServiceActions]: unknown;
};

export interface IHealthServices extends IServiceActionsMap {
  [enums.EHealthActions.Get]: GetHealthService;
}

export interface IStateServices extends IServiceActionsMap {
  [enums.EStateActions.Get]: GetStateService;
}

export interface IService {
  [enums.EServices.Health]: HealthController;
  [enums.EServices.State]: StateController;
}

export interface IInnerService {
  [enums.EServices.Health]: IHealthServices;
  [enums.EServices.State]: IStateServices;
}
