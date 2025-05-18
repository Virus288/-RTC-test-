import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import initHealthRoutes from './controllers/health/index';
import { FourOhFour } from '../../errors/index';
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
        './src/modules/*/docs.ts',
        './src/modules/*/*/router.ts',
        './src/modules/*/*/docs.ts',
        './src/modules/*/*/dto.ts',
        './src/modules/*/*/*/docs.ts',
        './src/modules/*/*/*/dto.ts',
        './src/connections/router/services/*/*/index.ts',
        './src/errors/index.js',
        './src/modules/*/docs.js',
        './src/modules/*/*/router.js',
        './src/modules/*/*/docs.js',
        './src/modules/*/*/dto.js',
        './src/modules/*/*/*/docs.js',
        './src/modules/*/*/*/dto.js',
        './src/connections/router/services/*/*/index.js',
      ],
    };

    const swaggerSpec = swaggerJSDoc(options);
    this.router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    this.router.get('docs.json', (_req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
    });
  }
}
