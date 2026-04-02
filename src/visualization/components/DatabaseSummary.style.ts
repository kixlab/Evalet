import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const PinContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 8px;
  background-color: ${Colors.GRAY_LIGHT};
  gap: 12px;

  .container-title {
    font-size: 14px;
    color: ${Colors.BLACK80};
    font-weight: ${TextStyle.MEDIUM};
  }

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

    .right-container {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;
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

  .ratio-container {
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    margin-left: auto;

    .sub-title {
      font-size: 11px;
      color: ${Colors.BLACK60};
    }

    .ratio {
      font-size: 12px;
      font-weight: ${TextStyle.MEDIUM};
      color: ${Colors.BLACK80};
    }
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
  height: fit-content;
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

  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 11px;
      font-weight: ${TextStyle.REGULAR};
      color: ${Colors.BLACK60};
    }

    .value {
      font-size: 11px;
      font-weight: ${TextStyle.REGULAR};
      color: ${Colors.BLACK80};
    }
  }
`;
