import Log from '../../../tools/logger/index';
import type { ISimulationState } from '../types';
import type { IAddSimulation, ISimulationRepository } from './types';

export default class InMemorySimulationRepository implements ISimulationRepository {
  private accessor data: Map<string, ISimulationState> = new Map();

  async add(simulation: IAddSimulation): Promise<string> {
    Log.debug('In memory repository', 'Adding new data');
    return new Promise((resolve) => {
      this.data.set(simulation.id, simulation);
      resolve(simulation.id);
    });
  }

  async update(simulation: IAddSimulation): Promise<void> {
    Log.debug('In memory repository', 'Updating new data');
    return new Promise((resolve) => {
      this.data.set(simulation.id, simulation);
      resolve();
    });
  }

  async get(id: string): Promise<ISimulationState | undefined> {
    Log.debug('In memory repository', 'Getting new data');
    return new Promise((resolve) => {
      resolve(this.data.get(id));
    });
  }

  async getAll(): Promise<ISimulationState[]> {
    Log.debug('In memory repository', 'Getting all data');
    return new Promise((resolve) => {
      resolve(Array.from(this.data.values()));
    });
  }
}
