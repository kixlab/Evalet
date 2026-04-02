import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 16px;
  display: flex;
  flex-direction: column;
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 4px ${Colors.BLACK20});
  gap: 8px;
  border-radius: 8px;
  transition: filter 0.3s ease;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 4px ${Colors.BLACK40});
  }
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const PinButton = styled.div`
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${Colors.BLACK08};
  }
`;

export const TypeLabel = styled.div`
  font-size: 12px;
  font-weight: ${TextStyle.BOLD};
  color: ${Colors.BLACK60};
`;

export const ClusterName = styled.div`
  font-size: 13px;
  font-weight: ${TextStyle.BOLD};
  color: ${Colors.BLACK80};
`;

export const Description = styled.div`
  font-size: 12px;
  color: ${Colors.BLACK80};
  line-height: 1.3;
`;

export const InfoRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  .pos-label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_GREEN};
  }

  .neg-label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_RED};
  }

  .count {
    font-size: 12px;
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.BLACK80};
  }
`;
