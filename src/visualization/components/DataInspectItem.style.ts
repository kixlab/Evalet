import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const BehaviorRow = styled.div`
  width: 100%;
  height: fit-content;
  display: grid;
  grid-template-columns: 7fr 3fr;

  &.pinned {
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_20};
  }
`;

export const BehaviorCell = styled.div`
  width: 100%;
  font-size: 11px;
  color: ${Colors.BLACK80};
  padding: 8px;
  line-height: 1.3;
`;

export const InlinePosNegTag = styled.span`
  display: inline-block;
  padding: 2px 4px;
  margin-right: 2px;
  font-size: 11px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.WHITE};
  border-radius: 4px;

  &.positive {
    background-color: ${Colors.POINT_GREEN};
  }

  &.negative {
    background-color: ${Colors.POINT_RED};
  }
`;

export const ClusterCell = styled.div`
  width: 100%;
  padding: 8px;
  font-size: 11px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.BLACK80};
  line-height: 1.3;
`;

export const InlinePinIconButton = styled.span`
  display: inline-block;
  padding: 4px;
  cursor: pointer;
`;

export const InfoRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: ${Colors.GRAY_LIGHT};
  padding: 8px;
  border-bottom: 1px solid ${Colors.BLACK08};
`;

export const ScoreBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  font-size: 11px;
  font-weight: ${TextStyle.REGULAR};
  margin-right: auto;

  .numeric {
    font-size: 12px;
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.POINT_BLUE};
  }
`;

export const CheckDetailButton = styled.div`
  padding: 2px 4px;
  font-size: 12px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.POINT_BLUE};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
