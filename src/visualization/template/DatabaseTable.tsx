import * as S from './DatabaseTable.style';
import { PairData } from '../model/PairData';
import { useCriteriaContext } from '../store/criteriaStore';
import { useEvaluationContext } from '../store/evaluationStore';
import useBoardContext from '../store/boardStore';
import { useTracking } from 'react-tracking';

interface Props {
  data: PairData[];
}

const DatabaseTable = ({ data }: Props) => {
  const { maxEvaluationScore, getEvaluationByPairDataId } = useEvaluationContext();
  const { setCurrentEvalDetailId } = useBoardContext();
  const { getCriteriaById } = useCriteriaContext();

  const { trackEvent } = useTracking();

  const openEvaluationModal = (pairDataId: string) => {
    setCurrentEvalDetailId({ pairDataId: pairDataId, entryBehaviorId: null });
  };

  return (
    <S.Container>
      <S.HeaderRow>
        <S.HeaderCell className="fill">Query</S.HeaderCell>
        <S.HeaderCell className="fill">Response</S.HeaderCell>
        <S.HeaderCell className="fixed center" fixedWidth="160px">
          Evaluation
        </S.HeaderCell>
      </S.HeaderRow>
      <S.DataContainer>
        {data.map((d) => {
          const evaluations = getEvaluationByPairDataId(d.id);
          const isEvaluationReady = evaluations.length > 0;
          return (
            <S.DataRow key={`table-data-${d.id}`}>
              <S.DataCell className="fill">{d.query}</S.DataCell>
              <S.DataCell className="fill">{d.response}</S.DataCell>
              <S.DataCell className="fixed center" fixedWidth="160px">
                {!isEvaluationReady && `Not evaluated yet`}
                {isEvaluationReady && (
                  <S.EvaluationCell>
                    {evaluations.map((e) => {
                      return (
                        <div className="row" key={`table-evaluation-${d.id}-${e.id}`}>
                          <div className="label">{getCriteriaById(e.criteriaId)?.name ?? ''}</div>
                          <div className="score">
                            {e.overallScore} / {maxEvaluationScore}
                          </div>
                        </div>
                      );
                    })}
                    <S.EvaluationButton
                      className={isEvaluationReady ? 'ready' : ''}
                      onClick={() => {
                        if (!isEvaluationReady) return;
                        openEvaluationModal(d.id);
                        trackEvent({ section: 'Viz', component: 'DatabaseTable', action: 'viewEvaluation' });
                      }}
                    >
                      View Details
                    </S.EvaluationButton>
                  </S.EvaluationCell>
                )}
              </S.DataCell>
            </S.DataRow>
          );
        })}
      </S.DataContainer>
    </S.Container>
  );
};

export default DatabaseTable;
