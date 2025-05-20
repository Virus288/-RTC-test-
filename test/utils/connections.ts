import Router from '../../src/connections/api/index';
import ClientLogic from '../../src/services/state';
import State from '../../src/tools/state';

export default class Utils {
  constructor() {
    State.router = new Router();
    State.clientLogic = ClientLogic.getInstance();
  }

  connect(): void {
    State.router.init();
  }

  close(): void {
    State.router.close();
  }
}
