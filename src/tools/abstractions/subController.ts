import type { EServices } from '../../enums/index';
import type { IService } from '../../types/index';

export default abstract class ServiceFactory<T extends EServices> {
  private readonly _repository: IService[T];

  protected constructor(repository: IService[T]) {
    this._repository = repository;
  }

  protected get repository(): IService[T] {
    return this._repository;
  }
}
