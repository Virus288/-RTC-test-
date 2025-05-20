import GetStateRouter from './get/index';
import type express from 'express';

/**
 * Initialize routes for state router.
 * @param app
 */
const initStateRoutes = (app: express.Express): void => {
  new GetStateRouter(app);
};

export default initStateRoutes;
