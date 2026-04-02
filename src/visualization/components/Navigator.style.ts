import styled from 'styled-components';
import { TextStyle } from '../../style/textStyle';
import { Colors } from '../../style/colors';

export const Container = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CurrentStack = styled.div`
  font-size: 18px;
  font-weight: ${TextStyle.SEMI_BOLD};
  color: ${Colors.BLACK80};
`;

export const CurrentExplanation = styled.div`
  font-size: 12px;
  font-weight: ${TextStyle.REGULAR};
  line-height: 1.3;
  color: ${Colors.BLACK80};
`;

export const PreviousButton = styled.div`
  font-size: 14px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.BLACK60};
  cursor: pointer;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;

  &:hover {
    color: ${Colors.BLACK80};

    svg {
      stroke: ${Colors.BLACK80};
    }
  }

  svg {
    stroke: ${Colors.BLACK60};
  }
`;
