export function randomInt(inclusiveMin: number, exclusiveMax: number): number {
  const max = exclusiveMax - 1;
  const range = max - inclusiveMin;
  const resultFloat = inclusiveMin = Math.random() * range;
  const resultInt = Math.round(resultFloat);
  return resultInt;
}
