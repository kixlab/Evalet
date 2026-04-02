import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { VisTab } from '../model/VisTab';
import { VisControlType } from '../model/VisControlType';
import { Behavior } from '../model/Behavior';

const currPageAtom = atom<VisTab>({
  key: 'currPageAtom',
  default: VisTab.DATABASE,
});

const hoveringClusterAtom = atom<string | null>({
  key: 'hoveringObjectAtom',
  default: null,
});

const hoveringBehaviorAtom = atom<string | null>({
  key: 'hoveringBehaviorAtom',
  default: null,
});

const selectedClusterIdAtom = atom<string | null>({
  key: 'selectedObjectIdAtom',
  default: null,
});

const pinnedClusterIdsAtom = atom<string[]>({
  key: 'pinnedClusterIdsAtom',
  default: [],
});

const selectedBehaviorIdsAtom = atom<string[]>({
  key: 'selectedBehaviorIdsAtom',
  default: [],
});

export const hasSelectedItemsSelector = selector({
  key: 'hasSelectedItemsSelector',
  get: ({ get }) => {
    const selectedBehaviorIds = get(selectedBehaviorIdsAtom);
    const pinnedClusterIds = get(pinnedClusterIdsAtom);
    return selectedBehaviorIds.length > 0 || pinnedClusterIds.length > 0;
  },
});

const currentCriterionIdAtom = atom<string | null>({
  key: 'currentCriterionIdAtom',
  default: null,
});

const inspectFullOrSelectAtom = atom<'full' | 'select'>({
  key: 'inspectFullOrSelectAtom',
  default: 'full',
});

const currEvalDetailIdAtom = atom<{ pairDataId: string; entryBehaviorId: string | null } | null>({
  key: 'currEvalDetailIdAtom',
  default: null,
});

const isCriteriaDrawerOpenAtom = atom<boolean>({
  key: 'isCriteriaDrawerOpenAtom',
  default: false,
});

const visControlTypeAtom = atom<VisControlType>({
  key: 'visControlTypeAtom',
  default: VisControlType.HIGH_CLUSTER,
});

const previousFewShotBehaviorEmbeddingsAtom = atom<Behavior[]>({
  key: 'previousFewShotBehaviorEmbeddingsAtom',
  default: [],
});

const isComparePreviousOnAtom = atom<boolean>({
  key: 'isComparePreviousOnAtom',
  default: false,
});

const hoveringPrevBehaviorAtom = atom<Behavior | null>({
  key: 'hoveringPrevBehaviorAtom',
  default: null,
});

const isCriteriaTabTooltipOnAtom = atom<boolean>({
  key: 'isCriteriaTabTooltipOnAtom',
  default: false,
});

const isInspectTabTooltipOnAtom = atom<boolean>({
  key: 'isInspectTabTooltipOnAtom',
  default: false,
});

const temporarySelectedBehaviorIdInDetailAtom = atom<string | null>({
  key: 'temporarySelectedBehaviorInDetailAtom',
  default: null,
});

const evalDetailOpenAtom = atom<boolean>({
  key: 'evalDetailOpenAtom',
  default: false,
});

// Push Cluster Ids, if empty, the current navigation is root.
const navigationStackAtom = atom<string[]>({
  key: 'navigationStackAtom',
  default: [],
});

const useBoardContext = () => {
  const [currPage, setCurrPage] = useRecoilState(currPageAtom);
  const [hoveringCluster, setHoveringCluster] = useRecoilState(hoveringClusterAtom);
  const [hoveringBehavior, setHoveringBehavior] = useRecoilState(hoveringBehaviorAtom);
  const [selectedClusterId, setSelectedClusterId] = useRecoilState(selectedClusterIdAtom);
  const [selectedBehaviorIds, setSelectedBehaviorIds] = useRecoilState(selectedBehaviorIdsAtom);
  const [pinnedClusterIds, setPinnedClusterIds] = useRecoilState(pinnedClusterIdsAtom);
  const [currentCriterionId, setCurrentCriterionId] = useRecoilState(currentCriterionIdAtom);
  const [inspectFullOrSelect, setInspectFullOrSelect] = useRecoilState(inspectFullOrSelectAtom);
  const [currEvalDetailId, setCurrEvalDetailId] = useRecoilState(currEvalDetailIdAtom);
  const [navigationStack, setNavigationStack] = useRecoilState(navigationStackAtom);
  const [isCriteriaDrawerOpen, setCriteriaDrawerOpen] = useRecoilState(isCriteriaDrawerOpenAtom);
  const [currentVisControlType, setCurrentVisControlType] = useRecoilState(visControlTypeAtom);
  const [previousFewShotBehaviorEmbeddings, setPreviousFewShotBehaviorEmbeddings] = useRecoilState(previousFewShotBehaviorEmbeddingsAtom);
  const [isComparePreviousOn, setComparePreviousOn] = useRecoilState(isComparePreviousOnAtom);
  const [hoveringPrevBehavior, setHoveringPrevBehavior] = useRecoilState(hoveringPrevBehaviorAtom);
  const [isCriteriaTabTooltipOn, setCriteriaTabTooltipOn] = useRecoilState(isCriteriaTabTooltipOnAtom);
  const [isInspectTabTooltipOn, setInspectTabTooltipOn] = useRecoilState(isInspectTabTooltipOnAtom);
  const [temporarySelectedBehaviorIdInDetail, setTemporarySelectedBehaviorIdInDetail] = useRecoilState(temporarySelectedBehaviorIdInDetailAtom);
  const [evalDetailOpen, setEvalDetailOpen] = useRecoilState(evalDetailOpenAtom);
  const hasSelectedItems = useRecoilValue(hasSelectedItemsSelector);

  const pushNavigation = (id: string) => {
    setNavigationStack([...navigationStack, id]);
  };

  const pushNavigationTree = (ids: string[]) => {
    setNavigationStack(ids);
  };

  const restoreNavigation = () => {
    if (navigationStack.length === 0) return;
    const newStack = navigationStack.slice(0, -1);
    setNavigationStack(newStack);
    if (newStack.length !== 0) {
      setSelectedClusterId(newStack[newStack.length - 1]);
    } else {
      setSelectedClusterId(null);
    }
  };

  const clearNavigation = () => {
    setNavigationStack([]);
  };

  const selectBehaviorById = (id: string) => {
    if (selectedBehaviorIds.includes(id)) return;
    setSelectedBehaviorIds((prev) => [...prev, id]);
  };

  const unSelectBehaviorById = (id: string) => {
    setSelectedBehaviorIds(selectedBehaviorIds.filter((b) => b !== id));
  };

  const unSelectAllBehavior = () => {
    setSelectedBehaviorIds([]);
  };

  const pinCluster = (id: string) => {
    setPinnedClusterIds([...pinnedClusterIds, id]);
  };

  const unPinCluster = (id: string) => {
    setPinnedClusterIds(pinnedClusterIds.filter((i) => i !== id));
  };

  const clearPinnedClusters = () => {
    setPinnedClusterIds([]);
  };

  const goToInspectPage = () => {
    setCurrentPage(VisTab.EXPLORE);
  };

  const goToCriteriaPage = () => {
    setCurrentPage(VisTab.CRITERIA);
  };

  const setCurrentPage = (tab: VisTab) => {
    setCurrPage(tab);
    setEvalDetailOpen(false);
  };

  const setCurrentEvalDetailId = (newValue: { pairDataId: string; entryBehaviorId: string | null } | null) => {
    setCurrEvalDetailId(newValue);
    if (newValue === null && currEvalDetailId !== null) {
      setEvalDetailOpen(false);
    } else {
      setEvalDetailOpen(true);
    }
  };

  return {
    navigationStack,
    pushNavigation,
    pushNavigationTree,
    restoreNavigation,
    clearNavigation,
    currentCriterionId,
    setCurrentCriterionId,
    selectedBehaviorIds,
    selectBehaviorById,
    unSelectBehaviorById,
    unSelectAllBehavior,
    inspectFullOrSelect,
    setInspectFullOrSelect,
    currEvalDetailId,
    setCurrentEvalDetailId,
    pinnedClusterIds,
    pinCluster,
    unPinCluster,
    clearPinnedClusters,
    hoveringCluster,
    setHoveringCluster,
    selectedClusterId,
    setSelectedClusterId,
    hoveringBehavior,
    setHoveringBehavior,
    currPage,
    setCurrentPage,
    goToInspectPage,
    goToCriteriaPage,
    isCriteriaDrawerOpen,
    setCriteriaDrawerOpen,
    currentVisControlType,
    setCurrentVisControlType,
    previousFewShotBehaviorEmbeddings,
    setPreviousFewShotBehaviorEmbeddings,
    isComparePreviousOn,
    setComparePreviousOn,
    hoveringPrevBehavior,
    setHoveringPrevBehavior,
    isCriteriaTabTooltipOn,
    setCriteriaTabTooltipOn,
    isInspectTabTooltipOn,
    setInspectTabTooltipOn,
    hasSelectedItems,
    temporarySelectedBehaviorIdInDetail,
    setTemporarySelectedBehaviorIdInDetail,
    evalDetailOpen,
    setEvalDetailOpen,
  };
};

export default useBoardContext;
