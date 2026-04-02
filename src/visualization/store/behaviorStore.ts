import { atom, useRecoilState } from 'recoil';
import { Behavior } from '../model/Behavior';

const behaviorListAtom = atom<Behavior[]>({
  key: 'behaviorListAtom',
  default: [],
});

export const useBehaviorContext = () => {
  const [behaviorList, setBehaviorList] = useRecoilState(behaviorListAtom);

  // console.log(behaviorList);

  const updateSingleBehavior = (newValue: Behavior) => {
    const newBehaviors = behaviorList.map((b) => {
      if (b.id === newValue.id) return newValue;
      else return b;
    });
    setBehaviorList(newBehaviors);
  };

  const updateAllBehavior = (newValue: Behavior[]) => {
    setBehaviorList(newValue);
  };

  const findBehaviorById = (targetId: string) => {
    return behaviorList.find((b) => b.id === targetId);
  };

  const findBehaviorsByPairDataIdAndCriteriaId = (pairDataId: string, criteriaId: string) => {
    return behaviorList.filter((b) => b.criteriaId === criteriaId && pairDataId === b.pairDataId);
  };

  const justSave = () => {};

  return {
    behaviorList,
    setBehaviorList,
    findBehaviorById,
    updateAllBehavior,
    updateSingleBehavior,
    findBehaviorsByPairDataIdAndCriteriaId,
    justSave,
  };
};
