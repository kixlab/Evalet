import { useEffect, useState } from 'react';
import * as S from './DataInspectItem.style';
import { Behavior } from '../model/Behavior';
import useBoardContext from '../store/boardStore';
import { useBehaviorContext } from '../store/behaviorStore';
import { ReactComponent as PinIcon } from '../../assets/icon/ic_pin.svg';
import { Colors } from '../../style/colors';
import { useClusterContext } from '../store/clusterStore';
import { useEvaluationContext } from '../store/evaluationStore';
import { EvaluationDetail } from '../model/Evaluation';
import { useTracking } from 'react-tracking';

interface Props {
  pairDataId: string;
}

const DataInspectItem = ({ pairDataId }: Props) => {
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationDetail | null>(null);

  const { currentCriterionId, pinnedClusterIds, pinCluster, unPinCluster, setCurrentEvalDetailId } = useBoardContext();
  const { findBehaviorsByPairDataIdAndCriteriaId } = useBehaviorContext();
  const { findClusterById } = useClusterContext();
  const { getEvaluationByPairDataIdAndCriteriaId } = useEvaluationContext();

  const { trackEvent } = useTracking();

  useEffect(() => {
    if (!currentCriterionId) return;
    setBehaviors(findBehaviorsByPairDataIdAndCriteriaId(pairDataId, currentCriterionId));
    const evaluations = getEvaluationByPairDataIdAndCriteriaId(pairDataId, currentCriterionId);
    if (evaluations.length === 0) setEvaluation(null);
    else setEvaluation(evaluations[0]);
  }, [pairDataId]);

  return (
    <S.Container>
      {behaviors
        .sort((a, b) => {
          const boolA = pinnedClusterIds.includes(a.clusterId ?? '');
          const boolB = pinnedClusterIds.includes(b.clusterId ?? '');
          if (boolA === boolB) return 0;
          return boolA ? -1 : 1;
        })
        .map((b) => {
          return (
            <S.BehaviorRow key={`inspect-behavior-${b.id}`} className={pinnedClusterIds.includes(b.clusterId ?? '') ? 'pinned' : ''}>
              <S.BehaviorCell>
                <S.InlinePosNegTag className={b.isPositive ? 'positive' : 'negative'}>{b.isPositive ? 'Positive' : 'Negative'}</S.InlinePosNegTag>
                {b.behavior}
              </S.BehaviorCell>
              <S.ClusterCell>
                {(b.clusterId === null || b.clusterId === '-1') && <>Not classified</>}
                {b.clusterId !== '-1' && b.clusterId && (
                  <>
                    <S.InlinePinIconButton
                      onClick={() => {
                        if (!b.clusterId || b.clusterId === '-1') return;
                        if (pinnedClusterIds.includes(b.clusterId)) {
                          trackEvent({ section: 'Viz', component: 'DataInspectItem', action: 'unpinCluster' });
                          unPinCluster(b.clusterId);
                        } else {
                          trackEvent({ section: 'Viz', component: 'DataInspectItem', action: 'pinCluster' });
                          pinCluster(b.clusterId);
                        }
                      }}
                    >
                      <PinIcon width={12} height={12} fill={pinnedClusterIds.includes(b.clusterId) ? Colors.POINT_BLUE : Colors.BLACK60} />
                    </S.InlinePinIconButton>
                    {findClusterById(b.clusterId)?.name ?? 'Not classified'}
                  </>
                )}
              </S.ClusterCell>
            </S.BehaviorRow>
          );
        })}
      <S.InfoRow>
        <S.ScoreBox>
          Score: <div className="numeric">{evaluation?.overallScore ?? '-'}</div>
        </S.ScoreBox>
        <S.CheckDetailButton
          onClick={() => {
            trackEvent({ section: 'Viz', component: 'FloatToolbar', action: 'viewEvaluation' });
            setCurrentEvalDetailId({ pairDataId, entryBehaviorId: null });
          }}
        >
          CHECK DETAIL
        </S.CheckDetailButton>
      </S.InfoRow>
    </S.Container>
  );
};

export default DataInspectItem;
