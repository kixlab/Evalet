import { v4 } from 'uuid';
import { postForEntity } from '../../network/httpRequest';
import LLMRequestManager from '../../network/LLMRequestManager';
import { Behavior } from '../model/Behavior';
import { baseClusterPromptFactory } from '../prompts/baseClusterPromptFactory';
import { BaseCluster, Cluster } from '../model/Clusters';
import { CriteriaDetail } from '../model/CriteriaDetail';
import { requestSafeJSON } from '../../network/requestSafeJSON';
import { SERVER_BASE_URL } from '../../configs';

function groupBehaviorsByCluster(behaviors: Behavior[]): Behavior[][] {
  const groupedMap = new Map<string | null, Behavior[]>();

  for (const behavior of behaviors) {
    const clusterId = behavior.clusterId;
    if (!groupedMap.has(clusterId)) {
      groupedMap.set(clusterId, []);
    }
    groupedMap.get(clusterId)!.push(behavior);
  }

  return Array.from(groupedMap.entries())
    .sort(([a], [b]) => {
      const aNum = a === null ? Number.MAX_SAFE_INTEGER : parseInt(a, 10);
      const bNum = b === null ? Number.MAX_SAFE_INTEGER : parseInt(b, 10);
      return aNum - bNum;
    })
    .map(([, behaviors]) => behaviors);
}

/**
 * @param behaviors
 * @returns [newBehaviors, baseClusters]
 */
export async function baseCluster(behaviors: Behavior[], criterion: CriteriaDetail) {
  // 1. HDBSCAN
  console.log(
    criterion.name,
    behaviors.map((b) => [b.vec1Value, b.vec2Value]),
  );
  const response: { predictions: number[] } = await postForEntity(
    `${SERVER_BASE_URL}/cluster/hdbscan`,
    behaviors.map((b) => [b.vec1Value, b.vec2Value]),
  );
  if (!response) {
    window.alert('HDBSCAN Server terminated');
    return;
  }
  const clusteredBehavior: Behavior[] = behaviors.map((b, idx) => {
    return {
      ...b,
      clusterId: `${response['predictions'][idx]}`,
    };
  });

  // 2. Cluster 별로 Behavior 나누기
  const behaviorByCluster = groupBehaviorsByCluster(clusteredBehavior);

  const target = behaviorByCluster.some((bList) => bList.some((b) => b.clusterId === '-1')) ? behaviorByCluster.slice(1) : behaviorByCluster;

  // 3. BaseCluster 생성
  const baseClusters = await Promise.all(
    target.map(async (behaviors) => {
      const userPrompt = `### Sentences\n\n` + behaviors.map((b) => `- ${b.feature}`).join('\n');
      console.log('System:', baseClusterPromptFactory());
      const targetJSON = await requestSafeJSON(() =>
        LLMRequestManager.shared.requestOpenAIAPI('gpt-4o-mini', baseClusterPromptFactory(), userPrompt, 8176, 0.1, 1),
      );
      const uuid = v4();
      const newBaseCluster: BaseCluster = {
        id: uuid,
        name: targetJSON['name'],
        description: targetJSON['summary'],
        shape: null,
        higherClusterId: null,
        behaviorIds: behaviors.map((b) => b.id),
        centroidVec1: behaviors.reduce((prev, curr) => prev + (curr.vec1Value ?? 0), 0) / behaviors.length,
        centroidVec2: behaviors.reduce((prev, curr) => prev + (curr.vec2Value ?? 0), 0) / behaviors.length,
        positiveCount: behaviors.reduce((count, b) => count + (b.isPositive ? 1 : 0), 0),
        negativeCount: behaviors.reduce((count, b) => count + (b.isPositive ? 0 : 1), 0),
        criteriaId: criterion.id,
      };
      behaviors.forEach((b) => {
        b.clusterId = uuid;
      });
      return newBaseCluster;
    }),
  );

  return [clusteredBehavior, baseClusters];
}
