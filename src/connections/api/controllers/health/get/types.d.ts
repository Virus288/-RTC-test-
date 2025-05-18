import type { IQuery } from '../../../types';
import type express from 'express';

export type IGetHealthReq = express.Request<unknown, unknown, undefined, IQuery>;
