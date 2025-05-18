import GetHealthRouter from './get/index.js';

/**
 * Initialize routes for health router.
 */
const initHealthRoutes = (): void => {
  new GetHealthRouter();
};

export default initHealthRoutes;
