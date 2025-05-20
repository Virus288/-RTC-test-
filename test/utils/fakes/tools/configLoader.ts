import type { IConfig } from '../../../../src/types';

export default class FakeConfigLoader {
  static getConfig(): IConfig {
    return {
      port: 5008,
      corsOrigin: ['http://localhost'],
      apiTarget: 'http://localhost:3000',
      apiReqTimeout: 5000,
      iterationsTimeout: 1000,
      repository: 'memory',
    };
  }

  /**
   * Validate if config is correct.
   */
  static validateConfig(): void {
    FakeConfigLoader.getConfig();
  }
}
