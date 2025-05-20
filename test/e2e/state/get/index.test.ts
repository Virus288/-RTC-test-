import supertest from 'supertest';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import State from '../../../../src/tools/state';
import fakeData from '../../../utils/fakes/data/fakeSimulation.json';
import FakeSimulationRepository from '../../../utils/fakes/repos/simulationRepository';
import FakeClientLogic from '../../../utils/fakes/services/clientLogic';
import type { IGetSimulationState } from '../../../../src/services/state/subModules/get/types';
import type { ISimulationState } from '../../../../src/services/state/types';
import type { Express } from 'express';
import type { IAddSimulation } from 'services/state/repository/types';

describe('State', () => {
  let app: Express | null = null;
  let fake: FakeClientLogic | undefined = undefined;
  let fakeDatabase: FakeSimulationRepository | undefined = undefined;

  beforeAll(() => {
    // eslint-disable-next-line prefer-destructuring
    app = State.router.app;
  });

  beforeEach(() => {
    State.controllers.init();

    State.clientLogic?.close();
    fake = FakeClientLogic.getInstance();
    fakeDatabase = FakeSimulationRepository.getInstance();
    State.clientLogic = fake;
  });

  afterEach(() => {
    State.controllers.close();
  });

  describe('Should pass', () => {
    it("Get app's state", async () => {
      State.clientLogic.init();
      await fakeDatabase!.add(
        (fakeData.data.formatted as Record<string, IAddSimulation>)['3eccf850-571f-4e18-8cb3-2c9e3afade7b']!,
      );

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
