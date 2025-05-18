import { afterAll, beforeAll } from 'vitest';
import Connections from './connections.js'

const connections = new Connections()

beforeAll(async () => {
  connections.connect()
})

afterAll(() => {
  connections.close()
});
