import { beforeEach, describe, expect, it } from 'vitest';
import { RequestTimedOut } from '../../src/errors/index';
import State from '../../src/tools/state';
import { sleep } from '../utils';
import fakeData from '../utils/fakes/data/fakeSimulation.json';
import FakeClientLogic from '../utils/fakes/services/clientLogic';
import type { ISimulationMappingsBody, ISimulationStateBody } from '../../src/services/state/types';

describe('Client logic', () => {
  let fake: FakeClientLogic | undefined = undefined;

  beforeEach(() => {
    State.clientLogic?.close();
    fake = FakeClientLogic.getInstance();
    State.clientLogic = fake;
  });

  describe('Should pass', () => {
    it('Initialize client and spy on request', async () => {
      State.clientLogic.init();

      await sleep(2000);

      expect(fake!.handleFetchDataMock).toHaveBeenCalledTimes(1);
    });

    it('Initialize client, watch it retry for 5 times', async () => {
      fake?.handleFetchDataMock.mockRejectedValue(new RequestTimedOut());

      State.clientLogic.init();

      await sleep(7000);

      expect(fake!.handleFetchDataMock).toHaveBeenCalledTimes(6);
    });

    it('Initialize client, get empty state', () => {
      State.clientLogic.init();

      const data = State.clientLogic.getCurrentState();

      expect(data.length).toBe(0);
    });

    it('Initialize client, get full state', () => {
      fake?.addFakeMapping((fakeData.data.rawMappings as ISimulationMappingsBody[])[0]!);
      fake?.addFakeLocalGames((fakeData.data.raw as ISimulationStateBody[])[0]!);
      State.clientLogic.init();

      const data = State.clientLogic.getCurrentState();

      expect(data.length).toBe(10);
    });
  });
});
