import styled from 'styled-components';
import { Colors } from '../../style/colors';

export const Container = styled.div<{ color: string }>`
  width: fit-content;
  padding: 8px 12px;
  border-radius: 16px;
  background-color: ${Colors.WHITE};
  cursor: pointer;

  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0);

  &.disabled {
    background-color: ${Colors.BLACK08};
    cursor: default;
  }

  &.selected {
    border: 1px solid ${(props) => props.color};
  }
`;
