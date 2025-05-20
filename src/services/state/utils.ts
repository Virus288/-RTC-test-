import type { ISimulationState } from './types';

/**
 * Show differences between 2 simulations.
 * @param newTarget New simulation object.
 * @param oldTarget Old simulation object.
 * @param path Upper level path for tracking nested keys.
 */
// eslint-disable-next-line import/prefer-default-export
export const diffSimulations = (
  newTarget: Partial<ISimulationState>,
  oldTarget: Partial<ISimulationState>,
  path: string = '',
): Record<string, unknown> => {
  const changes: Record<string, unknown> = {};

  const allKeys = new Set([...Object.keys(newTarget ?? {}), ...Object.keys(oldTarget ?? {})]);

  Array.from(allKeys).forEach((key) => {
    const fullPath = path ? `${path}.${key}` : key;
    const newData = newTarget?.[key as keyof ISimulationState];
    const oldData = oldTarget?.[key as keyof ISimulationState];

    if (isObject(newData as Record<string, unknown>) && isObject(oldData as Record<string, unknown>)) {
      const nestedChanges = diffSimulations(
        newData as Partial<ISimulationState>,
        oldData as Partial<ISimulationState>,
        fullPath,
      );
      Object.entries(nestedChanges).forEach(([nestedKey, value]) => {
        changes[nestedKey] = value;
      });
    } else if (newData !== oldData) {
      changes[fullPath] = [newData, oldData];
    }
  });

  return changes;
};

/**
 * Check if element is object type.
 * @param data
 */
const isObject = (data: unknown): data is Record<string, unknown> => {
  return !!data && typeof data === 'object' && !Array.isArray(data);
};
