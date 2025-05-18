export interface IAbstractSubService<T> {
  execute(...params: unknown[]): Promise<T>;
}
