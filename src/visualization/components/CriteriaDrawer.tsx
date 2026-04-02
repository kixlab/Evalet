import useBoardContext from '../store/boardStore';
import { useCriteriaContext } from '../store/criteriaStore';
import * as S from './CriteriaDrawer.style';
import { useTracking } from 'react-tracking';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CriteriaDrawer = ({ isOpen, onClose }: Props) => {
  const { criteria } = useCriteriaContext();
  const { currentCriterionId, setCurrentCriterionId, clearNavigation } = useBoardContext();
  const { trackEvent } = useTracking();
  return (
    <>
      {isOpen && <S.Backdrop onClick={onClose} />}
      <S.DrawerContainer className={isOpen ? 'open' : ''}>
        <div className="title">Criteria List</div>
        {criteria.map((c) => {
          return (
            <S.CriterionItem
              key={`drawer-${c.id}`}
              className={c.id === currentCriterionId ? 'selected' : ''}
              onClick={() => {
                trackEvent({ section: 'Viz', component: 'CriteriaDrawer', action: 'selectCriteria' });
                setCurrentCriterionId(c.id);
                clearNavigation();
                onClose();
              }}
            >
              {c.name}
            </S.CriterionItem>
          );
        })}
      </S.DrawerContainer>
    </>
  );
};

export default CriteriaDrawer;
