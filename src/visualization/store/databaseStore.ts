import { atom, useRecoilState } from 'recoil';
import { PairData } from '../model/PairData';
import { DataToCluster } from '../model/ClusterCombination';

const databaseAtom = atom<PairData[]>({
  key: 'databaseAtom',
  default: [],
});

const dataToClustersMapAtom = atom<Map<string, DataToCluster[]>>({
  key: 'dataToClustersMapAtom',
  default: new Map(),
});

const pairDataToAllClusterMapAtom = atom<Map<string, DataToCluster>>({
  key: 'dataToClusterMapAtom',
  default: new Map(),
});

export const useDatabaseContext = () => {
  const [database, setDatabase] = useRecoilState(databaseAtom);
  const [dataToClusterMap, setDataToClusterMap] = useRecoilState(dataToClustersMapAtom);
  const [pairDataToAllClusterMap, setPairDataToAllClusterMap] = useRecoilState(pairDataToAllClusterMapAtom);

  // console.log(database);

  const updateDatabase = (newValue: PairData[]) => {
    setDatabase(newValue);
  };

  const findDataById = (pairDataId: string) => {
    return database.find((db) => db.id === pairDataId);
  };

  const setMapByCriteria = (criteriaId: string, newValue: DataToCluster[]) => {
    setDataToClusterMap(dataToClusterMap.set(criteriaId, newValue));
    setPairDataToAllClusterMap(mergeByPairDataId(dataToClusterMap));
  };

  function mergeByPairDataId(dataMap: Map<string, DataToCluster[]>): Map<string, DataToCluster> {
    const mergedMap = new Map<string, DataToCluster>();
    console.log('data', dataMap);

    dataMap.forEach((dataArray) => {
      dataArray.forEach(({ pairDataId, clusters }) => {
        if (mergedMap.has(pairDataId)) {
          // 기존의 clusters와 현재 clusters를 합치면서 중복 제거
          const existing = mergedMap.get(pairDataId)!;
          existing.clusters = Array.from(new Set([...existing.clusters, ...clusters]));
        } else {
          mergedMap.set(pairDataId, { pairDataId, clusters: [...clusters] });
        }
      });
    });
    console.log(mergedMap);

    return mergedMap;
  }

  return {
    database,
    setDatabase,
    updateDatabase,
    findDataById,
    dataToClusterMap,
    pairDataToAllClusterMap,
    setMapByCriteria,
  };
};
