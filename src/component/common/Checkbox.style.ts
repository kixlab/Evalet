import styled from 'styled-components';
import { Colors } from '../../style/colors';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  cursor: pointer;
  border: 1px solid ${Colors.BLACK12};

  transition: 0.25s;

  &:hover {
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_60};
  }

  &.selected {
    background-color: ${Colors.POINT_BLUE};
    border: 1px solid ${Colors.POINT_BLUE};
  }
`;
