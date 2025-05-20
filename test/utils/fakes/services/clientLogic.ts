import { vi } from 'vitest';
import ClientLogic from '../../../../src/services/state';
import ClientState from '../../../../src/services/state/clientState';
import FakeSimulationRepository from '../repos/simulationRepository';
import type { ISimulationMappingsBody, ISimulationStateBody } from '../../../../src/services/state/types';
import type { Procedure } from '../../types';
import type { Mock } from 'vitest';

export default class FakeClientLogic extends ClientLogic {
  private readonly _handleFetchDataMock: Mock<Procedure> = vi.fn();

  protected constructor() {
    super();
    this.state = ClientState.getInstance(FakeSimulationRepository.getInstance());
  }

  protected static override accessor instance: FakeClientLogic | undefined = undefined;

  get handleFetchDataMock(): Mock<Procedure> {
    return this._handleFetchDataMock;
  }

  static override getInstance(): FakeClientLogic {
    FakeClientLogic.instance ??= new FakeClientLogic();

    return FakeClientLogic.instance;
  }

  addFakeLocalGames(data: ISimulationStateBody): void {
    this.state.updateSimulation(data);
  }

  addFakeMapping(data: ISimulationMappingsBody): void {
    this.state.updateMappings(data);
  }

  /**
   * Mock handleFetchData
   * Because thats the only logic in this class, I want to mock it. I do understand that this class should be more dynamic, but I wanted to keep it as strict as possible.
   */
  protected override async handleFetchData(): Promise<boolean> {
    return new Promise((resolve) => {
      resolve(this.handleFetchDataMock() as Promise<boolean>);
    });
  }
}
