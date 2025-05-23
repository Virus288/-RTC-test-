import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import initHealthRoutes from './controllers/health/index';
import initStateRoutes from './controllers/state';
import { FourOhFour } from '../../errors/index';
import ConfigLoader from '../../tools/configLoader';
import Log from '../../tools/logger/index';
import type express from 'express';
import type swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';

export default class AppRouter {
  private readonly _router: express.Router;

  constructor(router: express.Router) {
    this._router = router;
  }

  private get router(): express.Router {
    return this._router;
  }

  /**
   * Initialize routes.
   */
  initRoutes(): void {
    initHealthRoutes();
    initStateRoutes();
  }

  /**
   * Initialize 404 router.
   * @param app
   */
  initFourOhFour(app: express.Express): void {
    app.all(/(.*)/, (_req, res) => {
      const { status, code, message, name } = new FourOhFour();

      res.status(status).send({
        error: {
          message,
          code,
          name,
        },
      });
    });
  }

  /**
   * Initialize swagger documentation.
   */
  generateDocumentation(): void {
    const jsonPackage = JSON.parse(fs.readFileSync('package.json').toString()) as Record<string, string>;
    const options: swaggerJsdoc.Options = {
      definition: {
        openapi: '3.0.1',
        description: 'This is a Real-time Crawler server',
        servers: [
          {
            url: 'http://localhost',
            description: 'Development server',
          },
        ],
        info: {
          title: 'RTC Server',
          version: jsonPackage.version as string,
        },
      },
      apis: [
        './src/errors/index.ts',
        './src/errors/index.js',
        './src/connections/api/controllers/*/*/index.ts',
        './src/connections/api/controllers/*/*/index.js',
        './src/connections/api/controllers/*/*/docs.ts',
        './src/connections/api/controllers/*/*/docs.js',
        './src/services/*/*/*/dto.ts',
        './src/services/*/*/*/dto.js',
        './src/services/*/*/dto.ts',
        './src/services/*/*/dto.js',
        './src/services/*/*/docs.ts',
        './src/services/*/*/docs.js',
      ],
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.router.get('docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });

    Log.log('Swagger', `Started swagger documentation at: http://localhost:${ConfigLoader.getConfig().port}/api/docs`);
  }
}
