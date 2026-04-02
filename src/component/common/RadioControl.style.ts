import styled from 'styled-components';
import { Colors } from '../../style/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
  align-items: center;
  cursor: pointer;
`;

export const RadioContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
  background-color: ${Colors.WHITE};
  border: 1px solid ${Colors.POINT_BLUE};

  .circle {
    width: 60%;
    height: 60%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${Colors.POINT_BLUE};
    border-radius: 50%;
  }
`;

export const Label = styled.label`
  font-size: 12px;
`;
