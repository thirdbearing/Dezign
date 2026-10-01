export const LABS = [
  { id: "effects", phase: 1 },
  { id: "poster", phase: 2 },
  { id: "type", phase: 3 },
  { id: "pattern", phase: 4 },
  { id: "shape", phase: 4 },
  { id: "3d", phase: 8 },
  { id: "play", phase: 4 },
] as const;

export type LabId = (typeof LABS)[number]["id"];

export function isLabId(value: string): value is LabId {
  return LABS.some((lab) => lab.id === value);
}
