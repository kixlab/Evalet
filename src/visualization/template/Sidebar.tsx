import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { VisTab } from '../model/VisTab';
import SidebarItem from '../components/SidebarItem';
import { useCriteriaContext } from '../store/criteriaStore';
import { useDatabaseContext } from '../store/databaseStore';
import { useEvaluationContext } from '../store/evaluationStore';
import { useClusterContext } from '../store/clusterStore';
import useBoardContext from '../store/boardStore';

const Container = styled.div`
  width: 64px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 0;
  background-color: ${Colors.WHITE};
  border-right: 1px solid ${Colors.BLACK12};
  gap: 8px;
  flex-shrink: 0;
  z-index: 500;
`;

interface Props {
  currPage: VisTab;
  setCurrPage: (value: VisTab) => void;
}

const Sidebar = ({ currPage, setCurrPage }: Props) => {
  const { currEvalDetailId, evalDetailOpen, setEvalDetailOpen } = useBoardContext();
  const { database } = useDatabaseContext();
  const { evaluationList } = useEvaluationContext();
  const isAccessibleCriteria = database.length !== 0;
  const isAccessibleInspect = database.length !== 0 && evaluationList.length !== 0;
  return (
    <Container>
      <SidebarItem tab={VisTab.DATABASE} active selected={!evalDetailOpen && currPage === VisTab.DATABASE} onClick={() => setCurrPage(VisTab.DATABASE)} />
      <SidebarItem
        tab={VisTab.CRITERIA}
        active={isAccessibleCriteria}
        selected={!evalDetailOpen && currPage === VisTab.CRITERIA}
        onClick={() => setCurrPage(VisTab.CRITERIA)}
      />
      <SidebarItem
        tab={VisTab.EXPLORE}
        active={isAccessibleInspect}
        selected={!evalDetailOpen && currPage === VisTab.EXPLORE}
        onClick={() => setCurrPage(VisTab.EXPLORE)}
      />
      {currEvalDetailId && <SidebarItem tab={VisTab.DETAIL} active selected={evalDetailOpen} onClick={() => setEvalDetailOpen(true)} />}
    </Container>
  );
};

export default Sidebar;
