/**
 * @openapi
 * components:
 *   schemas:
 *     HealthStatus:
 *       type: object
 *       properties:
 *         alive:
 *           type: boolean
 *           description: Indicates if the service is alive.
 *           example: true
 *         uptime:
 *           type: string
 *           description: Amount of time in seconds, since application started.
 *           example: '20'
 *         version:
 *           type: string
 *           description: Application's version.
 *           example: '0.1.1'
 */
