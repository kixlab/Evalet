import { Colors } from '../style/colors';
import { Criteria, Rubric } from './Criteria';
import { PostProcessingType } from './PostProcessingType';

export interface CriteriaRevision {
  id: string;
  inputId: string;
  basedCriterionId: string | null;
  newCriterion: Criteria;
}

export interface PromptRevision {
  id: string;
  basedPromptId: string;
  change: PromptRevisionChange;
}

export interface PromptRevisionChange {
  id: string;
  type: PromptRevisionType;
}

export interface PromptRevisionAdd extends PromptRevisionChange {
  preId: string | null;
  newSentence: string;
}

export interface PromptRevisionModify extends PromptRevisionChange {
  baseId: string;
  newSentence: string;
}

export interface PromptRevisionDelete extends PromptRevisionChange {
  baseId: string;
}

export enum PromptRevisionType {
  ADD,
  DELETE,
  MODIFY,
}

export function getPromptRevisionColor(type: PromptRevisionType) {
  switch (type) {
    case PromptRevisionType.ADD:
      return Colors.POINT_GREEN;
    case PromptRevisionType.DELETE:
      return Colors.POINT_RED;
    case PromptRevisionType.MODIFY:
    default:
      return Colors.POINT_BLUE;
  }
}

export enum PostProcessingStatus {
  PENDING,
  PROCESSING,
  DONE,
}
