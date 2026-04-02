import { v4 } from 'uuid';
import LLMRequestManager from '../../network/LLMRequestManager';
import { CriteriaDetail } from '../model/CriteriaDetail';
import { EvaluationDetail, SnippetExtractionDto, SnippetEvaluationDto } from '../model/Evaluation';
import { Behavior } from '../model/Behavior';
import { PairData } from '../model/PairData';
import { extractSnippetsPromptFactory, evaluateSnippetsPromptFactory } from '../prompts/multistepEvaluatePromptFactory';
import { requestSafeYAML } from '../../network/requestSafeYAML';

export async function extractSnippetsOneData(data: PairData, criteria: CriteriaDetail[]) {
  const systemPrompt = extractSnippetsPromptFactory(criteria);
  const userPrompt = `## User's Instruction

${data.query}

## AI Assistant's Response

${data.response}`;

  const targetYAML = await requestSafeYAML(() => LLMRequestManager.shared.requestOpenAIAPI('gpt-4o-mini', systemPrompt, userPrompt, 8176, 0.1, 1));
  const extractedSnippets = targetYAML['result'] as SnippetExtractionDto[];
  console.log(targetYAML);
  const conversion: EvaluationDetail[] = extractedSnippets.map((e) => {
    const criterionId = criteria.find((c) => c.name === e.criterion_name)?.id ?? '';
    return {
      id: v4(),
      pairDataId: data.id,
      criteriaId: criterionId,
      behaviors: e.evidence_snippets
        .filter((es) => {
          return es.isExcluded.trim() === 'false';
        })
        .map((es, idx) => {
          // const features = e.features[idx];
          return {
            id: v4(),
            behavior: es.snippet,
            context: es.context,
            feature: null,
            evaluation: null,
            clusterId: null,
            isPositive: null,
            criteriaId: criterionId,
            pairDataId: data.id,
            vec1Value: null,
            vec2Value: null,
          };
        }),
      overallJustification: '', // Placeholder values
      overallScore: '1',
      keyphrase: '',
    };
  });
  return conversion;
}

function behaviorsToString(behaviors: Behavior[]) {
  return JSON.stringify(
    behaviors.map((b) => ({
      id: b.id,
      snippet: b.behavior,
      context: b.context,
    })),
    null,
    2,
  );
}

async function evaluateSnippetBatch(behaviors: Behavior[], criterion: CriteriaDetail) {
  const systemPrompt = evaluateSnippetsPromptFactory(criterion);

  const userPrompt = `## Snippets from the AI Assistant's Responses

\`\`\`json
${behaviorsToString(behaviors)}
\`\`\`

---

**IMPORTANT:** Remember to evaluate ALL of the provided snippets in one go.`;

  const targetYAML = await requestSafeYAML(() => LLMRequestManager.shared.requestOpenAIAPI('gpt-4o-mini', systemPrompt, userPrompt, 16384, 0.1, 1));
  const extractedSnippets = targetYAML['evaluations'] as SnippetEvaluationDto[];
  console.log(targetYAML);
  // update the behaviors with the evaluation
  extractedSnippets.forEach((es) => {
    const behavior = behaviors.find((b) => b.id === es.id);
    if (behavior) {
      behavior.evaluation = es.evaluation;
      behavior.feature = es.feature;
      behavior.isPositive = es.impact === 'positive';
    }
  });

  return behaviors;
}

export async function evaluateSnippets(targetEvaluations: EvaluationDetail[], criterion: CriteriaDetail) {
  const batchSize = 20;

  const behaviors: Behavior[] = targetEvaluations.flatMap((e) => e.behaviors);

  const evaluationResults = await Promise.all(
    Array.from({ length: Math.ceil(behaviors.length / batchSize) }, (_, i) => {
      const batch = behaviors.slice(i * batchSize, (i + 1) * batchSize);
      return evaluateSnippetBatch(batch, criterion);
    }),
  );

  const updatedBehaviors = evaluationResults.flat();

  targetEvaluations.forEach((e) => {
    e.behaviors = updatedBehaviors.filter((b) => b.pairDataId === e.pairDataId && b.criteriaId === e.criteriaId);
  });

  return targetEvaluations;
}
