import initHealthRoutes from './controllers/health/index';
import initStateRoutes from './controllers/state';
import { FourOhFour } from '../../errors/index';
import type express from 'express';

export default class AppRouter {
  /**
   * Initialize routes.
   * @param app
   */
  initRoutes(app: express.Express): void {
    initHealthRoutes(app);
    initStateRoutes(app);
  }

  /**
   * Initialize 404 router.
   * @param app
   */
  initFourOhFour(app: express.Express): void {
    app.all(/(.*)/, (_req, res) => {
      const { status, code, message, name } = new FourOhFour();

      res.status(status).send({
        error: {
          message,
          code,
          name,
        },
      });
    });
  }
}
