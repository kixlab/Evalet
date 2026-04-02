import { ClusterCombinationResult } from '../model/ClusterCombination';
import useBoardContext from '../store/boardStore';
import { useClusterContext } from '../store/clusterStore';
import { useEvaluationContext } from '../store/evaluationStore';
import * as S from './CombinationAnalysis.style';

interface Props {
  query: string[];
  info: ClusterCombinationResult[];
}

const CombinationAnalysis = ({ query, info }: Props) => {
  const { currentCriterionId } = useBoardContext();
  const { findClusterById } = useClusterContext();
  const { getEvaluationByPairDataIdAndCriteriaId } = useEvaluationContext();
  return (
    <S.Container>
      <S.Title>{query.map((q) => findClusterById(q)?.name ?? '').join(' + ')}</S.Title>
      {info
        .sort((a, b) => b.count - a.count)
        .map((i) => {
          const avg =
            i.pairDataIds
              .map((id) => getEvaluationByPairDataIdAndCriteriaId(id, currentCriterionId ?? ''))
              .flat()
              .map((e) => e.overallScore)
              .reduce((acc, curr) => acc + parseInt(curr, 10), 0) / i.pairDataIds.length;
          return (
            <S.Row key={`${query.join('-')}-${i.additionalClusterId}`}>
              <div className="title">{`+ ${findClusterById(i.additionalClusterId)?.name} (${i.count})`}</div>
              <div className="score-container">{avg.toFixed(2)} / 7.0</div>
            </S.Row>
          );
        })}
    </S.Container>
  );
};

export default CombinationAnalysis;
