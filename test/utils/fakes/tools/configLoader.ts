import { IConfig } from '../../../../src/types';

export default class FakeConfigLoader  {
  static  getConfig(): IConfig {
    return {
      "port": 5008,
      "myAddress": "http://localhost",
      "corsOrigin": ["http://localhost"],
      "trustProxy": false
    }
  }

  /**
   * Validate if config is correct.
   */
  static  validateConfig(): void {
    FakeConfigLoader.getConfig();
  }
}
