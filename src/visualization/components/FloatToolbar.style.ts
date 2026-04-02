import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  position: absolute;
  left: 12px;
  bottom: 16px;
  width: calc(100% - 24px);
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 4px ${Colors.BLACK20});
  display: flex;
  flex-direction: row;
  padding: 8px 12px;
  border-radius: 4px;
  align-items: center;
`;

export const SelectedNum = styled.div`
  font-size: 13px;
  font-weight: ${TextStyle.MEDIUM};

  .num {
    color: ${Colors.POINT_BLUE};
  }
`;

export const Buttons = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
  gap: 4px;

  .note {
    font-size: 11px;
    font-weight: ${TextStyle.MEDIUM};
  }
`;
