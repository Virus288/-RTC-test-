import { EServices, EHealthActions } from '../../../../../enums/index';
import handleErr from '../../../../../errors/handler';
import Routes from '../../../builder/router';
import getService from '../../../utils/services';
import type * as types from '../../../../../types/index';
import type express from 'express';

export default class HealthRouter {
  /**
   * @param _req
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
  @Routes.Get('/health')
  async execute(_req: express.Request, res: express.Response): Promise<void> {
    try {
      const controller = getService(EServices.Health, EHealthActions.Get);
      const data = await controller.execute();
      res.status(200).send(data);
    } catch (err) {
      handleErr(err as types.IFullError, res);
    }
  }
}
