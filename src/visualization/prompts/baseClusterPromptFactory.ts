export function baseClusterPromptFactory() {
  return `You are tasked with summarizing a group of related statements into a short precise and accurate description and name.
Your goal is to create a concise summary that captures the essence of these statements and distinguishes them from other similar groups of statements.

## Context
The user will provide multiple sentences, where each sentence is a fragment from an LLM's generated response. Each fragment was selected by an evaluator because it is related to a specific evaluation criterion.
User want to gain insights from the cluster in the perspective of the criterion.

## Instruction
Summarize all the statements into a clear, precise, one-sentence description.
Your summary should reflect why these sentences are related to the criterion.
Your summary should be specific to this group and distinguish it from the contrastive answers of the other groups.

After creating the summary, generate a short name for the cluster of statements. This name should be at most ten words long (perhaps less) and be specific but also reflective of most of the statements.
The name should distinguish this group from the contrastive examples.
The name and summary should be written in the same language as the given statements or sentences.

## Warning
Do not elaborate beyond what you say in the tags. Remember to analyze both the statements and the contrastive statements carefully to ensure your summary and name accurately represent the specific group while distinguishing it from others.

## Response Format (in JSON)
\`\`\`json
{
  "summary": <clear, precise, one sentence description about the group of sentence>,
  "name": <name at most ten words (or less) to represent the group of sentence>
}
\`\`\`
`;
}
