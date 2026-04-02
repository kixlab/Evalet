import * as S from './DatabaseItem.style';
import { ReactComponent as ChevronUp } from '../../assets/icon/ic_chevron_up.svg';
import { ReactComponent as ChevronDown } from '../../assets/icon/ic_chevron_down.svg';
import { Colors } from '../../style/colors';
import { useEffect, useState } from 'react';
import { PairData } from '../model/PairData';
import { useEvaluationContext } from '../store/evaluationStore';
import useBoardContext from '../store/boardStore';
import { useCriteriaContext } from '../store/criteriaStore';
import { EvaluationDetail } from '../model/Evaluation';
import { useClusterContext } from '../store/clusterStore';
import { useBehaviorContext } from '../store/behaviorStore';
import { useNavigator } from '../store/navigator';
import { useTracking } from 'react-tracking';

interface Props {
  data: PairData;
  selectedClusterIds: string[];
  toggleClusterId: (id: string) => void;
}

const DatabaseItem = ({ data, selectedClusterIds, toggleClusterId }: Props) => {
  const { getEvaluationByPairDataId } = useEvaluationContext();
  const { setCurrentEvalDetailId } = useBoardContext();

  const { trackEvent } = useTracking();

  const openEvaluationModal = (pairDataId: string) => {
    setCurrentEvalDetailId({ pairDataId: pairDataId, entryBehaviorId: null });
  };

  const isEvaluationReady = data.evaluationId !== null;
  const evaluations = getEvaluationByPairDataId(data.id);

  return (
    <S.Container>
      <S.Column>
        <div className="title">Input</div>
        <p className="content">{data.query}</p>
      </S.Column>
      <div className="divider" />
      <S.Column>
        <div className="title">Output</div>
        <p className="content">{data.response}</p>
      </S.Column>
      <div className="divider" />
      <S.Column>
        <div className="title">Evaluation</div>
        {evaluations.map((e) => (
          <EvaluationAccordion key={`eval-${e.id}`} evaluation={e} selectedClusterIds={selectedClusterIds} toggleClusterId={toggleClusterId} />
        ))}
        {!isEvaluationReady && <p>Not evaluated yet</p>}
        {isEvaluationReady && (
          <S.EvaluationButton
            className={isEvaluationReady ? 'ready' : ''}
            onClick={() => {
              if (!isEvaluationReady) return;
              trackEvent({ section: 'Viz', component: 'DatabaseTable', action: 'viewEvaluation' });
              openEvaluationModal(data.id);
            }}
          >
            View Details
          </S.EvaluationButton>
        )}
      </S.Column>
    </S.Container>
  );
};

interface AccordionProps {
  evaluation: EvaluationDetail;
  selectedClusterIds: string[];
  toggleClusterId: (id: string) => void;
}

const EvaluationAccordion = ({ evaluation, selectedClusterIds, toggleClusterId }: AccordionProps) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const { getCriteriaById } = useCriteriaContext();
  const { findClusterById } = useClusterContext();
  const { findBehaviorById } = useBehaviorContext();
  const { setSelectedClusterId, currentCriterionId, setCurrentCriterionId } = useBoardContext();

  const { trackEvent } = useTracking();

  const { isBaseline } = useNavigator();

  useEffect(() => {
    const criteriaIdsOfSelectedClusters = selectedClusterIds.map((id) => findClusterById(id)?.criteriaId ?? null);
    setOpen(criteriaIdsOfSelectedClusters.includes(evaluation.criteriaId));
  }, [selectedClusterIds]);

  return (
    <S.AccordionContainer>
      <S.AccordionHeader
        className={isBaseline ? 'baseline' : ''}
        onClick={() => {
          if (!isBaseline) setOpen(!isOpen);
        }}
      >
        <h3 className="name">{getCriteriaById(evaluation.criteriaId)?.name ?? '-'}</h3>
        <p className="point">{evaluation.overallScore}%</p>
        {!isBaseline && (
          <div className="icon">
            {isOpen ? <ChevronUp width={20} height={20} stroke={Colors.BLACK80} /> : <ChevronDown width={20} height={20} stroke={Colors.BLACK80} />}
          </div>
        )}
      </S.AccordionHeader>
      {isOpen && (
        <div className="item-container">
          {evaluation.behaviors.map((b) => {
            const behavior = findBehaviorById(b.id);
            if (!behavior) return null;
            const unselected = selectedClusterIds.length > 0 && !selectedClusterIds.includes(behavior.clusterId ?? '');
            return (
              <S.AccordionItem key={`evaluation-behavior-${b.id}`}>
                <S.PosNegTag className={(b.isPositive ? 'positive' : 'negative') + (unselected ? ' unselected' : '')}>
                  {behavior.isPositive ? 'Positive' : 'Negative'}
                </S.PosNegTag>
                <div
                  className={'feature' + (unselected ? ' unselected' : '')}
                  onClick={() => {
                    if (behavior.clusterId !== '-1' && behavior.clusterId !== null) {
                      trackEvent({ section: 'Viz', component: 'EvaluationAccordion', action: unselected ? 'setClusterFilter' : 'clearClusterFilter' });
                      toggleClusterId(behavior.clusterId);
                      if (!selectedClusterIds.includes(behavior.clusterId)) {
                        if (behavior.criteriaId === currentCriterionId) setSelectedClusterId(behavior.clusterId);
                        else {
                          setCurrentCriterionId(behavior.criteriaId);
                          setTimeout(() => setSelectedClusterId(behavior.clusterId), 750);
                        }
                      } // trigger zoom when newly add
                    }
                  }}
                >
                  {findClusterById(behavior.clusterId ?? '')?.name ?? 'Not classified'}
                </div>
              </S.AccordionItem>
            );
          })}
        </div>
      )}
      {isBaseline && (
        <div className="item-container">
          <S.AccordionItem>
            <div className="feature">{evaluation.behaviors.map((b) => b.feature)}</div>
          </S.AccordionItem>
        </div>
      )}
    </S.AccordionContainer>
  );
};

export default DatabaseItem;
