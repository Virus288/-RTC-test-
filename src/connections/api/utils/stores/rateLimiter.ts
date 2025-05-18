import InMemoryStore from './inMemoryStore';
import Log from '../../../../tools/logger/index';
import type { IncrementResponse, Store } from 'express-rate-limit';

class RateLimiterStore implements Store {
  private readonly _filter: RegExp = /\b(?:\d{1,3}\.){3}\d{1,3}\b/gu;
  private readonly _store: Store;

  constructor(store: Store) {
    this._store = store;
  }

  private get filter(): RegExp {
    return this._filter;
  }

  private get store(): Store {
    return this._store;
  }

  /**
   * Increment request count for a given IP address.
   * If target is local address like ::1 or other, its by default inserted.
   * @param key Client's ip address or key .
   * @returns Incremented session data.
   */
  async increment(key: string): Promise<IncrementResponse> {
    Log.debug('Rate limiter', `Incrementing ${key}`);

    const target = key === '::1' ? key : key.match(this.filter)![0];
    return this.store.increment(target);
  }

  /**
   * Reset the request count for a given user.
   * @param key Client's ip or key.
   */
  async resetKey(key: string): Promise<void> {
    Log.debug('Rate limiter', `Resetting ${key}`);

    const target = key === '::1' ? key : key.match(this.filter)![0];
    return this.store.resetKey(target);
  }

  /**
   * Decrease hits for selected user.
   * @param key Client's ip or key.
   */
  async decrement(key: string): Promise<void> {
    Log.debug('Rate limiter', `Decrementing ${key}`);

    const target = key === '::1' ? key : key.match(this.filter)![0];
    return this.store.decrement(target);
  }
}

export default class RateLimiterFactory {
  static create(): Store {
    switch (process.env.NODE_ENV) {
      case 'production':
        return new RateLimiterStore(new InMemoryStore()); // This is a place for production store. Replace it with proper store
      default:
        return new RateLimiterStore(new InMemoryStore());
    }
  }
}
