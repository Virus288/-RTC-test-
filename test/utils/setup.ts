import { afterAll, beforeAll, vi } from 'vitest';
import FakeConfigLoader from './fakes/tools/configLoader'

vi.mock('../../src/tools/configLoader/index', () => {
    return {
      default: FakeConfigLoader
    };
  });

import Connections from './connections'


const connections = new Connections()

beforeAll(async () => {
  connections.connect()


})

afterAll(() => {
  connections.close()
});

