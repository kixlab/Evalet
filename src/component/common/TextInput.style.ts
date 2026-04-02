import styled from 'styled-components';
import { Colors } from '../../style/colors';

export const OnelineTextInput = styled.input`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  background-color: ${Colors.GRAY_LIGHT};
  padding: 8px;
  border: 1px solid ${Colors.BLACK12};
  border-radius: 8px;
  font-size: 12px;

  &:hover {
    border: 1px solid ${Colors.BLACK40};
  }

  &:focus {
    border: 1px solid ${Colors.BLACK};
  }

  &.inactive {
    color: ${Colors.BLACK60};
    cursor: default;

    &:hover {
      border: 1px solid ${Colors.BLACK12};
    }

    &:focus {
      border: 1px solid ${Colors.BLACK12};
    }
  }
`;

export const ResizableTextArea = styled.textarea`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  background-color: ${Colors.GRAY_LIGHT};
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${Colors.BLACK12};
  font-size: 12px;
  line-height: 16px;
  white-space: pre-line;
  color: ${Colors.BLACK};

  height: auto;

  &.fixed {
    height: 100%;
  }

  &:hover {
    border: 1px solid ${Colors.BLACK40};
  }

  &:focus {
    border: 1px solid ${Colors.BLACK};
  }
`;
