import styled from 'styled-components';
import { Colors } from '../../style/colors';

export const ToggleContainer = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  cursor: pointer;

  > .toggle-container {
    width: 36px;
    height: 20px;
    border-radius: 30px;
    background-color: ${Colors.GRAY_MEDIUM};
  }
  //.toggle-checked 클래스가 활성화 되었을 경우의 CSS를 구현
  > .toggle-checked {
    background-color: ${Colors.POINT_BLUE};
    transition: 0.25s ease;
  }

  > .toggle-circle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${Colors.WHITE};
    transition: 0.25s ease;
    //.toggle--checked 클래스가 활성화 되었을 경우의 CSS를 구현
  }
  > .toggle-checked {
    left: 50%;
    transition: 0.25s ease;
  }
`;
