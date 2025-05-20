import type { IAddSimulation, ISimulationRepository } from '../../../../src/services/state/repository/types';
import type { ISimulationState } from '../../../../src/services/state/types';

export default class FakeSimulationRepository implements ISimulationRepository {
  private constructor() {
    //
  }

  private static accessor instance: FakeSimulationRepository | undefined = undefined;

  static getInstance(): FakeSimulationRepository {
    FakeSimulationRepository.instance ??= new FakeSimulationRepository();

    return FakeSimulationRepository.instance;
  }

  private accessor data: Map<string, ISimulationState> = new Map();

  async add(simulation: IAddSimulation): Promise<string> {
    return new Promise((resolve) => {
      this.data.set(simulation.id, simulation);
      resolve(simulation.id);
    });
  }

  async update(simulation: IAddSimulation): Promise<void> {
    return new Promise((resolve) => {
      this.data.set(simulation.id, simulation);
      resolve();
    });
  }

  async get(id: string): Promise<ISimulationState | undefined> {
    return new Promise((resolve) => {
      resolve(this.data.get(id));
    });
  }

  async getAll(): Promise<ISimulationState[]> {
    return new Promise((resolve) => {
      resolve(Array.from(this.data.values()));
    });
  }
}
