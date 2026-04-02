import React, { useEffect, useState } from 'react';
import * as S from './Overlay.style';

interface Props {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  unableToExitByClickBackground?: boolean;
  children: React.ReactNode;
}

const Overlay = ({ isOpen, close, unmount, unableToExitByClickBackground = false, children }: Props) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timeout = setTimeout(() => {
        setVisible(false);
        unmount();
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <S.Container
      isOpen={isOpen}
      onClick={() => {
        if (!unableToExitByClickBackground) close();
      }}
    >
      <S.Overlay onClick={(e) => e.stopPropagation()}>{children}</S.Overlay>
    </S.Container>
  );
};

export default Overlay;
