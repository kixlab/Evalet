import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 4px ${Colors.BLACK20});
  gap: 16px;
  border-radius: 8px;
  transition: filter 0.3s ease;

  &:hover {
    filter: drop-shadow(0 0 4px ${Colors.BLACK40});
  }
`;

export const TextContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .name {
    font-size: 13px;
    font-weight: ${TextStyle.BOLD};
  }

  .pos-label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_GREEN};
  }

  .desc {
    font-size: 12px;
    font-weight: ${TextStyle.REGULAR};
    line-height: 1.5;
  }

  .neg-label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.POINT_RED};
  }

  .exclude-label {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.NAVY};
  }
`;

export const FewshotRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;

  .desc {
    font-size: 12px;
    font-weight: ${TextStyle.REGULAR};
    line-height: 1.5;
  }

  .button {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

export const ButtonContainer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  width: fit-content;
  height: fit-content;

  .button {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;
