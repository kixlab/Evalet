import { atom, useRecoilState } from 'recoil';
import { Cluster, HigherCluster, isBaseCluster } from '../model/Clusters';
import { Behavior } from '../model/Behavior';

// Cluster list should represent multi-level clusters, [[base clusters], [level 1 clusters], [...]]
const clusterListMapAtom = atom<Map<string, Cluster[][]>>({
  key: 'clusterListAtom',
  default: new Map(),
});

export const useClusterContext = () => {
  const [clusterListMap, setClusterListMap] = useRecoilState(clusterListMapAtom);

  // console.log(Array.from(clusterListMap.values()).flat(2));

  const setClusterListByCriteriaId = (criteriaId: string, clusters: Cluster[][]) => {
    const currMap = clusterListMap;
    currMap.set(criteriaId, clusters);
    setClusterListMap(currMap);
  };

  const saveAllClusters = (_clusters: Cluster[]) => {};

  const getClusterListByCriteriaId = (criteriaId: string) => {
    return clusterListMap.get(criteriaId);
  };

  const findClusterById = (id: string) => {
    const flatList = Array.from(clusterListMap.values()).flat(2);
    return flatList.find((c) => c.id === id);
  };

  const findAllConnectedClusters = (id: string) => {
    const startPoint = findClusterById(id);
    if (!startPoint) return [id];
    function upward(currClusterId: string): string[] {
      const target = findClusterById(currClusterId);
      if (!target || target.higherClusterId === null) return [currClusterId];
      return [currClusterId, ...upward(target.higherClusterId)];
    }
    function downward(currClusterId: string): string[] {
      const target = findClusterById(currClusterId);
      if (!target || isBaseCluster(target)) return [currClusterId];
      return [currClusterId, ...(target as HigherCluster).subClusterIds.flatMap((id) => downward(id))];
    }
    return [...upward(id), ...downward(id)];
  };

  const findClusterTree = (behavior: Behavior) => {
    function recursive(clusterId: string): Cluster[] {
      const currCluster = findClusterById(clusterId);
      if (!currCluster) return [];
      if (!currCluster?.higherClusterId) {
        return [currCluster];
      } else {
        return [...recursive(currCluster?.higherClusterId ?? ''), currCluster];
      }
    }
    if (behavior.clusterId === null) return [];
    return recursive(behavior.clusterId);
  };

  const getAllBaseClusters = () => {
    return Array.from(clusterListMap.values()).flatMap((i: Cluster[][]) => i[0]);
  };

  const justSave = () => {};

  return {
    clusterListMap,
    setClusterListMap,
    setClusterListByCriteriaId,
    getClusterListByCriteriaId,
    findClusterById,
    findAllConnectedClusters,
    findClusterTree,
    getAllBaseClusters,
    saveAllClusters,
    justSave,
  };
};
