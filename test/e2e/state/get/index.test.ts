import supertest from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import State from '../../../../src/tools/state';
import fakeData from '../../../utils/fakes/data/fakeSimulation.json';
import FakeClientLogic from '../../../utils/fakes/services/clientLogic';
import type { IGetSimulationState } from '../../../../src/services/state/subModules/get/types';
import type {
  ISimulationMappingsBody,
  ISimulationState,
  ISimulationStateBody,
} from '../../../../src/services/state/types';
import type { Express } from 'express';

describe('State', () => {
  let app: Express | null = null;
  let fake: FakeClientLogic | undefined = undefined;

  beforeAll(() => {
    // eslint-disable-next-line prefer-destructuring
    app = State.router.app;
  });

  beforeEach(() => {
    State.controllers.init();

    State.clientLogic?.close();
    fake = FakeClientLogic.getInstance();
    State.clientLogic = fake;
  });

  afterEach(() => {
    State.controllers.close();
  });

  describe('Should pass', () => {
    it("Get app's state", async () => {
      fake?.addFakeMapping((fakeData.data.rawMappings as ISimulationMappingsBody[])[0]!);
      fake?.addFakeLocalGames((fakeData.data.raw as ISimulationStateBody[])[0]!);
      State.clientLogic.init();

      const res = await supertest(app!).get('/client/state').send();

      const body = res.body as IGetSimulationState;
      const requiredKeys = ['id', 'status', 'scores', 'startTime', 'sport', 'competitors', 'competition'];

      expect(Object.keys(body).length).not.toBe(0);
      Object.values(body).forEach((value) => {
        requiredKeys.forEach((k) => {
          expect(value[k as keyof ISimulationState]).not.toBeUndefined();
        });
      });
    });
  });
});
