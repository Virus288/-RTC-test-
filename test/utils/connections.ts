import State from '../../src/tools/state.js';
import Router from '../../src/connections/api/index.js';
import Bootstrap from '../../src/tools/bootstrap.js';

export default class Utils {
  constructor() {
    State.controllers = Bootstrap.getInstance()
    State.router = new Router()
  }

  async connect(): Promise<void> {
    State.router.init()
  }

  async close(): Promise<void> {
    State.router.close();
  }
}
