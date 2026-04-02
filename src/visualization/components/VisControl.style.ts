import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 180px;
  padding: 16px;
  border-radius: 8px;
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 4px ${Colors.BLACK20});
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 100;
  position: absolute;
  top: 16px;
  right: 16px;

  .title {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
    margin-bottom: 4px;
  }
`;

export const Button = styled.button`
  all: unset;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  cursor: pointer;
  background-color: ${Colors.WHITE};
  color: ${Colors.BLACK60};
  font-size: 12px;
  font-weight: ${TextStyle.MEDIUM};
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0);

  &:not(.selected):hover {
    background-color: ${Colors.BLACK03};
  }

  &.selected {
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_20};
    color: ${Colors.POINT_BLUE};
    border: 1px solid ${Colors.POINT_BLUE_TRANSPARENT_60};
  }
`;

export const ToggleRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .row-label {
    font-size: 11px;
    font-weight: ${TextStyle.REGULAR};
    color: ${Colors.BLACK80};
    margin-right: auto;
  }
`;
