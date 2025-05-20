import InMemorySimulationRepository from './inMemory';
import FakeSimulationRepository from '../../../../test/utils/fakes/repos/simulationRepository';
import { NoRepositoryControllerSpecified } from '../../../errors';
import ConfigLoader from '../../../tools/configLoader';
import Log from '../../../tools/logger';
import type { ISimulationState } from '../types';
import type { IAddSimulation, ISimulationRepository } from './types';

class SimulationRepository implements ISimulationRepository {
  constructor(repository: ISimulationRepository) {
    this.repository = repository;
  }

  private accessor repository: ISimulationRepository;

  async add(simulation: IAddSimulation): Promise<string> {
    return this.repository.add(simulation);
  }

  async get(id: string): Promise<ISimulationState | undefined> {
    return this.repository.get(id);
  }

  async getAll(): Promise<ISimulationState[]> {
    return this.repository.getAll();
  }
}

export default class SimulationFactory {
  static getInstance(): ISimulationRepository {
    if (this.instance) return this.instance;

    const repositoryTarget = ConfigLoader.getConfig().repository;

    if (process.env.NODE_ENV === 'test') {
      SimulationFactory.instance = new SimulationRepository(FakeSimulationRepository.getInstance());
      return SimulationFactory.instance;
    }

    switch (repositoryTarget) {
      case 'memory':
        SimulationFactory.instance = new SimulationRepository(new InMemorySimulationRepository());
        return SimulationFactory.instance;
      default:
        Log.error('No repository controller specified. Please specify type of controller in config files');
        throw new NoRepositoryControllerSpecified();
    }
  }

  private static accessor instance: ISimulationRepository | undefined = undefined;
}
