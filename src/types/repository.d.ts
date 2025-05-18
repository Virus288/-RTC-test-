export interface IAbstractRepository {
  add(data: unknown): Promise<string>;
  get(data: unknown): Promise<unknown>;
}
