import styled from 'styled-components';
import { TextStyle } from '../../style/textStyle';
import { Colors } from '../../style/colors';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

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

export const Empty = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  padding: 64px;

  font-size: 12px;
  color: ${Colors.BLACK60};
`;
