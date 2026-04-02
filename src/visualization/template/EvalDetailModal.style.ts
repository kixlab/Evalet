import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: ${Colors.WHITE};
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 500;

  .header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h1.title {
    font-size: 16px;
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.BLACK80};
    flex-shrink: 0;
  }
`;

export const XButton = styled.div`
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const CriteriaRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;

  .label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    flex-shrink: 0;
  }

  .scroll {
    flex-grow: 1;
    min-width: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
  }
`;

export const CriteriaChip = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 4px 8px;
  border-radius: 50vh;
  border: 1px solid ${Colors.BLACK20};
  cursor: pointer;
  font-size: 12px;
  font-weight: ${TextStyle.REGULAR};
  color: ${Colors.BLACK80};
  display: flex;
  align-items: center;
  justify-content: center;

  &.selected {
    border: 1px solid ${Colors.BLACK80};
  }
`;

export const TripleColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  min-height: 0;
  gap: 8px;

  .column {
    flex-grow: 1;
    flex-basis: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .sub-title {
      font-size: 12px;
      font-weight: ${TextStyle.MEDIUM};
    }

    .header {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
`;

export const ExpandCollapseButton = styled.div`
  font-size: 12px;
  font-weight: ${TextStyle.MEDIUM};
  cursor: pointer;
  color: ${Colors.BLACK60};

  &:hover {
    color: ${Colors.BLACK80};
  }
`;

export const QueryResponseContainer = styled.div`
  width: 100%;
  background-color: ${Colors.GRAY_LIGHT};
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 4px;
  overflow-y: auto;
  padding: 8px;
  white-space: pre-wrap;
`;

export const OverallEvalContainer = styled.div`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  gap: 8px;
  border: 1px solid ${Colors.POINT_BLUE};
  background-color: ${Colors.WHITE};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  .label {
    font-size: 11px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }

  .score {
    font-size: 12px;
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.BLACK80};
  }

  .desc {
    font-size: 12px;
    font-weight: ${TextStyle.REGULAR};
    color: ${Colors.BLACK80};
    line-height: 1.3;
  }
`;

export const BehaviorPlaceholder = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: ${Colors.BLACK60};
`;

export const BehaviorDetailContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  gap: 8px;

  .feature {
    font-size: 13px;
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.BLACK80};
  }

  .behavior {
    font-size: 12px;
    line-height: 1.3;
    color: ${Colors.BLACK80};
  }

  .sub-label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }
`;

export const PosNegTag = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 2px 4px;
  border-radius: 4px;
  color: ${Colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  &.positive {
    background-color: ${Colors.POINT_GREEN};
  }

  &.negative {
    background-color: ${Colors.POINT_RED};
  }
`;

export const SelectionBarContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  .label {
    font-size: 13px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }

  .buttons {
    display: flex;
    flex-direction: row;
    gap: 4px;
    margin-left: auto;
  }
`;
