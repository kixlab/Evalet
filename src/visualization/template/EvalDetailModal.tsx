import { useEffect, useRef, useState } from 'react';
import { useDatabaseContext } from '../store/databaseStore';
import { useEvaluationContext } from '../store/evaluationStore';
import * as S from './EvalDetailModal.style';
import { PairData } from '../model/PairData';
import { useCriteriaContext } from '../store/criteriaStore';
import { EvaluationDetail } from '../model/Evaluation';
import { CriteriaDetail } from '../model/CriteriaDetail';
import useBoardContext from '../store/boardStore';
import { Behavior } from '../model/Behavior';
import { useBehaviorContext } from '../store/behaviorStore';
import { Colors } from '../../style/colors';
import { useClusterContext } from '../store/clusterStore';
import { Cluster } from '../model/Clusters';
import { ReactComponent as XIcon } from '../../assets/icon/ic_x.svg';
import { useNavigator } from '../store/navigator';
import NormalButton from '../../component/common/NormalButton';
import { v4 } from 'uuid';
import { useTracking } from 'react-tracking';

interface Props {
  pairDataId: string;
  entryBehaviorId: string | null;
}

const EvalDetailModal = ({ pairDataId, entryBehaviorId }: Props) => {
  const [pairData, setPairData] = useState<PairData>();
  const [evaluations, setEvaluations] = useState<EvaluationDetail[]>();
  const [currEval, setCurrEval] = useState<EvaluationDetail>();
  const [currBehaviors, setCurrBehaviors] = useState<Behavior[]>();
  const [selectedBehavior, setSelectedBehavior] = useState<Behavior | null>(null);
  const [clusterTreeForSelectedBehavior, setClusterTreeForSelectedBehavior] = useState<Cluster[]>([]);
  const [selectedCriterionId, setSelectedCriterionId] = useState<string>();
  const [criteriaSet, setCriteriaSet] = useState<CriteriaDetail[]>();
  const [queryExpanded, setQueryExpanded] = useState<boolean>(true);

  const [selectedText, setSelectedText] = useState<string>('');

  const responseRef = useRef<HTMLDivElement>(null);

  const { getEvaluationByPairDataId } = useEvaluationContext();
  const { findDataById } = useDatabaseContext();
  const { criteria, getCriteriaById, addNegativesByCriteriaId, addPositivesByCriteriaId, addExcludesByCriteriaId } = useCriteriaContext();
  const { currentCriterionId, setCurrentEvalDetailId, setTemporarySelectedBehaviorIdInDetail, setSelectedClusterId, setCurrentCriterionId } = useBoardContext();
  const { findBehaviorById } = useBehaviorContext();
  const { findClusterById, findClusterTree } = useClusterContext();
  const { isBaseline } = useNavigator();

  const { trackEvent } = useTracking();

  useEffect(() => {
    const data = findDataById(pairDataId);
    if (!data) return;
    setPairData(data);
    const evaluationData = getEvaluationByPairDataId(pairDataId);
    setEvaluations(evaluationData);
    setCriteriaSet(evaluationData.map((e) => getCriteriaById(e.criteriaId)).filter((c): c is CriteriaDetail => c !== undefined));
    if (selectedCriterionId === undefined && currentCriterionId) {
      setSelectedCriterionId(currentCriterionId);
    }
  }, []);

  useEffect(() => {
    if (!evaluations || !selectedCriterionId) return;
    setSelectedBehavior(null);
    setClusterTreeForSelectedBehavior([]);
    setSelectedText('');
    const target = evaluations?.find((e) => e.criteriaId === selectedCriterionId);
    if (!target) return;
    setCurrEval(target);
    setCurrBehaviors(
      target.behaviors
        .flatMap((b) => {
          if (isBaseline) return findBehaviorById(b.id)?.behaviorsForBaseline;
          return findBehaviorById(b.id);
        })
        .filter((b): b is Behavior => b !== undefined),
    );
    if (entryBehaviorId) {
      const entryBehavior = findBehaviorById(entryBehaviorId);
      if (entryBehavior?.criteriaId === selectedCriterionId) {
        setSelectedBehavior(entryBehavior ?? null);
        setTemporarySelectedBehaviorIdInDetail(entryBehaviorId);
      } else {
        setSelectedBehavior(null);
        setTemporarySelectedBehaviorIdInDetail(null);
      }
    }
  }, [selectedCriterionId]);

  useEffect(() => {
    if (!currBehaviors || responseRef.current === null) return;
    clearHighlight();
    console.log(currBehaviors);
    if (currBehaviors.length === 0) return;
    currBehaviors.forEach((b) => {
      console.log('Behavior', b);
      highlightText(
        responseRef.current!,
        b.behavior,
        isBaseline ? Colors.POINT_BLUE : b.isPositive ? Colors.POINT_GREEN : Colors.POINT_RED,
        b.id,
        b.id === selectedBehavior?.id,
      );
    });
    if (!selectedCriterionId) return;
    if (isBaseline) {
      const criterion = getCriteriaById(selectedCriterionId);
      const positiveBehaviors = criterion?.positiveBehaviors.filter((pb) => pb.id === pairDataId);
      const negativeBehaviors = criterion?.negativeBehaviors.filter((nb) => nb.id === pairDataId);
      const excludeBehaviors = criterion?.excludeBehaviors.filter((eb) => eb.id === pairDataId);
      positiveBehaviors?.forEach((b) => highlightText(responseRef.current!, b.rawSnippet, Colors.POINT_GREEN, v4(), false));
      negativeBehaviors?.forEach((b) => highlightText(responseRef.current!, b.rawSnippet, Colors.POINT_RED, v4(), false));
      excludeBehaviors?.forEach((b) => highlightText(responseRef.current!, b.rawSnippet, Colors.NAVY, v4(), false));
    }
    if (selectedBehavior === null) return;
    setClusterTreeForSelectedBehavior(findClusterTree(selectedBehavior));
  }, [currBehaviors, selectedBehavior, criteria]);

  function highlightText(element: HTMLDivElement, targetText: string, color: string, behaviorId: string, isSelected: boolean) {
    const innerHTML = element.innerHTML;
    // Create a dynamic regex that considers " and ' as the same
    const regexPattern = targetText
      .trim()
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
      .replace(/["'‘’“”]/g, `["'‘’“”]`);
    const highlightedHTML = innerHTML.replace(
      new RegExp(`(${regexPattern})`, 'gi'),
      `<span style="background-color: ${color}${isSelected ? '50' : '1A'}; ${isBaseline ? '' : 'cursor: pointer'}" id="${behaviorId}">$1</span>`,
    );
    element.innerHTML = highlightedHTML;

    const highlightSpans = element.querySelectorAll('span');
    highlightSpans.forEach((span) => {
      const id = span.id;
      span.addEventListener('click', () => {
        setSelectedBehavior(findBehaviorById(id) ?? null);
        if (!isBaseline) setTemporarySelectedBehaviorIdInDetail(id);
        setSelectedClusterId(findBehaviorById(id)?.clusterId ?? null);
      });
    });
  }

  function clearHighlight() {
    if (responseRef.current) responseRef.current.innerHTML = responseRef.current.innerHTML.replace(/<\/?span[^>]*>/gi, '');
  }

  function handleMouseUp() {
    if (!isBaseline) return;

    const selection = window.getSelection();
    const targetText = selection?.toString().trim();
    setSelectedText(targetText ?? '');
  }

  const handlePositiveAddition = () => {
    if (!currentCriterionId) return;
    const data = {
      id: pairDataId,
      feature: '',
      rawSnippet: selectedText,
    };
    addPositivesByCriteriaId(currentCriterionId, [data]);
    trackEvent({ section: 'Viz', component: 'EvalDetailModal', action: 'addBehavior', value: 'positive' });
    setSelectedText('');
  };

  const handleNegativeAddition = () => {
    if (!currentCriterionId) return;
    const data = {
      id: pairDataId,
      feature: '',
      rawSnippet: selectedText,
    };
    addNegativesByCriteriaId(currentCriterionId, [data]);
    trackEvent({ section: 'Viz', component: 'EvalDetailModal', action: 'addBehavior', value: 'negative' });
    setSelectedText('');
  };

  const handleExcludeAddition = () => {
    if (!currentCriterionId) return;
    const data = {
      id: pairDataId,
      feature: '',
      rawSnippet: selectedText,
    };
    addExcludesByCriteriaId(currentCriterionId, [data]);
    trackEvent({ section: 'Viz', component: 'EvalDetailModal', action: 'addBehavior', value: 'exclude' });
    setSelectedText('');
  };

  return (
    <S.Container>
      <div className="header">
        <h1 className="title">Evaluation Detail</h1>
        <S.XButton
          onClick={() => {
            setCurrentEvalDetailId(null);
            setTemporarySelectedBehaviorIdInDetail(null);
          }}
        >
          <XIcon width={14} height={14} stroke={Colors.BLACK80} />
        </S.XButton>
      </div>
      <S.CriteriaRow>
        <div className="label">Criteria</div>
        <div className="scroll">
          {criteriaSet &&
            criteriaSet.map((c) => (
              <S.CriteriaChip
                className={c.id === selectedCriterionId ? 'selected' : ''}
                onClick={() => {
                  setSelectedCriterionId(c.id);
                  setCurrentCriterionId(c.id);
                  setSelectedClusterId(null);
                }}
                key={`criteria-chip-${c.id}`}
              >
                {c.name}
              </S.CriteriaChip>
            ))}
        </div>
      </S.CriteriaRow>
      <S.TripleColumn>
        <div className="column">
          <div className="header">
            <div className="sub-title">Input</div>
            <S.ExpandCollapseButton onClick={() => setQueryExpanded(!queryExpanded)}>{queryExpanded ? 'Collapse' : 'Expand'}</S.ExpandCollapseButton>
          </div>
          {queryExpanded && <S.QueryResponseContainer>{pairData?.query}</S.QueryResponseContainer>}
          <div className="sub-title">Output</div>
          <S.QueryResponseContainer ref={responseRef} onMouseUp={handleMouseUp}>
            {pairData?.response}
          </S.QueryResponseContainer>
        </div>
        {!isBaseline && (
          <div className="column">
            {selectedBehavior === null && <S.BehaviorPlaceholder>Select behavior to check detail</S.BehaviorPlaceholder>}
            {selectedBehavior && (
              <S.BehaviorDetailContainer>
                <h3 className="feature">{selectedBehavior.feature}</h3>
                <p className="behavior">&quot;{selectedBehavior.behavior}&quot;</p>
                <S.PosNegTag className={selectedBehavior.isPositive ? 'positive' : 'negative'}>
                  {selectedBehavior.isPositive ? 'Positive' : 'Negative'}
                </S.PosNegTag>
                <div className="sub-label">Reason</div>
                <p className="behavior">{selectedBehavior.evaluation}</p>
                <div className="sub-label">Clusters</div>
                <p className="behavior">
                  {clusterTreeForSelectedBehavior.length === 0 ? 'Not classified' : clusterTreeForSelectedBehavior.map((c) => c.name).join(' > ')}
                </p>
              </S.BehaviorDetailContainer>
            )}
          </div>
        )}
      </S.TripleColumn>
      {isBaseline && selectedText !== '' && (
        <S.SelectionBarContainer>
          <div className="label">Add selected text to...</div>
          <div className="buttons">
            <NormalButton onClick={handlePositiveAddition} backgroundColor={Colors.POINT_GREEN}>
              Positive
            </NormalButton>
            <NormalButton onClick={handleNegativeAddition} backgroundColor={Colors.POINT_RED}>
              Negative
            </NormalButton>
            <NormalButton onClick={handleExcludeAddition} backgroundColor={Colors.NAVY}>
              Exclude
            </NormalButton>
          </div>
          <div className="label">for {criteriaSet?.find((c) => c.id === selectedCriterionId)?.name}</div>
        </S.SelectionBarContainer>
      )}
      {currEval && (
        <S.OverallEvalContainer>
          <div className="label">Overall Score</div>
          <p className="score">{currEval.overallScore}%</p>
          {
            <>
              <div className="label">Justification</div>
              <p className="desc">{currEval.overallJustification}</p>
            </>
          }
        </S.OverallEvalContainer>
      )}
    </S.Container>
  );
};

export default EvalDetailModal;
