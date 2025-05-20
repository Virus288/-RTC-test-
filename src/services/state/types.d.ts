import type { ESimulationKeys } from './enums';
import type { ESimulationCompetitors, ESimulationStatus } from '../../enums/index';

export interface ISimulationStateBody {
  odds: string;
}

export type ISimulationMappings = Record<string, string>;

export interface ISimulationMappingsBody {
  mappings: string;
}

export interface ISimulationState {
  id: string;
  status: ESimulationStatus;
  scores: Record<string, ISimulationScores>;
  startTime: string;
  sport: string;
  competitors: Record<ESimulationCompetitors, ISimulationCompetitors>;
  competition: string;
}

export interface ISimulationScores {
  type: string;
  home: string;
  away: string;
}

export interface ISimulationCompetitors {
  type: ESimulationCompetitors;
  name: string;
}

export interface IRepositoryGetData {
  [ESimulationKeys.ID]: string;
  [ESimulationKeys.SPORT]: string;
  [ESimulationKeys.COMPETITION]: string;
  [ESimulationKeys.START_TIME]: string;
  [ESimulationKeys.HOME_COMPETITOR]: string;
  [ESimulationKeys.AWAY_COMPETITOR]: string;
  [ESimulationKeys.STATUS]: ESimulationStatus;
  [ESimulationKeys.SCORES]: string;
}
