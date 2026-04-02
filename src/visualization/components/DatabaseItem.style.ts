import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

export const Container = styled.div`
  width: 100%;
  height: fit-content;
  padding: 16px;
  background-color: ${Colors.WHITE};
  filter: drop-shadow(0 0 4px ${Colors.BLACK20});
  display: flex;
  flex-direction: row;
  gap: 4px;
  border-radius: 8px;

  .divider {
    width: 1px;
    height: 100%;
    background-color: ${Colors.BLACK12};
    flex-shrink: 0;
  }
`;

export const Column = styled.div`
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .title {
    font-size: 11px;
    font-weight: ${TextStyle.SEMI_BOLD};
    color: ${Colors.BLACK80};
  }

  p.content {
    font-size: 11px;
    font-weight: ${TextStyle.REGULAR};
    color: ${Colors.BLACK80};
    white-space: pre-wrap;
    line-height: 1.3;
  }
`;

export const AccordionContainer = styled.div`
  width: 100%;
  border-bottom: 1px solid ${Colors.BLACK12};
  display: flex;
  flex-direction: column;
  gap: 0;

  .item-container {
    width: 100%;
    height: fit-content;
    padding: 4px;
    background-color: ${Colors.BLACK03};
    display: flex;
    flex-direction: column;
    gap: 0;
  }
`;

export const AccordionHeader = styled.div`
  width: 100%;
  padding: 8px;
  gap: 4px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${Colors.WHITE};
  cursor: pointer;

  .name {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
  }

  .point {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    margin-left: auto;
  }

  .icon {
    width: fit-content;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background-color: ${Colors.BLACK03};
  }

  &.baseline {
    cursor: auto;
  }
`;

export const AccordionItem = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: row;
  padding: 4px;
  gap: 4px;
  align-items: center;

  .feature {
    flex-grow: 1;
    min-width: 0;
    font-size: 11px;
    font-weight: ${TextStyle.REGULAR};
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
    padding: 2px 0;

    cursor: pointer;

    &.unselected {
      opacity: 0.4;
    }
  }
`;

export const PosNegTag = styled.div`
  width: fit-content;
  height: fit-content;
  padding: 2px 4px;
  border-radius: 4px;
  color: ${Colors.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;

  &.positive {
    background-color: ${Colors.POINT_GREEN};
  }

  &.negative {
    background-color: ${Colors.POINT_RED};
  }

  &.unselected {
    opacity: 0.4;
  }
`;

export const EvaluationButton = styled.div`
  font-size: 11px;
  font-weight: ${TextStyle.REGULAR};
  color: ${Colors.BLACK40};

  &.ready {
    font-size: 12px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK60};
    cursor: pointer;
    text-decoration: underline;
  }

  &:hover {
    color: ${Colors.BLACK80};
  }
`;
