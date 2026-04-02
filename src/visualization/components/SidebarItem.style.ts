import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_8};
  }

  &.selected {
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_8};
  }

  &.inactive {
    cursor: not-allowed;
  }
`;

export const Title = styled.div`
  font-size: 11px;
  font-weight: ${TextStyle.REGULAR};
  color: ${Colors.BLACK80};

  &.selected {
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.POINT_BLUE};
  }

  &.inactive {
    color: ${Colors.BLACK40};
  }
`;
