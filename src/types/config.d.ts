import type { EConfigKeys } from '../tools/configLoader/enums';

export interface IConfig {
  [EConfigKeys.MY_ADDRESS]: string;
  [EConfigKeys.CORS_ORIGIN]: string[];
  [EConfigKeys.PORT]: number;
  [EConfigKeys.API_TARGET]: string;
  [EConfigKeys.API_REQ_TIMEOUT]: number;
  [EConfigKeys.ITERATIONS_TIMEOUT]: number;
  [EConfigKeys.REPOSITORY]: string;
}
