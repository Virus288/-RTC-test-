import { beforeAll, describe, expect, it } from 'vitest';
import supertest from 'supertest'
import State from '../../../src/tools/state'
import { Express } from 'express'
import { IGetHealth } from '../../../src/services/health/subModules/get/types';

describe('Health', () => {
  let app: Express | null = null

  beforeAll(() => {
    app = State.router.app
  })

  describe('Should pass', () => {
    it(`Get health report when app is down`, async () => {

      const res = await supertest(app!)
        .get('/health')
        .send();

      const body = res.body as IGetHealth;

      expect(body?.alive).toBe(false);
    });

    it(`Get health report when app is up`, async () => {
      State.alive = true

      const res = await supertest(app!)
        .get('/health')
        .send();

      const body = res.body as IGetHealth;

      expect(body?.alive).toBe(true);
    });
  })
});
