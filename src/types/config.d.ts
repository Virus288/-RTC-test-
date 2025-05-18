import type { EConfigKeys } from '../tools/configLoader/enums';

export interface IConfig {
  [EConfigKeys.MY_ADDRESS]: string;
  [EConfigKeys.CORS_ORIGIN]: string[];
  [EConfigKeys.PORT]: number;
  [EConfigKeys.TRUST_PROXY]: boolean;
}
