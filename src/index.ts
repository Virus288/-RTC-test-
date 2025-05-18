import Router from './connections/api';
import Bootstrap from './tools/bootstrap';
import ConfigLoader from './tools/configLoader/index';
import Log from './tools/logger';
import State from './tools/state';
import type { IFullError } from './types';

class App {
  private static _instance: App | undefined = undefined;

  private constructor() {
    //
  }

  private static get instance(): App | undefined {
    return this._instance;
  }

  private static set instance(val: App | undefined) {
    this._instance = val;
  }

  /**
   * Initialize Application.
   * @description This function is used as a try catch for handleInit function.
   * @returns Instance of initialized app.
   */
  static init(): App {
    if (App.instance) return App.instance;

    const app = new App();
    App.instance = app;

    try {
      app.handleInit();
    } catch (err) {
      const { stack, message } = err as IFullError | Error;
      Log.error('Server', 'Err while initializing app', message, stack);

      app.close();
    }

    return app;
  }

  /**
   * Close application.
   */
  private close(): void {
    State.kill();
  }

  /**
   * Initialize application.
   * @description This function is used to initialize logic of application and all of its connections.
   */
  private handleInit(): void {
    const controllers = Bootstrap.getInstance();
    const router = new Router();

    State.controllers = controllers;
    State.router = router;

    controllers.init();
    router.init();

    Log.log('Server', 'Server started');

    ConfigLoader.validateConfig();
    State.alive = true;
    this.listenForSignals();
    Log.log('Server', 'Application initialized');
  }

  /**
   * Initialize listeners for sigterm and sigint.
   */
  private listenForSignals(): void {
    process.on('SIGTERM', () => {
      Log.log('Server', 'Received signal SIGTERM. Gracefully closing');
      this.close();
    });
    process.on('SIGINT', () => {
      Log.log('Server', 'Received signal SIGINT. Gracefully closing');
      this.close();
    });
  }
}

App.init();
