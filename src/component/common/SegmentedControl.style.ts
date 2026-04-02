import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: fit-content;
  height: fit-content;
  background-color: ${Colors.GRAY_LIGHT};
  padding: 2px;
  gap: 4px;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
`;

export const Item = styled.div`
  width: fit-content;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    font-weight: ${TextStyle.BOLD};
  }

  &.selected {
    font-weight: ${TextStyle.BOLD};
    background-color: ${Colors.WHITE};
    border-radius: 4px;
  }
`;
