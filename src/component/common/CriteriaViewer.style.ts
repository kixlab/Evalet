import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Header = styled.div`
  width: 100%;
  padding: 12px;
  background-color: ${Colors.GRAY_LIGHT};
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;

  h3.title {
    font-size: 13px;
    font-weight: ${TextStyle.BOLD};
  }
`;

export const Item = styled.div`
  width: 100%;
  padding: 12px;
  font-size: 11px;
  background-color: ${Colors.GRAY_LIGHT};
  border-radius: 8px;
`;
