export enum PostProcessingType {
  CRITERIA_IMPROVE,
  PROMPT_IMPROVE,
}

export function stringToPostProcessingType(str: string): PostProcessingType {
  if (str === 'IMPROVE_EVALUATION') return PostProcessingType.CRITERIA_IMPROVE;
  else return PostProcessingType.PROMPT_IMPROVE;
}
