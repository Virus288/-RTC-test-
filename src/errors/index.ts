export class FullError extends Error {
  code = '000';
  status = 500;
}

/**
 * @openapi
 * components:
 *   schemas:
 *     InternalError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'InternalError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '001'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Internal error. Try again later'
 */
export class InternalError extends FullError {
  constructor() {
    super('Internal error. Try again later');
    this.name = 'InternalError';
    this.code = '001';
    this.status = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     IncorrectDataType:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'IncorrectDataType'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '002'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Received request is not json type'
 */
export class IncorrectDataType extends FullError {
  constructor() {
    super('Received request is not json type');
    this.name = 'IncorrectDataType';
    this.code = '002';
    this.status = 400;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     FourOhFour:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'FourOhFour'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '003'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Resource not found or is inaccessible for you"
 */
export class FourOhFour extends FullError {
  constructor() {
    super('Resource not found or is inaccessible for you');
    this.name = 'FourOhFour';
    this.code = '003';
    this.status = 404;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     FourOhFour:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'InvalidConfigError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '0044'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: "Config file is missing, cannot be read or is malformed"
 */
export class InvalidConfigError extends FullError {
  constructor() {
    super('Config file is missing, cannot be read or is malformed');
    this.name = 'InvalidConfigError';
    this.code = '004';
    this.status = 500;
  }
}

/**
 * @openapi
 * components:
 *   schemas:
 *     UnregisteredControllerError:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Error name describing the error cause.
 *           example: 'UnregisteredControllerError'
 *         code:
 *           type: string
 *           description: Unique code associated with the error.
 *           example: '005'
 *         message:
 *           type: string
 *           description: Error message describing the error cause.
 *           example: 'Controllers with target ${target} were not registered !'
 */
export class UnregisteredControllerError extends FullError {
  constructor(target: string) {
    super(`Controllers with target ${target} were not registered !`);
    this.name = 'UnregisteredControllerError';
    this.code = '005';
    this.status = 500;
  }
}
