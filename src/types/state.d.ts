import type Router from '../connections/api';
import type Bootstrap from '../tools/bootstrap';

export interface IState {
  controllers: Bootstrap;
  alive: boolean;
  router: Router;
}
