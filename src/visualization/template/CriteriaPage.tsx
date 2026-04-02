import { overlay } from 'overlay-kit';
import NormalButton from '../../component/common/NormalButton';
import CriteriaItem from '../components/CriteriaItem';
import { useCriteriaContext } from '../store/criteriaStore';
import * as S from './CriteriaPage.style';
import CriteriaEditModal from './CriteriaEditModal';
import Overlay from '../../component/common/Overlay';

const CriteriaPage = () => {
  const { criteria, updateCriteria } = useCriteriaContext();

  const openCriteriaModal = () => {
    overlay.open(({ isOpen, close, unmount }) => {
      return (
        <Overlay isOpen={isOpen} close={close} unmount={unmount} unableToExitByClickBackground>
          <CriteriaEditModal close={close} onComplete={unmount} />
        </Overlay>
      );
    });
  };
  return (
    <S.Container>
      <S.Header>
        <div className="text-container">
          <h3 className="title">Criteria Set</h3>
          <h3 className="desc">Write your criteria to evaluate responses</h3>
        </div>
        <div className="button-container">
          <NormalButton onClick={openCriteriaModal}>+ Add Criterion</NormalButton>
        </div>
      </S.Header>
      {criteria.map((c) => (
        <CriteriaItem key={`criteria-item-${c.id}`} criteriaDetail={c} />
      ))}
    </S.Container>
  );
};

export default CriteriaPage;
