import { atom, useRecoilState } from 'recoil';
import { EvaluationDetail } from '../model/Evaluation';

const evaluationListAtom = atom<EvaluationDetail[]>({
  key: 'evaluationListAtom',
  default: [],
});

/**
 * You should not use the behavior data directly from this list.
 * Basically the behavior data in this list is out-dated and you should refer it through behavior context by id.
 */
export const useEvaluationContext = () => {
  const [evaluationList, setEvaluationList] = useRecoilState(evaluationListAtom);

  // console.log(evaluationList);

  const maxEvaluationScore = 100;

  const getEvaluationByPairDataId = (pairDataId: string) => {
    return evaluationList.filter((e) => e.pairDataId === pairDataId);
  };

  const updateEvaluationList = (newValue: EvaluationDetail[]) => {
    setEvaluationList(newValue);
  };

  const getEvaluationByCriteriaId = (criteriaId: string) => {
    return evaluationList.filter((e) => e.criteriaId === criteriaId);
  };

  const getEvaluationByPairDataIdAndCriteriaId = (pairDataId: string, criteriaId: string) => {
    return evaluationList.filter((e) => e.pairDataId === pairDataId && e.criteriaId === criteriaId);
  };

  const justSave = () => {};

  return {
    maxEvaluationScore,
    evaluationList,
    setEvaluationList,
    getEvaluationByPairDataId,
    getEvaluationByCriteriaId,
    getEvaluationByPairDataIdAndCriteriaId,
    updateEvaluationList,
    justSave,
  };
};
