import { EControllers, EHealthActions } from '../../../../../enums/index';
import handleErr from '../../../../../errors/handler';
import Routes from '../../../builder/router.js';
import getController from '../../../utils/controllers.js';
import type * as types from '../../../../../types/index.js';
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
   *     description: Check if services are responding
   *     responses:
   *       200:
   *         description: Success. Got information about services
   */
  @Routes.Get('/health')
  async execute(_req: express.Request, res: express.Response): Promise<void> {
    try {
      const controller = getController(EControllers.Health, EHealthActions.Get);
      const data = await controller.execute();
      res.status(200).send({ data });
    } catch (err) {
      handleErr(err as types.IFullError, res);
    }
  }
}
