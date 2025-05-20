import type { ISimulationState } from '../types';

export type IAddSimulation = ISimulationState;

export interface ISimulationRepository {
  add(simulation: IAddSimulation): Promise<string>;
  get(id: string): Promise<ISimulationState | undefined>;
  getAll(): Promise<ISimulationState[]>;
}
