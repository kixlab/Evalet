import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const OuterContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const Container = styled.div`
  flex-grow: 1;
  min-width: 0;
  height: fit-content;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 4px ${Colors.BLACK20});
  gap: 8px;
  border-radius: 8px;
  transition: filter 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 4px ${Colors.BLACK40});
  }

  &.selected {
    filter: drop-shadow(0 0 4px ${Colors.POINT_BLUE});

    &:hover {
      filter: drop-shadow(0 0 4px ${Colors.POINT_BLUE});
    }
  }
`;

export const TypeLabel = styled.div`
  font-size: 12px;
  font-weight: ${TextStyle.BOLD};
  color: ${Colors.BLACK60};
`;

export const ClusterName = styled.div`
  font-size: 13px;
  font-weight: ${TextStyle.BOLD};
  color: ${Colors.BLACK80};
`;

export const Description = styled.div`
  font-size: 12px;
  color: ${Colors.BLACK80};
  line-height: 1.25;
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

export const EvalDetailButton = styled.div`
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid ${Colors.POINT_BLUE};
  background-color: ${Colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: ${Colors.POINT_BLUE};
  cursor: pointer;

  &:hover {
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_8};
  }
`;
