import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: fit-content;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.BLACK08};
`;

export const Feature = styled.div`
  max-width: 200px;
  font-size: 12px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.BLACK80};
  line-height: 1.3;
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
