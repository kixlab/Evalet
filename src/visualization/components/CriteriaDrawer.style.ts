import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const DrawerContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 180px;
  height: 100%;
  background-color: ${Colors.WHITE};
  z-index: 200;

  transform: translateX(-100%);
  transition: transform 0.3s ease;

  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 4px;

  &.open {
    transform: translateX(0);
    box-shadow: 2px 0 5px ${Colors.BLACK08};
  }

  .title {
    font-size: 14px;
    font-weight: ${TextStyle.MEDIUM};
    margin-bottom: 8px;
  }
`;

// 배경(Backdrop)
export const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${Colors.BLACK03};
  z-index: 150;
`;

export const CriterionItem = styled.div`
  width: 100%;
  padding: 8px;
  font-size: 12px;
  font-weight: ${TextStyle.REGULAR};
  color: ${Colors.BLACK80};
  border-radius: 4px;
  cursor: pointer;

  transition: 0.2s background-color ease;

  &.selected {
    font-weight: ${TextStyle.MEDIUM};
    background-color: ${Colors.POINT_BLUE_TRANSPARENT_20};
    color: ${Colors.POINT_BLUE};

    &:hover {
      background-color: ${Colors.POINT_BLUE_TRANSPARENT_20};
    }
  }

  &:hover {
    background-color: ${Colors.BLACK08};
  }
`;
