import { Criteria } from '../../model/Criteria';
import ColorBlock from './ColorBlock';
import * as S from './CriteriaChip.style';

interface Props {
  criteria: Criteria;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}

const CriteriaChip = ({ criteria, selected, disabled, onClick }: Props) => {
  const handleClick = () => {
    if (!disabled) onClick();
  };
  return (
    <S.Container className={disabled ? 'disabled' : selected ? 'selected' : ''} color={criteria.color} onClick={handleClick}>
      <ColorBlock color={criteria.color} /> {criteria.title}
    </S.Container>
  );
};

export default CriteriaChip;
