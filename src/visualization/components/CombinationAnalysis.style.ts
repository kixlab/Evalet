import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: ${Colors.POINT_YELLOW_TRANSPARENT};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.div`
  font-size: 13px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.BLACK80};
`;

export const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .title {
    font-size: 11px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK60};
  }

  .score-container {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
    margin-left: auto;
  }
`;
