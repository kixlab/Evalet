export interface Criteria {
  id: string;
  title: string;
  description: string;
  rubrics: Rubric[];
  attributes: Attribute[];
  color: string;
  isNecessary: boolean;
}

export interface Rubric {
  point: number;
  rubric: string;
}

export interface Attribute {
  id: string;
  title: string;
  description: string;
}

export function criterionToString(criterion: Criteria): string {
  return `- **${criterion.title}**\n${`  Description: ${criterion.description}`}\n### Attributes\n${criterion.attributes.map((a) => `  - ${a.title}: ${a.description}`).join('\n')}`;
}

// RUBRIC RANGE CONSTANTS
export const SCORE_RANGE = {
  MIN: 1,
  MAX: 5,
};
