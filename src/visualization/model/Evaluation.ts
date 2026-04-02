import { Behavior } from './Behavior';

export interface EvaluationDto {
  criterion_name: string;
  fragments: { id: string; fragment: string }[];
  features: { fragment_id: string; analysis: string; feature: string; alignment: string; is_excluded: boolean }[];
  // features: { id: string; feature: string; evaluation: string; impact: string }[];
  overall_justification: string;
  keyphrase: string;
}

export interface EvaluationDetail {
  id: string;
  pairDataId: string;
  criteriaId: string;
  behaviors: Behavior[];
  overallJustification: string;
  overallScore: string;
  keyphrase: string;
}

export interface SnippetExtractionDto {
  criterion_name: string;
  evidence_snippets: { id: string; snippet: string; context: string; isExcluded: string }[];
}

export interface SnippetEvaluationDto {
  id: string;
  evaluation: string;
  feature: string;
  impact: string;
}
