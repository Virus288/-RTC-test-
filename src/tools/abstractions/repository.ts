import type * as types from '../../types/index';

export default abstract class RepositoryFactory implements types.IAbstractRepository {
  /**
   * Add new element to database.
   * @param _data
   */
  async add(_data: unknown): Promise<string> {
    return new Promise((resolve) => {
      resolve('');
    });
  }

  /**
   * Update element in database.
   * @param _id
   * @param _data
   */
  async update(_id: string, _data: unknown): Promise<void> {
    return new Promise((resolve) => {
      resolve();
    });
  }

  /**
   * Get element from database.
   * @param _id
   */
  async get(_id: unknown): Promise<unknown> {
    return new Promise((resolve) => {
      resolve({} as unknown);
    });
  }
}
