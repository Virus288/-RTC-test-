import Log from './logger/index';
import type Bootstrap from './bootstrap';
import type Router from '../connections/api/index';
import type ClientLogic from '../services/state';
import type { IState } from '../types/index';
import { EventEmitter } from 'events';

class State extends EventEmitter implements IState {
  private _alive: boolean = false;
  private _controllers: Bootstrap | null = null;
  private _router: Router | null = null;
  private _clientLogic: ClientLogic | null = null;
  private static _instance: State | null = null;

  private constructor() {
    super();
  }

  static get instance(): State | null {
    return State._instance;
  }

  private static set instance(val: State) {
    State._instance = val;
  }

  get controllers(): Bootstrap {
    return this._controllers!;
  }

  set controllers(val: Bootstrap) {
    this._controllers = val;
  }

  get clientLogic(): ClientLogic {
    return this._clientLogic!;
  }

  set clientLogic(val: ClientLogic) {
    this._clientLogic = val;
  }

  get router(): Router {
    return this._router!;
  }

  set router(val: Router) {
    this._router = val;
    if (val) this.emit('initialized');
  }

  get alive(): boolean {
    return this._alive;
  }

  set alive(val: boolean) {
    this._alive = val;
  }

  static getInstance(): State {
    State.instance ??= new State();

    return State.instance;
  }

  /**
   * Kill application and all of its connections.
   * @param exitCode
   */
  kill(exitCode?: number): void {
    this.alive = false;
    this.controllers.close();
    this.router.close();
    this.clientLogic.close();

    Log.log('Server', 'App closed');
    process.exit(exitCode ?? 0);
  }
}

export default State.getInstance();
