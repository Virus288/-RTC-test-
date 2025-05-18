import type express from 'express';

export type IAsyncRoute<This, T> = (
  target: (this: This, req: express.Request, res: express.Response, next?: express.NextFunction) => Promise<T>,
  context: ClassMethodDecoratorContext<This, (this: This, req: express.Request, res: express.Response) => Promise<T>>,
) => undefined | (() => Promise<T>);

export type IRoute<This, T> = (
  target: (this: This, req: express.Request, res: express.Response, next?: express.NextFunction) => T,
  context: ClassMethodDecoratorContext<This, (this: This, req: express.Request, res: express.Response) => T>,
) => undefined | (() => T);
