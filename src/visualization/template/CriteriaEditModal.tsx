import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';
import { CriteriaDetail } from '../model/CriteriaDetail';
import NormalButton, { SecondaryButton } from '../../component/common/NormalButton';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { FixedSizeTextArea, OnelineTextInput } from '../../component/common/TextInput';
import { useCriteriaContext } from '../store/criteriaStore';
import { ReactComponent as DeleteIcon } from '../../assets/icon/ic_trash_can.svg';
import useBoardContext from '../store/boardStore';
import { useBehaviorContext } from '../store/behaviorStore';

export const OverlayContainer = styled.div`
  width: 560px;
  height: fit-content;
  padding: 32px;
  background-color: ${Colors.WHITE};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h1.title {
    font-size: 16px;
    font-weight: ${TextStyle.BOLD};
    margin-bottom: 8px;
  }

  .buttons {
    width: fit-content;
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  h3.sub-title {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
  }
`;

const BehaviorContainer = styled.div`
  width: 100%;
  height: fit-content;
  padding: 16px;
  border-radius: 8px;
  background-color: ${Colors.TABLE_BACKGROUND};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BehaviorRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  .text {
    flex-grow: 1;
    font-size: 12px;
    font-weight: ${TextStyle.REGULAR};
  }

  .icon {
    flex-shrink: 0;
    padding: 4px;
    cursor: pointer;
  }
`;

interface Props {
  targetCriteria?: CriteriaDetail;
  close: () => void;
  onComplete: () => void;
}

const CriteriaEditModal = ({ targetCriteria, close, onComplete }: Props) => {
  const { updateCriteria } = useCriteriaContext();
  const [tempCriteria, setTempCriteria] = useState<CriteriaDetail>();
  const { currentCriterionId, setCurrentCriterionId } = useBoardContext();

  useEffect(() => {
    if (targetCriteria) {
      setTempCriteria(targetCriteria);
    } else {
      setTempCriteria({
        id: v4(),
        name: '',
        description: '',
        positiveBehaviors: [],
        negativeBehaviors: [],
        excludeBehaviors: [],
      });
    }
  }, []);

  const editName = (newValue: string) => {
    if (!tempCriteria) return;
    setTempCriteria({ ...tempCriteria, name: newValue });
  };

  const editDescription = (newValue: string) => {
    if (!tempCriteria) return;
    setTempCriteria({ ...tempCriteria, description: newValue });
  };

  const deleteBehavior = (type: 'positive' | 'negative' | 'exclude', targetSnippet: string) => {
    if (!tempCriteria) return;
    if (!window.confirm('Do you really want to delete this?')) return;
    if (type === 'positive') {
      setTempCriteria({ ...tempCriteria, positiveBehaviors: tempCriteria.positiveBehaviors.filter((i) => i.rawSnippet !== targetSnippet) });
    } else if (type === 'negative') {
      setTempCriteria({ ...tempCriteria, negativeBehaviors: tempCriteria.negativeBehaviors.filter((i) => i.rawSnippet !== targetSnippet) });
    } else {
      setTempCriteria({ ...tempCriteria, excludeBehaviors: tempCriteria.excludeBehaviors.filter((i) => i.rawSnippet !== targetSnippet) });
    }
  };

  const handleSave = () => {
    if (!tempCriteria) return;
    updateCriteria(tempCriteria);
    if (currentCriterionId === null) setCurrentCriterionId(tempCriteria.id);
    onComplete();
  };

  return (
    <OverlayContainer>
      <h1 className="title">New Criteria</h1>
      <h3 className="sub-title">Name</h3>
      <OnelineTextInput value={tempCriteria?.name ?? ''} onChange={(newVal) => editName(newVal)} placeholder="Criterion name" />
      <h3 className="sub-title">Description</h3>
      <div style={{ width: '100%', height: '80px' }}>
        <FixedSizeTextArea value={tempCriteria?.description ?? ''} onChange={(newVal) => editDescription(newVal)} placeholder="Criterion description" />
      </div>
      <h3 className="sub-title">Positive Behaviors</h3>
      <BehaviorContainer>
        {tempCriteria?.positiveBehaviors.map((behavior) => {
          return (
            <BehaviorRow key={`positive-behavior-id-${behavior}`}>
              <p className="text">
                {behavior.feature}: {behavior.rawSnippet}
              </p>
              <div className="icon" onClick={() => deleteBehavior('positive', behavior.rawSnippet)}>
                <DeleteIcon width={12} height={12} stroke={Colors.BLACK80} />
              </div>
            </BehaviorRow>
          );
        })}
      </BehaviorContainer>
      <h3 className="sub-title">Negative Behaviors</h3>
      <BehaviorContainer>
        {tempCriteria?.negativeBehaviors.map((behavior) => {
          return (
            <BehaviorRow key={`negative-behavior-id-${behavior}`}>
              <p className="text">
                {behavior.feature}: {behavior.rawSnippet}
              </p>
              <div className="icon" onClick={() => deleteBehavior('negative', behavior.rawSnippet)}>
                <DeleteIcon width={12} height={12} stroke={Colors.BLACK80} />
              </div>
            </BehaviorRow>
          );
        })}
      </BehaviorContainer>
      <h3 className="sub-title">Behaviors should be excluded</h3>
      <BehaviorContainer>
        {tempCriteria?.excludeBehaviors.map((behavior) => {
          return (
            <BehaviorRow key={`exclude-behavior-id-${behavior}`}>
              <p className="text">
                {behavior.feature}: {behavior.rawSnippet}
              </p>
              <div className="icon" onClick={() => deleteBehavior('exclude', behavior.rawSnippet)}>
                <DeleteIcon width={12} height={12} stroke={Colors.BLACK80} />
              </div>
            </BehaviorRow>
          );
        })}
      </BehaviorContainer>
      <div className="buttons">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <NormalButton inactive={!tempCriteria} onClick={handleSave}>
          Save
        </NormalButton>
      </div>
    </OverlayContainer>
  );
};

export default CriteriaEditModal;
