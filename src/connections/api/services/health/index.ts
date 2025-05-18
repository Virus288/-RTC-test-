import GetHealthRouter from './get/index';

/**
 * Initialize routes for health router.
 */
const initHealthRoutes = (): void => {
  new GetHealthRouter();
};

export default initHealthRoutes;
