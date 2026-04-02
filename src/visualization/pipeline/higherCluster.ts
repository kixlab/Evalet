import { v4 } from 'uuid';
import { postForEntity } from '../../network/httpRequest';
import LLMRequestManager from '../../network/LLMRequestManager';
import { BaseCluster, Cluster, HigherCluster } from '../model/Clusters';
import {
  higherClusterDeduplicatePromptFactory,
  higherClusterReassignPromptFactory,
  higherClusterTopicExtractionPromptFactory,
} from '../prompts/higherClusterPromptFactory';
import { CriteriaDetail } from '../model/CriteriaDetail';
import { requestSafeJSON } from '../../network/requestSafeJSON';
import { SERVER_BASE_URL } from '../../configs';

function groupClusterByHigherCluster(clusters: Cluster[]): Cluster[][] {
  const groupedMap = new Map<string | null, Cluster[]>();

  for (const cluster of clusters) {
    const clusterId = cluster.higherClusterId;
    if (!groupedMap.has(clusterId)) {
      groupedMap.set(clusterId, []);
    }
    groupedMap.get(clusterId)!.push(cluster);
  }

  return Array.from(groupedMap.entries())
    .sort(([a], [b]) => {
      const aNum = a === null ? Number.MAX_SAFE_INTEGER : parseInt(a, 10);
      const bNum = b === null ? Number.MAX_SAFE_INTEGER : parseInt(b, 10);
      return aNum - bNum;
    })
    .map(([, clusters]) => clusters);
}

export async function higherCluster(clusters: Cluster[], criterion: CriteriaDetail): Promise<[Cluster[], HigherCluster[]] | undefined> {
  console.log('Start higher cluster');
  // 1. K-means
  const response: { predictions: number[] } = await postForEntity(`${SERVER_BASE_URL}/cluster/kmeans`, {
    k: Math.ceil(clusters.length * 0.5),
    data: clusters.map((c) => [c.centroidVec1, c.centroidVec2]),
  });
  if (!response) {
    window.alert('Kmeans Server terminated');
    return;
  }
  const highClusteredClusters = clusters.map((c, idx) => {
    return {
      ...c,
      higherClusterId: `${response['predictions'][idx]}`,
    };
  });

  console.log('Kmeans', highClusteredClusters);

  // 2. Higher Cluster Topic Extraction
  const clusterByHigherCluster = groupClusterByHigherCluster(highClusteredClusters);
  const topics = await Promise.all(
    clusterByHigherCluster.map(async (clusters) => {
      const userPrompt = `### Clusters\n\n` + clusters.map((c) => `**${c.name}**: ${c.description}}`).join('\n');
      const targetJSON = await requestSafeJSON(() =>
        LLMRequestManager.shared.requestOpenAIAPI('gpt-4o-mini', higherClusterTopicExtractionPromptFactory(), userPrompt, 8176, 0.1, 1),
      );
      return {
        name: targetJSON['name'],
        description: targetJSON['description'],
      };
    }),
  );

  // 3. Deduplicate
  let newTopics: { name: string; description: string }[] = topics;
  if (topics.length > 1) {
    const deduplicateUserPrompt = `### Names of Clusters\n\n` + topics.map((t) => `- ${t.name}: ${t.description}`).join('\n');
    const targetJSON = await requestSafeJSON(() =>
      LLMRequestManager.shared.requestOpenAIAPI('gpt-4o-mini', higherClusterDeduplicatePromptFactory(), deduplicateUserPrompt, 8176, 0.1, 1),
    );
    newTopics = targetJSON['finals'];
  } else {
    newTopics = topics;
  }
  const higherClusters: HigherCluster[] = newTopics.map((topic) => {
    return {
      id: v4(),
      name: topic.name,
      description: topic.description,
      shape: null,
      higherClusterId: null,
      centroidVec1: 0,
      centroidVec2: 0,
      subClusterIds: [],
      positiveCount: 0,
      negativeCount: 0,
      criteriaId: criterion.id,
    };
  });

  console.log('New Topics', higherClusters);

  // 4. Lower level Cluster Reassign
  const newClusters: Cluster[] = await Promise.all(
    clusters.map(async (c) => {
      const userPrompt =
        `### Target Cluster\n\nName: **${c.name}**\nDescription: ${c.description}\n\n` +
        `### Higher Clusters\n\n${higherClusters.map((hc, idx) => `${idx}: ${hc.name}`).join('\n')}`;
      const targetJSON = await requestSafeJSON(() =>
        LLMRequestManager.shared.requestOpenAIAPI('gpt-4o-mini', higherClusterReassignPromptFactory(), userPrompt, 8176, 0.1, 1),
      );
      const higherClusterIdx = targetJSON['cluster'];
      const higherCluster = higherClusters[higherClusterIdx];
      return { ...c, higherClusterId: higherCluster.id };
    }),
  );

  const processedHigherClusters: HigherCluster[] = higherClusters
    .map((c) => {
      return { ...c, subClusterIds: newClusters.filter((nc) => nc.higherClusterId === c.id).map((nc) => nc.id) };
    })
    .filter((hc) => hc.subClusterIds.length !== 0);

  console.log(newClusters);
  console.log(processedHigherClusters);

  return [newClusters, processedHigherClusters];
}
