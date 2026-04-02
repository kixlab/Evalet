import * as S from './Checkbox.style';
import { ReactComponent as Check } from '../../assets/icon/ic_check.svg';
import { Colors } from '../../style/colors';

interface Props {
  width: number;
  height: number;
  selected: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Checkbox = ({ width, height, selected, onClick }: Props) => {
  return (
    <S.Container className={selected ? 'selected' : ''} style={{ width, height }} onClick={onClick}>
      <Check width={width - 4} height={height - 4} fill={selected ? Colors.WHITE : Colors.BLACK20} />
    </S.Container>
  );
};

export default Checkbox;
