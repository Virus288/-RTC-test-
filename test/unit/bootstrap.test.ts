import { beforeEach, describe, expect, it  } from 'vitest';
import Bootstrap from '../../src/tools/bootstrap';
import { EHealthActions, EServices } from '../../src/enums/index';
import HealthController from '../../src/services/health/controller';
import GetHealthService from '../../src/services/health/subModules/get';
import getService from '../../src/connections/api/utils/services';
import State from '../../src/tools/state'
import FakeHealthController from '../utils/fakes/controllers/health';
import { IFullError } from '../../src/types';
import { UnregisteredControllerError } from '../../src/errors';

describe('Bootstrap', () => {
  beforeEach(() => {
    State.controllers.close()
    // @ts-expect-error Ignoring this interface. For testing purposes, bootstrap should be killable
    State.controllers = undefined
    State.controllers = Bootstrap.getInstance()
  })

  describe('Should pass', () => {
    it(`Resolve unregistered controller`, async () => {
      const controller = State.controllers.resolve(EServices.Health)
      expect(controller).toBeUndefined()
    });

    it(`Register new controller and resolve it`, async () => {
      State.controllers.register(EServices.Health, new HealthController())

      const controller = State.controllers.resolve(EServices.Health)
      expect(controller).not.toBeUndefined()
    });

    it(`Register new controller and resolve it`, async () => {
      State.controllers.register(EServices.Health, new HealthController())

      const controller = State.controllers.resolve(EServices.Health)
      expect(controller).not.toBeUndefined()
    });

    it(`Register new controller with service and resolve service`, async () => {
      State.controllers.register(EServices.Health, new FakeHealthController())
      const controller = State.controllers.resolve(EServices.Health)

      expect(controller).not.toBeUndefined()

      controller?.register(EHealthActions.Get, new GetHealthService())
      const service = getService(EServices.Health, EHealthActions.Get)
      expect(service).not.toBeUndefined()
    });

    it(`Register new controller without service and resolve service`, async () => {
      State.controllers.register(EServices.Health, new FakeHealthController())
      const controller = State.controllers.resolve(EServices.Health)

      expect(controller).not.toBeUndefined()

      let error: IFullError | undefined = undefined
      const target = new UnregisteredControllerError(EHealthActions.Get)

      try {
        getService(EServices.Health, EHealthActions.Get)
      } catch (err) {
        error = err as IFullError
      }

      expect(error).not.toBeUndefined()
      expect(error!.message).toEqual(target.message)
      expect(error!.code).toEqual(target.code)
      expect(error!.status).toEqual(target.status)
    })
  })
});
