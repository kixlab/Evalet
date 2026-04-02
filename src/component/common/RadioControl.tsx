import * as S from './RadioControl.style';

interface Props {
  size: number;
  label?: string;
  isSelected: boolean;
  onClick: () => void;
}

const RadioControl = ({ size, label, isSelected, onClick }: Props) => {
  return (
    <S.Container onClick={onClick}>
      <div style={{ width: size, height: size }}>
        <S.RadioContainer>{isSelected && <div className="circle"></div>}</S.RadioContainer>
      </div>
      {label && <S.Label>{label}</S.Label>}
    </S.Container>
  );
};

export default RadioControl;
