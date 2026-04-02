import * as S from './CriteriaItem.style';
import { ReactComponent as EditIcon } from '../../assets/icon/ic_writing.svg';
import { ReactComponent as DeleteIcon } from '../../assets/icon/ic_trash_can.svg';
import { ReactComponent as CheckIcon } from '../../assets/icon/ic_check.svg';
import { ReactComponent as XIcon } from '../../assets/icon/ic_x.svg';
import { Colors } from '../../style/colors';
import { CriteriaDetail } from '../model/CriteriaDetail';
import { useCriteriaContext } from '../store/criteriaStore';
import { useState } from 'react';
import { FixedSizeTextArea, OnelineTextInput } from '../../component/common/TextInput';
import { useTracking } from 'react-tracking';

interface Props {
  criteriaDetail: CriteriaDetail;
}

const CriteriaItem = ({ criteriaDetail }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [tempCriterion, setTempCriterion] = useState<CriteriaDetail>(criteriaDetail);

  const { trackEvent } = useTracking();

  const { deleteCriteria, updateCriteria } = useCriteriaContext();

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const editName = (newValue: string) => {
    setTempCriterion({ ...tempCriterion, name: newValue });
  };

  const editDescription = (newValue: string) => {
    setTempCriterion({ ...tempCriterion, description: newValue });
  };

  const deleteBehavior = (type: 'positive' | 'negative' | 'exclude', targetSnippet: string) => {
    if (!window.confirm('Do you really want to delete this?')) return;
    if (type === 'positive') {
      setTempCriterion({ ...tempCriterion, positiveBehaviors: tempCriterion.positiveBehaviors.filter((i) => i.rawSnippet !== targetSnippet) });
    } else if (type === 'negative') {
      setTempCriterion({ ...tempCriterion, negativeBehaviors: tempCriterion.negativeBehaviors.filter((i) => i.rawSnippet !== targetSnippet) });
    } else {
      setTempCriterion({ ...tempCriterion, excludeBehaviors: tempCriterion.excludeBehaviors.filter((i) => i.rawSnippet !== targetSnippet) });
    }
    trackEvent({ section: 'Viz', component: 'CriteriaItem', action: 'deleteBehavior', value: type });
  };

  const handleDelete = () => {
    if (!window.confirm('Do you really want to delete this criterion?')) return;
    deleteCriteria(criteriaDetail.id);
    trackEvent({ section: 'Viz', component: 'CriteriaItem', action: 'deleteCriterion' });
  };

  const handleCancel = () => {
    setTempCriterion(criteriaDetail);
    setEditMode(false);
  };

  const handleSave = () => {
    updateCriteria(tempCriterion);
    setEditMode(false);
    trackEvent({ section: 'Viz', component: 'CriteriaItem', action: 'editCriterion' });
  };

  const showingData = editMode ? tempCriterion : criteriaDetail;

  return (
    <S.Container>
      <S.TextContainer>
        {editMode ? (
          <OnelineTextInput value={tempCriterion.name} onChange={(newVal) => editName(newVal)} placeholder={'Criterion name'} />
        ) : (
          <h3 className="name">{criteriaDetail.name}</h3>
        )}
        {editMode ? (
          <div style={{ width: '100%', height: '80px' }}>
            <FixedSizeTextArea value={tempCriterion.description} onChange={(newVal) => editDescription(newVal)} placeholder="Criterion description" />
          </div>
        ) : (
          <p className="desc">{criteriaDetail.description}</p>
        )}
        <h4 className="pos-label">Positive</h4>
        {showingData.positiveBehaviors.length === 0 && <p className="desc">No results yet...</p>}
        {showingData.positiveBehaviors.map((behavior) => {
          return (
            <S.FewshotRow key={`criteria-detail-${behavior.feature}-${behavior.rawSnippet}`}>
              <p className="desc">
                • {behavior.feature}: {behavior.rawSnippet}
              </p>
              {editMode && (
                <div className="button" onClick={() => deleteBehavior('positive', behavior.rawSnippet)}>
                  <DeleteIcon width={12} height={12} stroke={Colors.BLACK80} />
                </div>
              )}
            </S.FewshotRow>
          );
        })}
        <h4 className="neg-label">Negative</h4>
        {showingData.negativeBehaviors.length === 0 && <p className="desc">No results yet...</p>}
        {showingData.negativeBehaviors.map((behavior) => {
          return (
            <S.FewshotRow key={`criteria-detail-${behavior.feature}-${behavior.rawSnippet}}`}>
              <p className="desc">
                • {behavior.feature}: {behavior.rawSnippet}
              </p>
              {editMode && (
                <div className="button" onClick={() => deleteBehavior('negative', behavior.rawSnippet)}>
                  <DeleteIcon width={12} height={12} stroke={Colors.BLACK80} />
                </div>
              )}
            </S.FewshotRow>
          );
        })}
        <h4 className="exclude-label">Excluded</h4>
        {showingData.excludeBehaviors.length === 0 && <p className="desc">No results yet...</p>}
        {showingData.excludeBehaviors.map((behavior) => {
          return (
            <S.FewshotRow key={`criteria-detail-${behavior.feature}-${behavior.rawSnippet}`}>
              <p className="desc">
                • {behavior.feature}: {behavior.rawSnippet}
              </p>
              {editMode && (
                <div className="button" onClick={() => deleteBehavior('exclude', behavior.rawSnippet)}>
                  <DeleteIcon width={12} height={12} stroke={Colors.BLACK80} />
                </div>
              )}
            </S.FewshotRow>
          );
        })}
      </S.TextContainer>
      <S.ButtonContainer>
        {!editMode && (
          <>
            <div className="button" onClick={turnOnEditMode}>
              <EditIcon width={16} height={16} stroke={Colors.BLACK80} />
            </div>
            {/* <div className="button" onClick={handleDelete}>
              <DeleteIcon width={16} height={16} stroke={Colors.BLACK80} />
            </div> */}
          </>
        )}
        {editMode && (
          <>
            <div className="button" onClick={handleCancel}>
              <XIcon width={16} height={16} stroke={Colors.BLACK80} />
            </div>
            <div className="button" onClick={handleSave}>
              <CheckIcon width={16} height={16} stroke={Colors.BLACK80} />
            </div>
          </>
        )}
      </S.ButtonContainer>
    </S.Container>
  );
};

export default CriteriaItem;
