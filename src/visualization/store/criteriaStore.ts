import { atom, useRecoilState } from 'recoil';
import { CriteriaDetail, StoredBehaviorDetail } from '../model/CriteriaDetail';

const criteriaAtom = atom<CriteriaDetail[]>({
  key: 'criteriaAtom',
  default: [],
});

export const useCriteriaContext = () => {
  const [criteria, setCriteria] = useRecoilState(criteriaAtom);

  // console.log(criteria);

  const updateCriteria = (newValue: CriteriaDetail) => {
    let flag = false;
    const newCriteria = [];
    for (const c of criteria) {
      if (c.id === newValue.id) {
        newCriteria.push(newValue);
        flag = true;
      } else newCriteria.push(c);
    }
    if (!flag) newCriteria.push(newValue);
    setCriteria(newCriteria);
  };

  const getCriteriaById = (id: string) => {
    return criteria.find((c) => c.id === id);
  };

  const getCriteriaByName = (name: string) => {
    return criteria.find((c) => c.name === name);
  };

  const deleteCriteria = (targetId: string) => {
    setCriteria(criteria.filter((c) => c.id !== targetId));
  };

  const addPositivesByCriteriaId = (criteriaId: string, positives: StoredBehaviorDetail[]) => {
    const targetCriteria = getCriteriaById(criteriaId);
    if (targetCriteria === undefined) return;
    updateCriteria({
      ...targetCriteria,
      positiveBehaviors: [...targetCriteria.positiveBehaviors, ...positives],
    });
  };

  const addNegativesByCriteriaId = (criteriaId: string, negatives: StoredBehaviorDetail[]) => {
    const targetCriteria = getCriteriaById(criteriaId);
    if (targetCriteria === undefined) return;
    updateCriteria({
      ...targetCriteria,
      negativeBehaviors: [...targetCriteria.negativeBehaviors, ...negatives],
    });
  };

  const addExcludesByCriteriaId = (criteriaId: string, excludes: StoredBehaviorDetail[]) => {
    const targetCriteria = getCriteriaById(criteriaId);
    if (targetCriteria === undefined) return;
    updateCriteria({
      ...targetCriteria,
      excludeBehaviors: [...targetCriteria.excludeBehaviors, ...excludes],
    });
  };

  const expireAllFewshots = () => {
    setCriteria(
      criteria.map((c) => {
        return {
          ...c,
          positiveBehaviors: c.positiveBehaviors.map((pb) => {
            return {
              ...pb,
              id: null,
            };
          }),
          negativeBehaviors: c.negativeBehaviors.map((nb) => {
            return {
              ...nb,
              id: null,
            };
          }),
          excludeBehaviors: c.excludeBehaviors.map((eb) => {
            return {
              ...eb,
              id: null,
            };
          }),
        };
      }),
    );
  };

  const justSave = () => {};

  return {
    criteria,
    setCriteria,
    updateCriteria,
    deleteCriteria,
    getCriteriaById,
    getCriteriaByName,
    addPositivesByCriteriaId,
    addNegativesByCriteriaId,
    addExcludesByCriteriaId,
    expireAllFewshots,
    justSave,
  };
};
