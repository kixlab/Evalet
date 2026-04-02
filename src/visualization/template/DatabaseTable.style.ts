import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 36px;
  background-color: ${Colors.TABLE_BACKGROUND};
`;

export const HeaderCell = styled.div<{ fixedWidth?: string }>`
  font-size: 12px;
  font-weight: ${TextStyle.MEDIUM};
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;

  &.fill {
    flex-grow: 1;
    min-width: 0;
    flex-basis: 0;
  }

  &.fixed {
    width: ${(props) => props.fixedWidth ?? '92px'};
    flex-shrink: 0;
  }

  &.center {
    justify-content: center;
  }

  &.right {
    justify-content: flex-end;
  }
`;

export const DataContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const DataRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 240px;

  &:hover {
    background-color: ${Colors.TABLE_BACKGROUND};
  }

  &:nth-child(even) {
    background-color: ${Colors.TABLE_BACKGROUND};
  }
`;

export const DataCell = styled.div<{ fixedWidth?: string }>`
  height: 100%;
  overflow-y: auto;
  font-size: 11px;
  font-weight: ${TextStyle.REGULAR};
  padding: 8px 16px;
  display: flex;
  flex-direction: row;
  line-height: 1.5;
  white-space: pre-wrap;

  &.fill {
    flex-grow: 1;
    min-width: 0;
    flex-basis: 0;
  }

  &.fixed {
    width: ${(props) => props.fixedWidth ?? '92px'};
    flex-shrink: 0;
  }

  &.center {
    justify-content: center;
  }

  &.right {
    justify-content: flex-end;
  }
`;

export const EvaluationCell = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 11px;
      font-weight: ${TextStyle.MEDIUM};
    }

    .score {
      font-size: 12px;
      font-weight: ${TextStyle.SEMI_BOLD};
    }
  }
`;

export const EvaluationButton = styled.div`
  font-size: 11px;
  font-weight: ${TextStyle.REGULAR};
  color: ${Colors.POINT_BLUE_TRANSPARENT_20};

  &.ready {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_BLUE_TRANSPARENT_60};
    cursor: pointer;
    text-decoration: underline;
  }

  &:hover {
    color: ${Colors.POINT_BLUE};
  }
`;
