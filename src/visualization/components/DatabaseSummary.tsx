import { Colors } from '../../style/colors';
import { PairData } from '../model/PairData';
import { useClusterContext } from '../store/clusterStore';
import { useCriteriaContext } from '../store/criteriaStore';
import * as S from './DatabaseSummary.style';
import { ReactComponent as PinIcon } from '../../assets/icon/ic_pin.svg';
import { useDatabaseContext } from '../store/databaseStore';
import { useEffect, useMemo, useState } from 'react';
import { useEvaluationContext } from '../store/evaluationStore';
import { exploreOneMoreCluster } from '../utils/clusterCombo';
import { ClusterCombinationResult } from '../model/ClusterCombination';
import { v4 } from 'uuid';
import { useTracking } from 'react-tracking';

interface AvgClusterCombinationResult extends ClusterCombinationResult {
  avgScoreForCriteria: { criteriaId: string; avgScore: number | null }[];
}

interface Props {
  selectedClusterIds: string[];
  presentedDatabase: PairData[];
  toggleId: (id: string) => void;
}

const DatabaseSummary = ({ selectedClusterIds, presentedDatabase, toggleId }: Props) => {
  const { findClusterById, findAllConnectedClusters, getAllBaseClusters } = useClusterContext();
  const { criteria, getCriteriaById } = useCriteriaContext();
  const { getEvaluationByPairDataId } = useEvaluationContext();
  const { database, pairDataToAllClusterMap } = useDatabaseContext();
  const [currentAvgScore, setCurrentAvgScore] = useState<{ criteriaId: string; avgScore: number | null }[]>([]);
  const [comboAvg, setComboAvg] = useState<AvgClusterCombinationResult[]>([]);

  const { trackEvent } = useTracking();

  useEffect(() => {
    const clusters = getAllBaseClusters();
    const clustersShouldBeExcluded = Array.from(new Set(selectedClusterIds.flatMap((qId) => findAllConnectedClusters(qId))));
    const combination: ClusterCombinationResult[] = [];
    console.log(pairDataToAllClusterMap);
    for (const c of clusters) {
      if (clustersShouldBeExcluded.includes(c.id)) continue;
      const target = [...selectedClusterIds, c.id];
      const targetData = database.filter((data) => {
        const dataToClusterItem = pairDataToAllClusterMap.get(data.id);
        return target.every((cId) => dataToClusterItem?.clusters.includes(cId));
      });
      combination.push({
        additionalClusterId: c.id,
        combination: [...selectedClusterIds, c.id],
        count: targetData.length,
        pairDataIds: targetData.map((d) => d.id),
      });
    }

    // 현재 presented data에 대해 점수 구하기
    const presentedDataEvaluations = presentedDatabase.flatMap((db) => getEvaluationByPairDataId(db.id));
    const criteriaIds = criteria.map((c) => c.id);
    const criteriaScores: Record<string, { total: number; count: number }> = Object.fromEntries(criteriaIds.map((id) => [id, { total: 0, count: 0 }]));

    presentedDataEvaluations.forEach(({ criteriaId, overallScore }) => {
      if (criteriaScores[criteriaId]) {
        criteriaScores[criteriaId].total += parseFloat(overallScore);
        criteriaScores[criteriaId].count += 1;
      }
    });
    const criteriaAverages = criteriaIds.map((criteriaId) => ({
      criteriaId,
      avgScore: criteriaScores[criteriaId].count > 0 ? criteriaScores[criteriaId].total / criteriaScores[criteriaId].count : null,
    }));
    setCurrentAvgScore(criteriaAverages);

    // additional combination
    const avgCombi = combination
      .map((c) => {
        const evaluations = c.pairDataIds.flatMap((pId) => getEvaluationByPairDataId(pId));
        const criteriaScores: Record<string, { total: number; count: number }> = Object.fromEntries(criteriaIds.map((id) => [id, { total: 0, count: 0 }]));

        // 데이터 채우기
        evaluations.forEach(({ criteriaId, overallScore }) => {
          if (criteriaScores[criteriaId]) {
            criteriaScores[criteriaId].total += parseFloat(overallScore);
            criteriaScores[criteriaId].count += 1;
          }
        });
        // 평균 계산
        const criteriaAverages = criteriaIds.map((criteriaId) => ({
          criteriaId,
          avgScore: criteriaScores[criteriaId].count > 0 ? criteriaScores[criteriaId].total / criteriaScores[criteriaId].count : null,
        }));
        return {
          ...c,
          avgScoreForCriteria: criteriaAverages,
        };
      })
      .filter((c) => c.count !== 0);
    setComboAvg(avgCombi);
  }, [selectedClusterIds]);

  return (
    <S.PinContainer>
      <h3 className="container-title">Outputs that Contain Selected Clusters</h3>
      {selectedClusterIds.map((cId) => {
        const data = findClusterById(cId);
        return (
          <S.PinClusterRow key={`db-selected-cluster-${cId}`}>
            <div
              className="button"
              onClick={() => {
                if (window.confirm('Do you really want to unselect this cluster?')) {
                  toggleId(cId);
                  trackEvent({ section: 'Viz', component: 'DatabaseSummary', action: 'clearClusterFilter' });
                }
              }}
            >
              <PinIcon width={12} height={12} fill={Colors.POINT_BLUE} />
            </div>
            {`${getCriteriaById(data?.criteriaId ?? '')?.name ?? ''}: ${data?.name}`}
            <div className="ratio-container">
              <div className="sub-title">Positive Ratio</div>
              <div className="ratio">{`${data?.positiveCount ?? '-'} / ${(data?.negativeCount ?? 0) + (data?.positiveCount ?? 0)}`}</div>
            </div>
          </S.PinClusterRow>
        );
      })}
      <div className="avg-row">
        <div className="title">The number of data rows that include selected cluster</div>
        <div className="avg">
          {presentedDatabase.length} / {database.length}
        </div>
      </div>
      <div className="avg-row">
        <div className="title">Score of current outputs</div>
        <div className="right-container">
          {currentAvgScore.map((item) => {
            return (
              <div className="avg" key={`avg-row-${item.criteriaId}`}>
                {getCriteriaById(item.criteriaId)?.name}: {item.avgScore?.toFixed(2) ?? '-'}
              </div>
            );
          })}
        </div>
      </div>
      <S.ComboSuggestSectionTitle>Most overlapping clusters</S.ComboSuggestSectionTitle>
      <S.ComboSuggestRow>
        {comboAvg
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
          .map((item) => {
            return (
              <S.ComboSuggestContainer
                key={`combo-suggest-${item.additionalClusterId}`}
                onClick={() => {
                  trackEvent({ section: 'Viz', component: 'DatabaseSummary', action: 'setClusterFilter' });
                  toggleId(item.additionalClusterId);
                }}
              >
                <div className="title">{findClusterById(item.additionalClusterId)?.name}</div>
                <div className="row">
                  <div className="label">Count</div>
                  <div className="value">{item.count}</div>
                </div>
                <div className="row">
                  <div className="label">Scores</div>
                </div>
                {item.avgScoreForCriteria.map((score) => {
                  return (
                    <div className="row" key={`${v4()}`}>
                      <div className="label">{getCriteriaById(score.criteriaId)?.name ?? ''}</div>
                      <div className="value">{score.avgScore?.toFixed(2) ?? '-'}</div>
                    </div>
                  );
                })}
              </S.ComboSuggestContainer>
            );
          })}
      </S.ComboSuggestRow>
    </S.PinContainer>
  );
};

export default DatabaseSummary;
