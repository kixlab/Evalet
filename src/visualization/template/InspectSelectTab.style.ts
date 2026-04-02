import styled from 'styled-components';
import { TextStyle } from '../../style/textStyle';
import { Colors } from '../../style/colors';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionTitle = styled.h1`
  font-size: 14px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.BLACK80};
`;

export const PinContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: ${Colors.GRAY_LIGHT};
  gap: 8px;

  .avg-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 12px;
      font-weight: ${TextStyle.MEDIUM};
      color: ${Colors.BLACK60};
    }

    .avg {
      font-size: 12px;
      font-weight: ${TextStyle.MEDIUM};
      color: ${Colors.BLACK80};
    }
  }
`;

export const PinClusterRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.BLACK80};

  .button {
    padding: 2px;
    cursor: pointer;
  }
`;

export const ComboSuggestSectionTitle = styled.div`
  font-size: 12px;
  font-weight: ${TextStyle.REGULAR};
  color: ${Colors.BLACK80};
`;

export const ComboSuggestRow = styled.div`
  display: grid;
  width: 100%;
  gap: 8px;

  grid-template-columns: repeat(3, 1fr);
`;

export const ComboSuggestContainer = styled.div`
  width: 100%;
  border-radius: 8px;
  height: 64px;
  background-color: ${Colors.POINT_YELLOW_TRANSPARENT};
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 4px;
  cursor: pointer;
  border: 1px solid ${Colors.POINT_YELLOW};

  .title {
    font-size: 11px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK80};
  }

  .avg {
    font-size: 11px;
    font-weight: ${TextStyle.REGULAR};
    color: ${Colors.BLACK60};
  }
`;
