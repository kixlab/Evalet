import { useEffect, useState } from 'react';
import Analysis from '../components/Analysis';
import HigherClusterItem, { BaseClusterItem } from '../components/ClusterItem';
import Navigator from '../components/Navigator';
import { BaseCluster, Cluster, HigherCluster, isBaseCluster, isHigherCluster } from '../model/Clusters';
import useBoardContext from '../store/boardStore';
import { useClusterContext } from '../store/clusterStore';
import * as S from './InspectPage.style';
import { Behavior } from '../model/Behavior';
import { useBehaviorContext } from '../store/behaviorStore';
import { useCriteriaContext } from '../store/criteriaStore';
import BehaviorItem from '../components/BehaviorItem';
import { useDatabaseContext } from '../store/databaseStore';
import { useEvaluationContext } from '../store/evaluationStore';
import { ClusterCombinationResult, DataToCluster } from '../model/ClusterCombination';
import { exploreOneMoreCluster, filterByClusters } from '../utils/clusterCombo';
import CombinationAnalysis from '../components/CombinationAnalysis';
import InspectSelectTab from './InspectSelectTab';
import { ReactComponent as ListSortIcon } from '../../assets/icon/ic_sort_list.svg';
import { Colors } from '../../style/colors';
import { ReactComponent as ChevronRight } from '../../assets/icon/ic_chevron_right.svg';
import { ReactComponent as ChevronDown } from '../../assets/icon/ic_chevron_down.svg';

const InspectPage = () => {
  const [subClusters, setSubClusters] = useState<Cluster[] | null>(null);
  const [subBehaviors, setSubBehaviors] = useState<Behavior[] | null>(null);
  const [behaviorFilter, setBehaviorFilter] = useState<'positive' | 'negative' | null>(null);
  const [combinationInfo, setCombinationInfo] = useState<ClusterCombinationResult[]>([]);
  const [positiveOpen, setPositiveOpen] = useState<boolean>(true);
  const [negativeOpen, setNegativeOpen] = useState<boolean>(true);

  const {
    navigationStack,
    currentCriterionId,
    setCurrentCriterionId,
    inspectFullOrSelect,
    setInspectFullOrSelect,
    setHoveringCluster,
    setCriteriaDrawerOpen,
    hasSelectedItems,
  } = useBoardContext();
  const { clusterListMap, getClusterListByCriteriaId, findClusterById, findAllConnectedClusters } = useClusterContext();
  const { getCriteriaById } = useCriteriaContext();
  const { findBehaviorById } = useBehaviorContext();
  const { dataToClusterMap } = useDatabaseContext();

  useEffect(() => {
    if (currentCriterionId === null) return;
    const current = navigationStack.length === 0 ? 'Root' : navigationStack[navigationStack.length - 1];
    const currentCluster = current === 'Root' ? null : findClusterById(current) ?? null;
    const clusterList = getClusterListByCriteriaId(currentCriterionId);
    if (clusterList === undefined || clusterList.length === 0) return; // Pipeline not ready
    if (currentCluster === null) {
      setSubClusters(clusterList[clusterList.length - 1]);
      setSubBehaviors(null);
    } else if (isHigherCluster(currentCluster)) {
      setSubClusters(currentCluster.subClusterIds.map((id) => findClusterById(id)).filter((c): c is Cluster => c !== undefined));
      setSubBehaviors(null);
    } else if (isBaseCluster(currentCluster)) {
      setSubClusters(null);
      setSubBehaviors(currentCluster.behaviorIds.map((id) => findBehaviorById(id)).filter((b): b is Behavior => b !== undefined));
    }
  }, [navigationStack, clusterListMap, currentCriterionId]);

  useEffect(() => {
    if (navigationStack.length === 0) return;
    clusterCombination([navigationStack[navigationStack.length - 1]]);
  }, [navigationStack, currentCriterionId]);

  useEffect(() => {
    if (!hasSelectedItems) setInspectFullOrSelect('full');
  }, [hasSelectedItems]);

  const handleFilter = (newValue: 'positive' | 'negative' | null) => {
    if (behaviorFilter === newValue) setBehaviorFilter(null);
    else setBehaviorFilter(newValue);
  };

  const clusterCombination = (query: string[]) => {
    if (!currentCriterionId) return;
    const target = dataToClusterMap.get(currentCriterionId);
    const clusters = getClusterListByCriteriaId(currentCriterionId);
    if (!target || !clusters) return;
    const currPairData = filterByClusters(target, query);
    const clustersShouldBeExcluded = Array.from(new Set(query.flatMap((qId) => findAllConnectedClusters(qId))));
    const combination = exploreOneMoreCluster(
      target,
      query,
      clusters
        .flat()
        .filter((c) => !clustersShouldBeExcluded.includes(c.id))
        .map((c) => c.id),
    );
    setCombinationInfo(combination);
  };

  return (
    <>
      {/* For sticky header styling */}
      <S.SelectContainer>
        <S.CriteriaSetButton onClick={() => setCriteriaDrawerOpen(true)}>
          <ListSortIcon width={20} height={20} stroke={Colors.BLACK80} />
          Current Criterion: {getCriteriaById(currentCriterionId ?? '')?.name ?? '-'}
        </S.CriteriaSetButton>
        {hasSelectedItems && (
          <div className="tab-container">
            <S.TabButton
              className={inspectFullOrSelect === 'full' ? 'selected' : ''}
              onClick={() => {
                setInspectFullOrSelect('full');
              }}
            >
              All Entries
            </S.TabButton>
            <S.TabButton
              className={inspectFullOrSelect === 'select' ? 'selected' : ''}
              onClick={() => {
                setInspectFullOrSelect('select');
              }}
            >
              Selected Entries
            </S.TabButton>
          </div>
        )}
      </S.SelectContainer>
      <S.Container>
        {inspectFullOrSelect === 'full' && (
          <>
            <Navigator />
            {navigationStack.length === 0 && <Analysis />}
            {/* {navigationStack.length > 0 && combinationInfo.length > 0 && (
            <CombinationAnalysis query={[navigationStack[navigationStack.length - 1]]} info={combinationInfo} />
          )} */}
            {subClusters !== null && isHigherCluster(subClusters[0]) && <S.SubTitle>Super Clusters</S.SubTitle>}
            {subClusters !== null && isBaseCluster(subClusters[0]) && <S.SubTitle>Clusters</S.SubTitle>}
            {subClusters !== null &&
              isHigherCluster(subClusters[0]) &&
              subClusters.map((c) => <HigherClusterItem key={`cluster-item-${c.id}`} cluster={c as HigherCluster} />)}
            {subClusters !== null &&
              isBaseCluster(subClusters[0]) &&
              subClusters.map((c) => <BaseClusterItem key={`cluster-item-${c.id}`} cluster={c as BaseCluster} />)}
            {subBehaviors !== null && <S.SubTitle>Fragments</S.SubTitle>}
            {/* {subBehaviors !== null && (
              <S.FilterContainer>
                <div className="label">Filter</div>
                <S.PosNegFilterTag className={'positive' + (behaviorFilter === 'positive' ? ' selected' : '')} onClick={() => handleFilter('positive')}>
                  Positive
                </S.PosNegFilterTag>
                <S.PosNegFilterTag className={'negative' + (behaviorFilter === 'negative' ? ' selected' : '')} onClick={() => handleFilter('negative')}>
                  Negative
                </S.PosNegFilterTag>
              </S.FilterContainer>
            )} */}
            {subBehaviors !== null && (
              <S.BehaviorListContainer>
                <S.BehaviorListHeader className={negativeOpen ? '' : 'close'} onClick={() => setNegativeOpen(!negativeOpen)}>
                  <ChevronDown width={16} height={16} stroke={Colors.BLACK80} />
                  <div className="title">{`Negative (${subBehaviors.filter((b) => !b.isPositive).length})`}</div>
                </S.BehaviorListHeader>
                {negativeOpen && subBehaviors.filter((b) => !b.isPositive).map((b) => <BehaviorItem key={`behavior-item-${b.id}`} behavior={b} />)}
                <S.BehaviorListHeader className={positiveOpen ? '' : 'close'} onClick={() => setPositiveOpen(!positiveOpen)}>
                  <ChevronDown width={16} height={16} stroke={Colors.BLACK80} />
                  <div className="title">{`Positive (${subBehaviors.filter((b) => b.isPositive).length})`}</div>
                </S.BehaviorListHeader>
                {positiveOpen && subBehaviors.filter((b) => b.isPositive).map((b) => <BehaviorItem key={`behavior-item-${b.id}`} behavior={b} />)}
              </S.BehaviorListContainer>
            )}
          </>
        )}
        {inspectFullOrSelect === 'select' && <InspectSelectTab />}
      </S.Container>
    </>
  );
};

export default InspectPage;
