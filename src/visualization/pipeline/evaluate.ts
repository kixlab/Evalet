import { v4 } from 'uuid';
import LLMRequestManager from '../../network/LLMRequestManager';
import { CriteriaDetail } from '../model/CriteriaDetail';
import { EvaluationDetail, EvaluationDto } from '../model/Evaluation';
import { PairData } from '../model/PairData';
import { evalPromptFactory } from '../prompts/evalPromptFactory';
import { requestSafeYAML } from '../../network/requestSafeYAML';
import { Behavior } from '../model/Behavior';
import { Evaluation } from '../../model/Evaluation';

export async function evaluateOneData(data: PairData, criteria: CriteriaDetail[], isBaseline = false, modelName = 'gpt-4o-mini') {
  if (modelName.toLowerCase().includes('claude') || modelName.toLowerCase().includes('anthropic')) {
    throw new Error('Anthropic models are disabled in this project.');
  }
  const systemPrompt = evalPromptFactory(isBaseline);
  const userPrompt = `## User's Instruction

${data.query}

---

## AI Assistant's Response

${data.response}

---

## Criteria

${criteria
  .map(
    (c) => `### ${c.name}
  
**Description**: ${c.description}

${`**Positive Examples** (<Feature: Snippet>)\n` + (c.positiveBehaviors.length === 0 ? '* Not provided *' : c.positiveBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}

${`**Negative Examples** (<Feature: Snippet>)\n` + (c.negativeBehaviors.length === 0 ? '* Not provided *' : c.negativeBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}

${`**Examples to Exclude** (<Feature: Snippet>)\n` + (c.excludeBehaviors.length === 0 ? '* Not provided *' : c.excludeBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}\n\n
`,
  )
  .join('\n')}`;

  const targetYAML = await requestSafeYAML(() => {
    return LLMRequestManager.shared.requestOpenAIAPI(modelName, systemPrompt, userPrompt, 8176, 0.1, 1);
  });
  const evaluations = targetYAML['evaluations'] as EvaluationDto[];
  console.log(targetYAML);

  const conversion: EvaluationDetail[] = evaluations.map((e) => {
    const criterionId = criteria.find((c) => c.name === e.criterion_name)?.id ?? '';
    const behaviors = e.features
      .filter((es) => es.is_excluded === false)
      .map((es, idx) => {
        // const features = e.features[idx];
        const fragment = e.fragments.find((f) => f.id === es.fragment_id);
        if (!fragment) {
          return null;
        }
        return {
          id: v4(),
          behavior: fragment?.fragment.replace(/"/g, ''),
          context: null,
          // feature: features.feature,
          // evaluation: features.evaluation,
          reasoning: es.analysis,
          feature: es.feature.replace(/"/g, ''),
          evaluation: es.analysis,
          clusterId: null,
          isPositive: es.alignment === 'positive',
          criteriaId: criterionId,
          pairDataId: data.id,
          vec1Value: null,
          vec2Value: null,
        };
      })
      .filter((b) => b !== null) as Behavior[];

    const positiveCount = behaviors.filter((b) => b.isPositive).length;
    const totalCount = behaviors.length;
    const overallScore = totalCount > 0 ? ((positiveCount / totalCount) * 100).toFixed(0) : '0';

    let baselineBehavior: Behavior;
    if (isBaseline) {
      baselineBehavior = {
        id: v4(),
        behavior: data.response,
        context: null,
        // feature: data.response,
        feature: e.keyphrase,
        evaluation: e.overall_justification,
        clusterId: null,
        isPositive: parseInt(overallScore) >= 2.5,
        criteriaId: criterionId,
        pairDataId: data.id,
        vec1Value: null,
        vec2Value: null,
        behaviorsForBaseline: behaviors,
      };
    }

    return {
      id: v4(),
      pairDataId: data.id,
      criteriaId: criterionId,
      behaviors: isBaseline ? [baselineBehavior!] : behaviors,
      overallJustification: e.overall_justification,
      overallScore,
      keyphrase: e.keyphrase,
    };
  });
  return conversion;
}

function convertEvaluationResult(evaluations: EvaluationDto[], data: PairData, criteria: CriteriaDetail[], isBaseline: boolean) {
  const conversion: EvaluationDetail[] = evaluations.map((e) => {
    const criterionId = criteria.find((c) => c.name === e.criterion_name)?.id ?? '';
    const behaviors = e.features
      .filter((es) => es.is_excluded === false)
      .map((es, idx) => {
        // const features = e.features[idx];
        const fragment = e.fragments.find((f) => f.id === es.fragment_id);
        if (!fragment) {
          return null;
        }
        return {
          id: v4(),
          behavior: fragment?.fragment.replace(/^"/, '').replace(/"$/, ''),
          context: null,
          // feature: features.feature,
          // evaluation: features.evaluation,
          reasoning: es.analysis,
          feature: es.feature.replace(/^"/, '').replace(/"$/, ''),
          evaluation: es.analysis,
          clusterId: null,
          isPositive: es.alignment === 'positive',
          criteriaId: criterionId,
          pairDataId: data.id,
          vec1Value: null,
          vec2Value: null,
        };
      })
      .filter((b) => b !== null) as Behavior[];

    const positiveCount = behaviors.filter((b) => b.isPositive).length;
    const totalCount = behaviors.length;
    const overallScore = totalCount > 0 ? ((positiveCount / totalCount) * 100).toFixed(0) : '0';

    let baselineBehavior: Behavior;
    if (isBaseline) {
      baselineBehavior = {
        id: v4(),
        behavior: data.response,
        context: null,
        // feature: data.response,
        feature: e.keyphrase,
        evaluation: e.overall_justification,
        clusterId: null,
        isPositive: parseInt(overallScore) >= 50,
        criteriaId: criterionId,
        pairDataId: data.id,
        vec1Value: null,
        vec2Value: null,
        behaviorsForBaseline: behaviors,
      };
    }

    return {
      id: v4(),
      pairDataId: data.id,
      criteriaId: criterionId,
      behaviors: isBaseline ? [baselineBehavior!] : behaviors,
      overallJustification: e.overall_justification,
      overallScore,
      keyphrase: e.keyphrase,
    };
  });
  return conversion;
}

export async function evaluateManyData(data: PairData[], criteria: CriteriaDetail[], isBaseline = false, modelName = 'gpt-4o-mini') {
  if (modelName.toLowerCase().includes('claude') || modelName.toLowerCase().includes('anthropic')) {
    throw new Error('Anthropic models are disabled in this project.');
  }
  const systemPrompt = evalPromptFactory(isBaseline);
  const idUserPrompts: { id: string; prompt: string }[] = [];
  data.forEach((d) => {
    const userPrompt = `## User's Instruction

${d.query}

---

## AI Assistant's Response

${d.response}

---

## Criteria

${criteria
  .map(
    (c) => `### ${c.name}
  
**Description**: ${c.description}

${`**Positive Examples** (<Feature: Snippet>)\n` + (c.positiveBehaviors.length === 0 ? '* Not provided *' : c.positiveBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}

${`**Negative Examples** (<Feature: Snippet>)\n` + (c.negativeBehaviors.length === 0 ? '* Not provided *' : c.negativeBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}

${`**Examples to Exclude** (<Feature: Snippet>)\n` + (c.excludeBehaviors.length === 0 ? '* Not provided *' : c.excludeBehaviors.map((bhv) => `- ${bhv.feature}: ${bhv.rawSnippet}`).join('\n'))}\n\n
`,
  )
  .join('\n')}`;
    idUserPrompts.push({ id: d.id, prompt: userPrompt });
  });

  console.log(`Sending ${idUserPrompts.length} requests to ${modelName}`);

  const results = await LLMRequestManager.shared.requestOpenAIAPIMany(modelName, systemPrompt, idUserPrompts, 8176, 0.1, 1);
  if (!results) {
    return [];
  }
  const evaluations: (EvaluationDetail[] | null)[] = results.map((r: any, idx: number) => {
    const pairData = data.find((d) => d.id === r.dataId);
    if (!pairData) {
      return null;
    }
    if (r['evaluations'] === undefined) return null;
    return convertEvaluationResult(r['evaluations'] as EvaluationDto[], pairData, criteria, isBaseline);
  });
  console.log(`Received ${evaluations.length} evaluations`);
  return evaluations.filter((e) => e !== null) as EvaluationDetail[][];
}
