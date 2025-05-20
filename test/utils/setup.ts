import { afterAll, beforeAll, vi } from 'vitest';
import FakeConfigLoader from './fakes/tools/configLoader';

vi.mock('../../src/tools/configLoader/index', () => {
  return {
    default: FakeConfigLoader,
  };
});

// eslint-disable-next-line import/order
import Connections from './connections';

const connections = new Connections();

beforeAll(() => {
  connections.connect();
});

afterAll(() => {
  connections.close();
});
