import type Router from '../connections/api';

export interface IState {
  alive: boolean;
  router: Router;
}
