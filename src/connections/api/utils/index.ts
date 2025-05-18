import rateLimit from 'express-rate-limit';
import { ETTL } from '../enums';
import RateLimitStore from './stores/rateLimiter';
import ConfigLoader from '../../../tools/configLoader/index';
import type express from 'express';

/**
 * Rate limiter for routes access.
 * This limiter is disabled in tests.
 * @param _req Express.Request.
 * @param _res Express.Response.
 * @param next Express.Next.
 */
export default process.env.NODE_ENV === 'test'
  ? (_req: express.Request, _res: express.Response, next: express.NextFunction): void => {
      next();
    }
  : rateLimit({
      store: RateLimitStore.create(),
      windowMs: ETTL.ExpressRateLimiter * 1000,
      limit: 30,
      message: { data: 'Too many requests from this IP, please try again in an 1 min' },
      validate: { trustProxy: ConfigLoader.getConfig().trustProxy },
    });
