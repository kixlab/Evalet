import { Embedding } from 'openai/resources';
import { postForEntity } from '../../network/httpRequest';
import LLMRequestManager from '../../network/LLMRequestManager';
import { Behavior } from '../model/Behavior';
import { UMAP } from 'umap-js';

export async function embedBehaviors(behaviors: Behavior[]) {
  console.log('Start embedding');
  const BATCH_SIZE = 50;

  const chunks: Behavior[][] = [];
  for (let i = 0; i < behaviors.length; i += BATCH_SIZE) {
    chunks.push(behaviors.slice(i, i + BATCH_SIZE));
  }

  const allEmbeddings: Embedding[] = [];
  for (const chunk of chunks) {
    const chunkFeatures = chunk.map((b) => b.feature ?? '').filter((c) => c.trim() !== '');
    const chunkResult = await LLMRequestManager.shared.requestOpenAIEmbedding(chunkFeatures);

    if (chunkResult && Array.isArray(chunkResult)) {
      allEmbeddings.push(...chunkResult);
    }
  }

  if (allEmbeddings.length === 0) {
    return;
  }

  // UMAP based dimension reduction
  const umapClient = new UMAP({
    nComponents: 2,
  });
  const mappedVectors = umapClient.fit(allEmbeddings.map((r) => r.embedding));
  const newBehaviors = behaviors.map((b) => {
    return { ...b }; // for deep copy
  });
  mappedVectors.forEach((v, idx) => {
    newBehaviors[idx].vec1Value = v[0];
    newBehaviors[idx].vec2Value = v[1];
  });
  return newBehaviors;
}
