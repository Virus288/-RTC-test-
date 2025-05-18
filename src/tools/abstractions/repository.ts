import type * as types from '../../types/index';

export default abstract class RepositoryFactory implements types.IAbstractRepository {
  async add(_data: unknown): Promise<string> {
    return new Promise((resolve) => {
      resolve('');
    });
  }

  async update(_id: string, _data: unknown): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  async get(_id: unknown): Promise<unknown> {
    return new Promise((resolve) => {
      resolve({} as unknown);
    });
  }
}
