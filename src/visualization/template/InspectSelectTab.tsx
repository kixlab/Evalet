import { useEffect, useState } from 'react';
import BehaviorItem from '../components/BehaviorItem';
import { useBehaviorContext } from '../store/behaviorStore';
import useBoardContext from '../store/boardStore';
import * as S from './InspectSelectTab.style';
import { useDatabaseContext } from '../store/databaseStore';
import { exploreOneMoreCluster, filterByClusters } from '../utils/clusterCombo';
import { useClusterContext } from '../store/clusterStore';
import { ReactComponent as PinIcon } from '../../assets/icon/ic_pin.svg';
import { Colors } from '../../style/colors';
import { ClusterCombinationResult } from '../model/ClusterCombination';
import { useEvaluationContext } from '../store/evaluationStore';
import { v4 } from 'uuid';
import DataInspectItem from '../components/DataInspectItem';
import { useTracking } from 'react-tracking';

interface AvgClusterCombinationResult extends ClusterCombinationResult {
  average: number;
}

const InspectSelectTab = () => {
  const [currentDataIds, setCurrentDataIds] = useState<string[]>([]);
  const [currAvg, setCurrAvg] = useState<number>(0);
  const [avgClusterCombination, setAvgClusterCombination] = useState<AvgClusterCombinationResult[]>([]);

  const { selectedBehaviorIds, pinnedClusterIds, currentCriterionId, pinCluster, unPinCluster } = useBoardContext();
  const { findBehaviorById } = useBehaviorContext();
  const { dataToClusterMap } = useDatabaseContext();
  const { getEvaluationByPairDataIdAndCriteriaId } = useEvaluationContext();
  const { findAllConnectedClusters, getClusterListByCriteriaId, findClusterById } = useClusterContext();

  const { trackEvent } = useTracking();

  useEffect(() => {
    if (currentCriterionId === null) return;
    const target = dataToClusterMap.get(currentCriterionId);
    const clusters = getClusterListByCriteriaId(currentCriterionId);
    if (!target || !clusters) return;
    const currData = filterByClusters(target, pinnedClusterIds);
    setCurrentDataIds(currData.map((c) => c.pairDataId));
    const currAverage =
      currData
        .map((row) => {
          const result = getEvaluationByPairDataIdAndCriteriaId(row.pairDataId, currentCriterionId)[0];
          if (!result) return null;
          return result.overallScore;
        })
        .filter((i): i is string => i !== undefined)
        .reduce((acc, curr) => acc + parseInt(curr), 0) / currData.length;
    setCurrAvg(currAverage);
    const clustersShouldBeExcluded = Array.from(new Set(pinnedClusterIds.flatMap((qId) => findAllConnectedClusters(qId))));
    const combination = exploreOneMoreCluster(
      target,
      pinnedClusterIds,
      clusters
        .flat()
        .filter((c) => !clustersShouldBeExcluded.includes(c.id))
        .map((c) => c.id),
    );
    const avgCombi = combination.map((c) => {
      const avg =
        c.pairDataIds
          .map((pId) => {
            const result = getEvaluationByPairDataIdAndCriteriaId(pId, currentCriterionId)[0];
            if (!result) return null;
            return result.overallScore;
          })
          .filter((i): i is string => i !== undefined)
          .reduce((acc, curr) => acc + parseInt(curr), 0) / c.pairDataIds.length;
      return {
        ...c,
        average: avg,
      };
    });
    setAvgClusterCombination(avgCombi);
  }, [pinnedClusterIds, currentCriterionId]);

  return (
    <S.Container>
      <S.SectionTitle>Selected Behaviors ({selectedBehaviorIds.length})</S.SectionTitle>
      {selectedBehaviorIds.map((id) => {
        const behavior = findBehaviorById(id);
        if (!behavior) return null;
        return <BehaviorItem key={`selected-behavior-${id}`} behavior={behavior} />;
      })}
      <S.SectionTitle>Pinned Clusters ({pinnedClusterIds.length})</S.SectionTitle>
      {pinnedClusterIds.length > 0 && (
        <S.PinContainer>
          {pinnedClusterIds.map((pId) => {
            const data = findClusterById(pId);
            return (
              <S.PinClusterRow key={`pin-cluster-${pId}`}>
                <div
                  className="button"
                  onClick={() => {
                    if (window.confirm('Do you really want to un-pin this cluster?')) {
                      unPinCluster(pId);
                      trackEvent({ section: 'Viz', component: 'InspectSelectTab', action: 'unPinCluster' });
                    }
                  }}
                >
                  <PinIcon width={12} height={12} fill={Colors.POINT_BLUE} />
                </div>
                {data?.name}
              </S.PinClusterRow>
            );
          })}
          <div className="avg-row">
            <div className="title">Avg score of data with behaviors from pinned clusters</div>
            <div className="avg">{currAvg.toFixed(2)} / 7.00</div>
          </div>
        </S.PinContainer>
      )}
      {pinnedClusterIds.length > 0 && avgClusterCombination.length > 0 && (
        <>
          <S.ComboSuggestSectionTitle>How about check following clusters together?</S.ComboSuggestSectionTitle>
          <S.ComboSuggestRow>
            {avgClusterCombination
              .sort((a, b) => a.average - b.average)
              .slice(0, 3)
              .map((combo) => {
                const additionalCluster = findClusterById(combo.additionalClusterId);
                return (
                  <S.ComboSuggestContainer
                    key={v4()}
                    onClick={() => {
                      trackEvent({ section: 'Viz', component: 'InspectSelectTab', action: 'pinCluster' });
                      pinCluster(additionalCluster?.id ?? '');
                    }}
                  >
                    <div className="title">+ {additionalCluster?.name ?? ''}</div>
                    <div className="avg">{combo.average} / 7.00</div>
                  </S.ComboSuggestContainer>
                );
              })}
          </S.ComboSuggestRow>
        </>
      )}
      {pinnedClusterIds.length > 0 && currentDataIds.length > 0 && (
        <>
          <S.ComboSuggestSectionTitle>Data including behaviors that belong to clusters ({currentDataIds.length})</S.ComboSuggestSectionTitle>
          {currentDataIds.map((id) => (
            <DataInspectItem key={`data-inspect-item-${id}`} pairDataId={id} />
          ))}
        </>
      )}
    </S.Container>
  );
};

export default InspectSelectTab;
