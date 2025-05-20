import GetHealthRouter from './get/index';
import type express from 'express';

/**
 * Initialize routes for health router.
 * @param app
 */
const initHealthRoutes = (app: express.Express): void => {
  new GetHealthRouter(app);
};

export default initHealthRoutes;
