import { Colors } from '../../style/colors';
import * as S from './Button.style';

interface Props extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  inactive?: boolean;
  backgroundColor?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const NormalButton = ({ inactive = false, backgroundColor = Colors.POINT_BLUE, onClick, children, ...props }: Props) => {
  return (
    <S.ButtonWrapper
      background={inactive ? Colors.BLACK20 : backgroundColor}
      onClick={() => {
        if (!inactive) onClick();
      }}
      {...props}
    >
      {children}
    </S.ButtonWrapper>
  );
};

export const SecondaryButton = ({ inactive = false, onClick, children, ...props }: Props) => {
  return (
    <S.SecondaryButtonWrapper
      onClick={() => {
        if (!inactive) onClick();
      }}
      {...props}
    >
      {children}
    </S.SecondaryButtonWrapper>
  );
};

export default NormalButton;
