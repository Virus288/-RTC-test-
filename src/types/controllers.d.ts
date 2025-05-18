import type * as enums from '../enums/index';
import type HealthController from '../services/health/controller';
import type GetHealthService from '../services/health/subModules/get/index';

export type IServiceActions = enums.EHealthActions;

type IServiceActionsMap = {
  [K in IServiceActions]: unknown;
};

export interface IHealthServices extends IServiceActionsMap {
  [enums.EHealthActions.Get]: GetHealthService;
}

export interface IService {
  [enums.EServices.Health]: HealthController;
}

export interface IInnerService {
  [enums.EServices.Health]: IHealthServices;
}
