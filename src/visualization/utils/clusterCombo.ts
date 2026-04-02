import { ClusterCombinationResult, DataToCluster } from '../model/ClusterCombination';

export function filterByClusters(pairDataList: DataToCluster[], query: string[]): { pairDataId: string; clusters: string[] }[] {
  return pairDataList.filter((data) => query.every((cl) => data.clusters.includes(cl)));
}

export function exploreOneMoreCluster(pairDataList: DataToCluster[], selectedClusters: string[], allClusters: string[]): ClusterCombinationResult[] {
  // 아직 선택되지 않은 클러스터들
  const remainingClusters = allClusters.filter((cl) => !selectedClusters.includes(cl));

  // 각 remainingCluster를 selectedClusters와 합쳐서 필터링
  return remainingClusters
    .map((extraCl) => {
      const newCombo = [...selectedClusters, extraCl];
      const filtered = filterByClusters(pairDataList, newCombo);

      return {
        additionalClusterId: extraCl, // 이번에 추가된 클러스터
        combination: newCombo, // 최종 조합
        count: filtered.length, // 이 조합을 만족하는 Response 개수
        pairDataIds: filtered.map((d) => d.pairDataId),
      };
    })
    .filter((result) => result.count > 0);
  // 실제로 1개 이상의 응답이 있는 조합만 남긴다
}
