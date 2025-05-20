import Log from '../../../../tools/logger/index';
import State from '../../../../tools/state';
import type { IGetHealth } from './types';
import fs from 'fs';
import { uptime } from 'process';

export default class GetHealthService {
  /**
   * Execute logic for get health service.
   */
  async execute(): Promise<IGetHealth> {
    return new Promise((resolve) => {
      Log.debug('Health get service', 'Getting health');

      const jsonPackage = JSON.parse(fs.readFileSync('package.json').toString()) as Record<string, string>;
      resolve({ alive: State.alive, version: jsonPackage.version as string, uptime: uptime().toFixed(1) });
    });
  }
}
