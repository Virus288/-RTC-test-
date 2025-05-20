import type { IQuery } from '../../../types';
import type express from 'express';

export type IGetStateReq = express.Request<unknown, unknown, undefined, IQuery>;
