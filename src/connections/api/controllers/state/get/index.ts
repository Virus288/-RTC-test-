import { EServices, EStateActions } from '../../../../../enums/index';
import handleErr from '../../../../../errors/handler';
import Routes from '../../../builder/router';
import getService from '../../../utils/services';
import type * as types from '../../../../../types/index';
import type express from 'express';

export default class StateRouter {
  /**
   * @param _req
   * @param res
   * @openapi
   * /client/state:
   *   get:
   *     tags:
   *       - state
   *     summary: Get simulation state
   *     description: Get state of simulation.
   *     responses:
   *       200:
   *         description: Get response with simulation body
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SimulationState'
   */
  @Routes.Get('/client/state')
  async execute(_req: express.Request, res: express.Response): Promise<void> {
    try {
      const controller = getService(EServices.State, EStateActions.Get);
      const data = await controller.execute();
      res.status(200).send(data);
    } catch (err) {
      handleErr(err as types.IFullError, res);
    }
  }
}
