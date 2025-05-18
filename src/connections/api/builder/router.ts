import { ERouteType } from './enums';
import Log from '../../../tools/logger/index';
import State from '../../../tools/state';
import type { IAsyncRoute, IRoute } from './types';
import type express from 'express';

export default class Routes {
  private static accessor queue: (() => void)[] = [];

  /**
   * Create post endpoint.
   * @param path Path to create.
   */
  static Post<This, T>(path: string): IRoute<This, T> {
    return Routes.createRoute<This, T>(ERouteType.POST, path);
  }

  /**
   * Create get endpoint.
   * @param path Path to create.
   */
  static Get<This, T>(path: string): IRoute<This, T> {
    return Routes.createRoute<This, T>(ERouteType.GET, path);
  }

  /**
   * Create put endpoint.
   * @param path Path to create.
   */
  static Put<This, T>(path: string): IRoute<This, T> {
    return Routes.createRoute<This, T>(ERouteType.PUT, path);
  }

  /**
   * Create patch endpoint.
   * @param path Path to create.
   */
  static Patch<This, T>(path: string): IRoute<This, T> {
    return Routes.createRoute<This, T>(ERouteType.PATCH, path);
  }

  /**
   * Create delete endpoint.
   * @param path Path to create.
   */
  static Delete<This, T>(path: string): IRoute<This, T> {
    return Routes.createRoute<This, T>(ERouteType.DELETE, path);
  }

  /**
   * @internal
   */
  private static createRoute<This, T>(type: ERouteType, path: string): IRoute<This, T>;

  /**
   * @internal
   */
  private static createRoute<This, T>(type: ERouteType, path: string): IAsyncRoute<This, T>;

  /**
   * Create route.
   * @internal
   * @param type Type of endpoint.
   * @param path Path that endpoint will use.
   * @param service Type of service to call.
   */
  private static createRoute<This, T>(type: ERouteType, path: string): IRoute<This, T> {
    return function (
      target: (this: This, req: express.Request, res: express.Response, next?: express.NextFunction) => T,
      context: ClassMethodDecoratorContext<
        This,
        (this: This, req: express.Request, res: express.Response, next?: express.NextFunction) => T
      >,
    ): undefined | (() => T) {
      const action = (): void => {
        Log.debug('Routes', `Creating ${type} endpoint for path ${path}`);

        State.router.app[type](
          path,
          async (req: express.Request, res: express.Response, next?: express.NextFunction) => {
            const instance = new (context.constructor as { new (): This })();
            const output = target.call(instance, req, res, next);

            if (output instanceof Promise) {
              await output;
            }
          },
        );
      };

      if (!State.router || !State.router?.app) {
        Log.debug('Router', `Express server is unavailable. Pushing route ${type} ${path} to queue`);
        Routes.queue.push(action);
        Routes.waitForServer();
      } else {
        action();
      }

      return undefined;
    };
  }

  private static waitForServer(): void {
    State.removeAllListeners('initialized');
    State.once('initialized', () => {
      Routes.queue.forEach((e) => {
        e();
      });
    });
  }
}
