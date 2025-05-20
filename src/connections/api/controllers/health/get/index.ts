import handleErr from '../../../../../errors/handler';
import GetHealthService from '../../../../../services/health/subModules/get';
import type { IGetHealthReq } from './types';
import type * as types from '../../../../../types/index';
import type express from 'express';

export default class HealthRouter {
  constructor(router: express.Express) {
    this.router = router;

    this.init();
  }

  private accessor router: express.Express;

  /**
   * Initialize route for health.
   */
  private init(): void {
    this.router.get('/health', async (_req: IGetHealthReq, res) => {
      await this.execute(res);
    });
  }

  /**
   * @param res
   * @openapi
   * /health:
   *   get:
   *     tags:
   *       - health
   *     summary: Health check
   *     description: |
   *       Simple endpoint to check if the service is alive and responding.
   *     responses:
   *       200:
   *         description: Service is alive and responding
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthStatus'
   */
  private async execute(res: express.Response): Promise<void> {
    try {
      const controller = new GetHealthService();
      const data = await controller.execute();
      res.status(200).send(data);
    } catch (err) {
      handleErr(err as types.IFullError, res);
    }
  }
}
