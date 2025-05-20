import supertest from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import State from '../../../src/tools/state';
import type { IGetHealth } from '../../../src/services/health/subModules/get/types';
import type { Express } from 'express';
import { afterEach, beforeEach } from 'node:test';

describe('Health', () => {
  let app: Express | null = null;

  beforeAll(() => {
    // eslint-disable-next-line prefer-destructuring
    app = State.router.app;
  });

  beforeEach(() => {
    State.controllers.init();
  });

  afterEach(() => {
    State.controllers.close();
  });

  describe('Should pass', () => {
    it('Get health report when app is down', async () => {
      const res = await supertest(app!).get('/health').send();

      const body = res.body as IGetHealth;

      expect(body?.alive).toBe(false);
    });

    it('Get health report when app is up', async () => {
      State.alive = true;

      const res = await supertest(app!).get('/health').send();

      const body = res.body as IGetHealth;

      expect(body?.alive).toBe(true);
    });
  });
});
