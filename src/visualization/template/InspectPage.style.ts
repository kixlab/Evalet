import styled from 'styled-components';
import { TextStyle } from '../../style/textStyle';
import { Colors } from '../../style/colors';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 24px;
  margin-top: -12px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px;
  border-bottom: 1px solid ${Colors.BLACK08};

  background-color: ${Colors.WHITE};

  .sub-label {
    font-size: 16px;
    color: ${Colors.BLACK80};
  }

  .tab-container {
    display: flex;
    flex-direction: row;
    margin-left: auto;
    align-items: center;
    gap: 8px;
  }
`;

export const CriteriaSetButton = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 20px;
  font-weight: ${TextStyle.SEMI_BOLD};
  color: ${Colors.BLACK80};
  cursor: pointer;
  border-radius: 8px;
  padding: 4px;
  background-color: ${Colors.WHITE};
  transition: 0.25s background-color ease;

  &:hover {
    color: ${Colors.BLACK};
    background-color: ${Colors.BLACK03};

    .svg {
      stroke: ${Colors.BLACK};
    }
  }
`;

export const TabButton = styled.div`
  font-size: 16px;
  font-weight: ${TextStyle.SEMI_BOLD};
  color: ${Colors.BLACK20};
  cursor: pointer;

  &.selected {
    color: ${Colors.BLACK80};
  }

  &:hover {
    color: ${Colors.BLACK80};
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .text-container {
    flex-grow: 1;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      font-size: 20px;
      font-weight: ${TextStyle.SEMI_BOLD};
      color: ${Colors.BLACK80};
    }

    .desc {
      font-size: 14px;
      font-weight: ${TextStyle.REGULAR};
      color: ${Colors.BLACK60};
    }
  }

  .button-container {
    flex-shrink: 0;
  }
`;

export const SubTitle = styled.div`
  font-size: 16px;
  font-weight: ${TextStyle.SEMI_BOLD};
  color: ${Colors.BLACK80};
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;

  .label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
  }
`;

export const PosNegFilterTag = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 2px 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;

  &.positive {
    background-color: ${Colors.POINT_GREEN_TRANSPARENT};
    border: 1px solid ${Colors.POINT_GREEN};
    color: ${Colors.POINT_GREEN};

    &.selected {
      background-color: ${Colors.POINT_GREEN};
      color: ${Colors.WHITE};
    }
  }

  &.negative {
    background-color: ${Colors.POINT_RED_TRANSPARENT};
    border: 1px solid ${Colors.POINT_RED};
    color: ${Colors.POINT_RED};

    &.selected {
      background-color: ${Colors.POINT_RED};
      color: ${Colors.WHITE};
    }
  }
`;

export const BehaviorListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: -16px;
`;

export const BehaviorListHeader = styled.div`
  width: 100%;
  padding: 16px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0);

  .title {
    font-size: 14px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }

  &.close {
    svg {
      transform: rotate(-90deg);
    }

    border-bottom: 1px solid ${Colors.BLACK20};
  }
`;
