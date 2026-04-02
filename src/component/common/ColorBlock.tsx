import styled from 'styled-components';

const Container = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  background-color: ${(props) => props.color};
  border-radius: 4px;
  flex-shrink: 0;
`;

interface Props {
  color: string;
}

const ColorBlock = ({ color }: Props) => {
  return <Container color={color} />;
};

export default ColorBlock;
