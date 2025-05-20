export interface IFullError extends Error {
  code: string;
  status: number;
}

export interface IPossiblyFullError extends Error {
  code?: string;
  status?: number;
}
