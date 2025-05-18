import type { ClientRateLimitInfo, IncrementResponse, Store } from 'express-rate-limit';

/**
 * This is in memory store created for rate limiter. This is to be changed in real environment.
 * Most of actions are async, to make them already compatible with real live usage, for example redis.
 */
export default class InMemoryStore implements Store {
  private readonly _store: Map<string, ClientRateLimitInfo> = new Map();

  private get store(): Map<string, ClientRateLimitInfo> {
    return this._store;
  }

  /**
   * Increment entry.
   * @param target Ip to increment.
   */
  async increment(target: string): Promise<IncrementResponse> {
    return new Promise((resolve) => {
      let data: ClientRateLimitInfo | undefined = this.store.get(target);

      if (!data) {
        data = { totalHits: 1, resetTime: new Date(Date.now() + 60 * 1000) };
      } else {
        if (data.totalHits > 30) {
          return resolve({ ...data, resetTime: new Date(data.resetTime!) });
        }
        data = { totalHits: (data.totalHits += 1), resetTime: new Date(Date.now() + 60 * 1000) };
      }

      this.store.set(target, data);

      return resolve(data);
    });
  }

  /**
   * Reset entry.
   * @param target Ip to reset.
   */
  async resetKey(target: string): Promise<void> {
    return new Promise((resolve) => {
      this.store.delete(target);
      resolve();
    });
  }

  /**
   * Decrement entry.
   * @param target Ip to decrement.
   */
  async decrement(target: string): Promise<void> {
    return new Promise((resolve) => {
      let data: ClientRateLimitInfo | undefined = this.store.get(target);
      if (!data) return resolve();

      data = {
        totalHits: data.totalHits > 2 ? (data.totalHits -= 1) : 1,
        resetTime: new Date(Date.now() + 60 * 1000),
      };

      this.store.set(target, data);
      return resolve();
    });
  }
}
