import handleErr from '../../../../../errors/handler';
import GetStateService from '../../../../../services/state/subModules/get';
import type { IGetStateReq } from './types';
import type * as types from '../../../../../types/index';
import type express from 'express';

export default class StateRouter {
  constructor(router: express.Express) {
    this.router = router;

    this.init();
  }

  private accessor router: express.Express;

  /**
   * Initialize route for health.
   */
  private init(): void {
    this.router.get('/client/state', async (_req: IGetStateReq, res) => {
      await this.execute(res);
    });
  }

  /**
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
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/SimulationState'
   */
  async execute(res: express.Response): Promise<void> {
    try {
      const controller = new GetStateService();
      const data = await controller.execute();
      res.status(200).send(data);
    } catch (err) {
      handleErr(err as types.IFullError, res);
    }
  }
}
