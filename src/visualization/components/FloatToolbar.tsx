import { useState } from 'react';
import NormalButton, { SecondaryButton } from '../../component/common/NormalButton';
import { Colors } from '../../style/colors';
import useBoardContext from '../store/boardStore';
import { useCriteriaContext } from '../store/criteriaStore';
import * as S from './FloatToolbar.style';
import { useBehaviorContext } from '../store/behaviorStore';
import { StoredBehaviorDetail } from '../model/CriteriaDetail';
import { useTracking } from 'react-tracking';

interface Props {
  goToCriteriaPage: () => void;
}

const FloatToolbar = ({ goToCriteriaPage }: Props) => {
  const [check, setCheck] = useState(false);
  const { selectedBehaviorIds, unSelectAllBehavior, currentCriterionId } = useBoardContext();
  const { addNegativesByCriteriaId, addPositivesByCriteriaId, addExcludesByCriteriaId } = useCriteriaContext();
  const { findBehaviorById } = useBehaviorContext();
  const { trackEvent } = useTracking();

  const handlePositiveAddition = () => {
    if (!currentCriterionId) return;
    const behaviors = selectedBehaviorIds
      .map((bId) => {
        const behavior = findBehaviorById(bId);
        if (!behavior) return undefined;
        return {
          id: behavior.id as string | null,
          feature: behavior.feature,
          rawSnippet: behavior.behavior,
        };
      })
      .filter((s): s is StoredBehaviorDetail => s !== undefined);
    addPositivesByCriteriaId(currentCriterionId, behaviors);
    setCheck(true);
    setTimeout(() => setCheck(false), 3000);
    trackEvent({ section: 'Viz', component: 'FloatToolbar', action: 'addBehavior', value: 'positive' });
  };

  const handleNegativeAddition = () => {
    if (!currentCriterionId) return;
    const behaviors = selectedBehaviorIds
      .map((bId) => {
        const behavior = findBehaviorById(bId);
        if (!behavior) return undefined;
        return {
          id: behavior.id as string | null,
          feature: behavior.feature,
          rawSnippet: behavior.behavior,
        };
      })
      .filter((s): s is StoredBehaviorDetail => s !== undefined);
    addNegativesByCriteriaId(currentCriterionId, behaviors);
    trackEvent({ section: 'Viz', component: 'FloatToolbar', action: 'addBehavior', value: 'negative' });
    setCheck(true);
    setTimeout(() => setCheck(false), 3000);
  };

  const handleExcludeAddition = () => {
    if (!currentCriterionId) return;
    const behaviors = selectedBehaviorIds
      .map((bId) => {
        const behavior = findBehaviorById(bId);
        if (!behavior) return undefined;
        return {
          id: behavior.id as string | null,
          feature: behavior.feature,
          rawSnippet: behavior.behavior,
        };
      })
      .filter((s): s is StoredBehaviorDetail => s !== undefined);
    addExcludesByCriteriaId(currentCriterionId, behaviors);
    trackEvent({ section: 'Viz', component: 'FloatToolbar', action: 'addBehavior', value: 'exclude' });
    setCheck(true);
    setTimeout(() => setCheck(false), 3000);
  };

  const handleGoCriteriaPage = () => {
    goToCriteriaPage();
    unSelectAllBehavior();
  };

  return (
    <S.Container>
      <S.SelectedNum>
        <span className="num">{selectedBehaviorIds.length}</span> selected
      </S.SelectedNum>
      <S.Buttons>
        {!check && (
          <>
            <SecondaryButton onClick={unSelectAllBehavior}>Unselect all</SecondaryButton>
            <NormalButton onClick={handlePositiveAddition} backgroundColor={Colors.POINT_GREEN}>
              Add to Positive
            </NormalButton>
            <NormalButton onClick={handleNegativeAddition} backgroundColor={Colors.POINT_RED}>
              Add to Negative
            </NormalButton>
            <NormalButton onClick={handleExcludeAddition} backgroundColor={Colors.NAVY}>
              Add to Excluded
            </NormalButton>
          </>
        )}
        {check && <div className="note">✅ Added to Example Set!</div>}
      </S.Buttons>
    </S.Container>
  );
};

export default FloatToolbar;
