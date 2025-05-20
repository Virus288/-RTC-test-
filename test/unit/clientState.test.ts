import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import ClientState from '../../src/services/state/clientState';
import fakeData from '../utils/fakes/data/fakeSimulation.json';
import FakeSimulationRepository from '../utils/fakes/repos/simulationRepository';
import type { ISimulationMappingsBody, ISimulationStateBody } from '../../src/services/state/types';

describe('Client state', () => {
  let clientState: ClientState;

  beforeEach(() => {
    clientState = ClientState.getInstance(FakeSimulationRepository.getInstance());
  });

  afterEach(() => {
    clientState.close();
  });

  describe('Should pass', () => {
    it('Add new mappints', () => {
      expect(() =>
        clientState.updateMappings((fakeData.data.rawMappings as ISimulationMappingsBody[])[0]!),
      ).not.toThrowError();
    });

    it('Should not resolve simulation without mappings', () => {
      expect(clientState.updateSimulation((fakeData.data.raw as ISimulationStateBody[])[0]!)).toBe(false);
    });

    it('Should resolve simulation with mappings', () => {
      clientState.updateMappings((fakeData.data.rawMappings as ISimulationMappingsBody[])[0]!);
      const status = clientState.updateSimulation((fakeData.data.raw as ISimulationStateBody[])[0]!);

      expect(status).toBe(true);

      const simulations = clientState.getGames();
      expect(simulations.length).toBe(10);
    });
  });
});
