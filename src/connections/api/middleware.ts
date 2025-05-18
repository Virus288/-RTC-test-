import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import * as errors from '../../errors/index';
import ConfigLoader from '../../tools/configLoader/index';
import Log from '../../tools/logger/index';
import type * as types from '../../types/index';
import type { Express } from 'express';
import { randomUUID } from 'crypto';

export default class Middleware {
  /**
   * Generate generic middleware.
   * @param app Express server.
   */
  generateMiddleware(app: Express): void {
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true }));

    this.setSecurity(app);
    this.setBaseHeaders(app);
    this.logRequests(app);
    this.measureTime(app);
  }

  /**
   * Set base headers.
   * @param app Express server.
   */
  private setBaseHeaders(app: Express): void {
    app.use((_req: express.Request, res, next: express.NextFunction) => {
      res.header('Content-Type', 'application/json;charset=UTF-8');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  /**
   * Initialize helmet.
   * @param app Express server.
   */
  private setSecurity(app: Express): void {
    app.use(
      cors({
        origin: ConfigLoader.getConfig().corsOrigin,
        credentials: true,
      }),
    );

    const helmetDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
    const allowedUrls = ConfigLoader.getConfig().corsOrigin;
    app.use(
      helmet({
        contentSecurityPolicy: {
          useDefaults: false,
          directives: {
            ...helmetDirectives,
            'form-action': ["'self'", ...allowedUrls],
            'script-src': ["'self'"],
            'default-src': ["'self'", 'data:'],
            'frame-ancestors': ["'self'", ...allowedUrls],
            'frame-src': ["'self'", ...allowedUrls],
            'connect-src': ["'self'", ...allowedUrls],
          },
        },
      }),
    );
  }

  /**
   * Measure time for each request.
   * @param app Express server.
   */
  private measureTime(app: Express): void {
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      const reqId = randomUUID();
      Log.time(reqId);

      res.once('finish', () => {
        Log.endTime(reqId, { path: req.originalUrl, method: req.method });
      });

      next();
    });
  }

  /**
   * Log each request.
   * @param app Express server.
   */
  private logRequests(app: Express): void {
    app.use((req, _res, next) => {
      try {
        const logBody: Record<string, string | Record<string, string>> = {
          method: req.method,
          path: req.path,
          ip: req.ip as string,
        };

        if (req.query) logBody.query = JSON.stringify(req.query);
        if (
          req.body !== undefined &&
          typeof req.body === 'object' &&
          Object.keys(req.body as Record<string, string>).length > 0
        ) {
          logBody.body = req.body as Record<string, string>;

          // Hide password in logs
          if (logBody.body.password) {
            logBody.body.password = '***';
          }
        }

        Log.log('New req', logBody);
        next();
      } catch (err) {
        Log.error('Middleware validation', err);
      }
    });
  }

  /**
   * Generate middleware to handle uncought errors.
   * @param app Express server.
   */
  generateErrHandler(app: Express): void {
    app.use(
      (
        err: express.Errback | types.IFullError,
        req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        Log.error('Caught new generic error', `Caused by ${req.ip ?? 'unknown ip'}`, JSON.stringify(err));
        const error = err as types.IFullError;

        if (error.message.includes('is not valid JSON')) {
          Log.error('Middleware', 'Received req is not of json type', error.message, error.stack);
          const { message, name, status } = new errors.IncorrectDataType();
          res.status(status).json({ message, name });
          return;
        }

        if (error.name === 'SyntaxError') {
          Log.error('Middleware', 'Generic err', error.message, error.stack);
          const { message, code, name, status } = new errors.InternalError();
          res.status(status).json({ message, code, name });
          return;
        }

        if (error.code !== undefined) {
          const { message, code, name, status } = error;
          res.status(status).json({ message, code, name });
          return;
        }

        Log.error('Middleware', 'Generic err', error.message, error.stack);
        const { message, code, name, status } = new errors.InternalError();
        res.status(status).json({ message, code, name });
      },
    );
  }
}
