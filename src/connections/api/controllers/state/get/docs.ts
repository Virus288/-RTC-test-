/**
 * @openapi
 * components:
 *   schemas:
 *     ESimulationStatus:
 *       type: string
 *       enum:
 *         - LIVE
 *         - REMOVED
 *       description: The current status of the simulation.
 *       example: LIVE
 *
 *     ESimulationCompetitors:
 *       type: string
 *       enum:
 *         - HOME
 *         - AWAY
 *       description: Identifier for team.
 *       example: HOME
 *
 *     SimulationScores:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: The type of score.
 *           example: "CURRENT"
 *         home:
 *           type: string
 *           description: Score for the home team.
 *           example: "2"
 *         away:
 *           type: string
 *           description: Score for the away team.
 *           example: "1"
 *
 *     SimulationCompetitors:
 *       type: object
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/ESimulationCompetitors'
 *         name:
 *           type: string
 *           description: Name of the competitor.
 *           example: "HOME"
 *
 *     SimulationState:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Identifier of the simulation.
 *           example: "1234"
 *         status:
 *           $ref: '#/components/schemas/ESimulationStatus'
 *         scores:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/SimulationScores'
 *           description: Scores for each of teams.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: ISO string for start time of the simulation.
 *           example: "2025-05-18T14:00:00Z"
 *         sport:
 *           type: string
 *           description: Type of sport for the simulation.
 *           example: "FOOTBALL"
 *         competitors:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/SimulationCompetitors'
 *           description: Competitors list, which includes 'HOME' or 'AWAY'.
 *         competition:
 *           type: string
 *           description: Name or ID of the competition.
 *           example: "Random game"
 */
