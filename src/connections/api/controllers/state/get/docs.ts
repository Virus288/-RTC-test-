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
 *       description: Identifies a competitor as home or away.
 *       example: HOME
 *
 *     SimulationScores:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           description: The type of score (e.g., final, halftime).
 *           example: "final"
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
 *           example: "Team A"
 *
 *     SimulationState:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier of the simulation.
 *           example: "sim-1234"
 *         status:
 *           $ref: '#/components/schemas/ESimulationStatus'
 *         scores:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/SimulationScores'
 *           description: Scores keyed by arbitrary string identifiers.
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: ISO string for the start time of the simulation.
 *           example: "2025-05-18T14:00:00Z"
 *         sport:
 *           type: string
 *           description: Type of sport for the simulation.
 *           example: "football"
 *         competitors:
 *           type: object
 *           additionalProperties:
 *             $ref: '#/components/schemas/SimulationCompetitors'
 *           description: Competitors keyed by HOME or AWAY.
 *         competition:
 *           type: string
 *           description: Name or ID of the competition.
 *           example: "Premier League"
 */
