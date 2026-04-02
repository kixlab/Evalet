import { Attribute } from './Criteria';

export interface Evaluation {
  id: string;
  inputId: string;
  outputId: string;
  criteriaId: string;
  prompt: string;
  point: number;
  comment: string;
}

export interface AIEvaluation extends Evaluation {
  relatedPart: string[]; // For multi-dimensional decomposition.
  attributeEvaluations: { attribute: Attribute; point: number }[];
}

export enum PairWiseEvaluation {
  RES_1_WIN,
  TIE,
  RES_2_WIN,
}

export interface PairWiseAIEvaluation {
  id: string;
  inputId: string;
  prompt1Id: string;
  prompt2Id: string;
  output1Id: string;
  output2Id: string;
  winner: PairWiseEvaluation;
  criteriaDetail: CriteriaAIEvaluation[];
}

export interface CriteriaAIEvaluation {
  criteriaName: string;
  winner: PairWiseEvaluation;
  response1Point: number;
  response1Evidence: EvidenceDetail[];
  response2Point: number;
  response2Evidence: EvidenceDetail[];
  reason: string;
  evaluationReason: string;
  attributes: AttributeAIEvaluation[];
}

export interface EvidenceDetail {
  fragment: string;
  justification: string;
  impact: string;
}

export interface AttributeAIEvaluation {
  attributeName: string;
  response1Score: 0 | 1 | 2;
  response2Score: 0 | 1 | 2;
}

export function evaluationToString(evaluation: PairWiseAIEvaluation) {
  let result = '### AI Evaluation\n\n';
  if (evaluation.winner === PairWiseEvaluation.RES_1_WIN) result += 'Main Prompt Win\n\n';
  else if (evaluation.winner === PairWiseEvaluation.TIE) result += 'Tie between two prompt\n\n';
  else result += 'Other Prompt Win\n\n';
  result += '#### Criteria\n\n';
  evaluation.criteriaDetail.forEach((cd) => {
    result += `**${cd.criteriaName}**\n  -AI Feedback\n  ${cd.reason}\n\n  **Attribute Scores**\n${cd.attributes.map((a) => `  - ${a.attributeName}\n    - Main Prompt: ${a.response1Score}\n    - Other Prompt: ${a.response2Score}\n`)}\n**Overall Score**\n Main Prompt: ${cd.response1Point}  Other Prompt: ${cd.response2Point}\n`;
  });
  return result;
}
