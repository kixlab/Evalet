import * as S from './Toggle.style';

interface Props {
  isOn: boolean;
  onClick: () => void;
}

const Toggle = ({ isOn, onClick }: Props) => {
  return (
    <S.ToggleContainer onClick={onClick}>
      <div className={`toggle-container ${isOn ? 'toggle-checked' : ''}`} />
      <div className={`toggle-circle ${isOn ? 'toggle-checked' : ''}`} />
    </S.ToggleContainer>
  );
};

export default Toggle;
