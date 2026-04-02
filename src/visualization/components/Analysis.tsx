import { useEffect, useState } from 'react';
import useBoardContext from '../store/boardStore';
import { useEvaluationContext } from '../store/evaluationStore';
import * as S from './Analysis.style';
import { useCriteriaContext } from '../store/criteriaStore';

const Analysis = () => {
  const [average, setAverage] = useState<number | null>(null);
  const { currentCriterionId } = useBoardContext();
  const { getEvaluationByCriteriaId } = useEvaluationContext();
  const { getCriteriaById } = useCriteriaContext();

  useEffect(() => {
    if (!currentCriterionId) return;
    const evaluations = getEvaluationByCriteriaId(currentCriterionId);
    const average = evaluations.map((e) => parseInt(e.overallScore, 10)).reduce((acc, curr) => acc + curr, 0) / evaluations.length;
    setAverage(average);
  }, [currentCriterionId]);
  return (
    <S.Container>
      <S.Title>Analysis: {getCriteriaById(currentCriterionId ?? '')?.name}</S.Title>
      <S.Row>
        <div className="title">Average Score</div>
        <div className="item">{average?.toFixed(2) ?? '-'}%</div>
      </S.Row>
    </S.Container>
  );
};

export default Analysis;
