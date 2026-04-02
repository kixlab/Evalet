import Checkbox from '../../component/common/Checkbox';
import { Behavior } from '../model/Behavior';
import useBoardContext from '../store/boardStore';
import { useNavigator } from '../store/navigator';
import * as S from './BehaviorItem.style';
import { useTracking } from 'react-tracking';

interface Props {
  behavior: Behavior;
}

const BehaviorItem = ({ behavior }: Props) => {
  const { selectedBehaviorIds, selectBehaviorById, unSelectBehaviorById, setCurrentEvalDetailId } = useBoardContext();
  const selected = selectedBehaviorIds.includes(behavior.id);
  const { isBaseline } = useNavigator();

  const { trackEvent } = useTracking();

  const openEvalDetail = () => {
    setCurrentEvalDetailId({ pairDataId: behavior.pairDataId, entryBehaviorId: behavior.id });
  };

  return (
    <S.OuterContainer>
      <Checkbox
        width={24}
        height={24}
        selected={selected}
        onClick={() => {
          if (!selected) selectBehaviorById(behavior.id);
          else unSelectBehaviorById(behavior.id);
        }}
      />
      <S.Container
        className={selected ? 'selected' : ''}
        onClick={(e) => {
          e.stopPropagation();
          trackEvent({ section: 'Viz', component: 'BehaviorItem', action: 'viewEvaluation' });
          openEvalDetail();
        }}
      >
        <S.TypeLabel>Fragment</S.TypeLabel>
        <S.PosNegTag className={behavior.isPositive ? 'positive' : 'negative'}>{behavior.isPositive ? 'Positive' : 'Negative'}</S.PosNegTag>
        <S.ClusterName>{behavior.feature}</S.ClusterName>
        <S.TypeLabel>Original Fragment</S.TypeLabel>
        <S.Description>{behavior.behavior}</S.Description>
        {!isBaseline && (
          <>
            <S.TypeLabel>Evaluation Reasoning</S.TypeLabel>
            <S.Description>{behavior.evaluation}</S.Description>
          </>
        )}
        {/* <S.EvalDetailButton>Open the Whole Output</S.EvalDetailButton> */}
      </S.Container>
    </S.OuterContainer>
  );
};

export default BehaviorItem;
