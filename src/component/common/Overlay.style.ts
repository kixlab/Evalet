import styled, { keyframes, css } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const Container = styled.div<{ isOpen: boolean }>`
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.08);
  z-index: 100;

  animation: ${({ isOpen }) =>
    isOpen
      ? css`
          ${fadeIn} 0.15s forwards
        `
      : css`
          ${fadeOut} 0.15s forwards
        `};
`;

export const Overlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
