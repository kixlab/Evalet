import * as S from './VisControl.style';
import { ReactComponent as BaseUnselectedIcon } from '../../assets/icon/ic_base_unselected.svg';
import { ReactComponent as BaseSelectedIcon } from '../../assets/icon/ic_base_selected.svg';
import { ReactComponent as HighUnselectedIcon } from '../../assets/icon/ic_high_unselected.svg';
import { ReactComponent as HighSelectedIcon } from '../../assets/icon/ic_high_selected.svg';
import { ReactComponent as PosNegSelectedIcon } from '../../assets/icon/ic_posneg_selected.svg';
import { ReactComponent as PosNegUnselectedIcon } from '../../assets/icon/ic_posneg_unselected.svg';
import useBoardContext from '../store/boardStore';
import { VisControlType } from '../model/VisControlType';
import { useCriteriaContext } from '../store/criteriaStore';
import Toggle from '../../component/common/Toggle';
import { useState } from 'react';
import { useTracking } from 'react-tracking';
import { useNavigator } from '../store/navigator';

const VisControl = () => {
  const { currentVisControlType, setCurrentVisControlType, currentCriterionId, previousFewShotBehaviorEmbeddings, isComparePreviousOn, setComparePreviousOn } =
    useBoardContext();
  const { getCriteriaById } = useCriteriaContext();
  const { isBaseline } = useNavigator();

  const { trackEvent } = useTracking();

  const currentCriterion = getCriteriaById(currentCriterionId ?? '');

  return (
    <S.Container>
      <h3 className="title">Map Control</h3>
      <S.Button
        className={currentVisControlType === VisControlType.HIGH_CLUSTER ? 'selected' : ''}
        onClick={() => {
          trackEvent({ section: 'Viz', component: 'VisControl', action: 'viewHighCluster' });
          setCurrentVisControlType(VisControlType.HIGH_CLUSTER);
        }}
      >
        {currentVisControlType === VisControlType.HIGH_CLUSTER ? <HighSelectedIcon width={20} height={20} /> : <HighUnselectedIcon width={20} height={20} />}
        Super Clusters
      </S.Button>
      <S.Button
        className={currentVisControlType === VisControlType.BASE_CLUSTER ? 'selected' : ''}
        onClick={() => {
          trackEvent({ section: 'Viz', component: 'VisControl', action: 'viewBaseCluster' });
          setCurrentVisControlType(VisControlType.BASE_CLUSTER);
        }}
      >
        {currentVisControlType === VisControlType.BASE_CLUSTER ? <BaseSelectedIcon width={20} height={20} /> : <BaseUnselectedIcon width={20} height={20} />}
        Base Clusters
      </S.Button>
      <S.Button
        className={currentVisControlType === VisControlType.POSNEG ? 'selected' : ''}
        onClick={() => {
          trackEvent({ section: 'Viz', component: 'VisControl', action: 'viewPosNeg' });
          setCurrentVisControlType(VisControlType.POSNEG);
        }}
      >
        {currentVisControlType === VisControlType.POSNEG ? <PosNegSelectedIcon width={20} height={20} /> : <PosNegUnselectedIcon width={20} height={20} />}
        Positive/Negative
      </S.Button>
      {!isBaseline && (
        <>
          <h3 className="title">For: {currentCriterion?.name ?? ''}</h3>
          <S.ToggleRow>
            <div className="row-label">Show Examples ({previousFewShotBehaviorEmbeddings.filter((b) => b.criteriaId === currentCriterionId).length})</div>
            <Toggle
              isOn={isComparePreviousOn}
              onClick={() => {
                trackEvent({ section: 'Viz', component: 'VisControl', action: isComparePreviousOn ? 'turnOffPrevious' : 'turnOnPrevious' });
                setComparePreviousOn(!isComparePreviousOn);
              }}
            />
          </S.ToggleRow>
        </>
      )}
    </S.Container>
  );
};

export default VisControl;
