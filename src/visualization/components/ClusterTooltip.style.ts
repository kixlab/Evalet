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

export const InfoRow = styled.div`
  width: 120px;
  max-width: 120px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .pos {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_GREEN};
  }

  .neg {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_RED};
  }

  .count {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }
`;
