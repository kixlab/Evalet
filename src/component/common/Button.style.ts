import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const ButtonWrapper = styled.button<{ background: string }>`
  all: unset;
  width: fit-content;
  height: fit-content;
  padding: 6px 8px;
  border-radius: 4px;
  background: ${(props) => props.background};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  color: ${Colors.WHITE};
  font-size: 14px;
  font-weight: ${TextStyle.REGULAR};

  &:hover {
    filter: brightness(110%);
  }
`;

export const SecondaryButtonWrapper = styled.button`
  all: unset;
  width: fit-content;
  height: fit-content;
  padding: 6px 8px;
  border-radius: 4px;
  background: ${Colors.WHITE};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  color: ${Colors.BLACK60};
  font-size: 14px;
  font-weight: ${TextStyle.REGULAR};

  &:hover {
    background-color: ${Colors.BLACK03};
  }
`;
