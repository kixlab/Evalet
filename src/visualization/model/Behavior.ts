export interface Behavior {
  id: string;
  behavior: string;
  context: string | null;
  feature: string | null;
  evaluation: string | null;
  clusterId: string | null;
  isPositive: boolean | null;
  criteriaId: string;
  pairDataId: string;
  vec1Value: number | null;
  vec2Value: number | null;
  behaviorsForBaseline?: Behavior[];
}
