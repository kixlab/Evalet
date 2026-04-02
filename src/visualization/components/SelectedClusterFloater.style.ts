import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;

  border-radius: 16px;
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 2px ${Colors.BLACK20});

  padding: 8px;

  .desc-label {
    font-size: 11px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK60};
  }

  .cluster-name {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }

  .button {
    padding: 2px;
    cursor: pointer;
    margin-left: 8px;
  }
`;
