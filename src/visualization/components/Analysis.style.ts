import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  background-color: ${Colors.POINT_YELLOW_TRANSPARENT};
  border-radius: 8px;
  padding: 16px;
  gap: 8px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h3`
  font-size: 14px;
  font-weight: ${TextStyle.SEMI_BOLD};
  color: ${Colors.BLACK80};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .title {
    font-size: 11px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK60};
  }

  .item {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }
`;
