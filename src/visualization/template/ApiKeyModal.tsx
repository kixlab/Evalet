import { useState } from 'react';
import styled from 'styled-components';
import NormalButton, { SecondaryButton } from '../../component/common/NormalButton';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';

const Container = styled.div`
  width: 560px;
  padding: 28px 32px;
  border-radius: 16px;
  background-color: ${Colors.WHITE};
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    font-size: 18px;
    font-weight: ${TextStyle.BOLD};
    color: ${Colors.BLACK60};
  }

  .desc {
    font-size: 14px;
    color: ${Colors.BLACK60};
    line-height: 1.5;
  }

  .hint {
    font-size: 12px;
    color: ${Colors.BLACK40};
  }

  .buttons {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
`;

const Input = styled.input`
  all: unset;
  border: 1px solid ${Colors.BLACK12};
  border-radius: 8px;
  font-size: 14px;
  color: ${Colors.BLACK60};
  padding: 10px 12px;
`;

interface Props {
  close: () => void;
  initialApiKey: string;
  onSubmit: (apiKey: string) => void;
}

const ApiKeyModal = ({ close, initialApiKey, onSubmit }: Props) => {
  const [apiKey, setApiKey] = useState(initialApiKey);

  const handleSubmit = () => {
    const trimmed = apiKey.trim();
    if (trimmed === '') {
      window.alert('Please enter your OpenAI API key.');
      return;
    }
    onSubmit(trimmed);
    close();
  };

  return (
    <Container>
      <h2 className="title">Set OpenAI API Key</h2>
      <p className="desc">
        Enter your key here if it is not set in `.env` or if you want to update it.
        <br />
        The key is kept in memory only and cleared when you refresh or close the tab.
      </p>
      <Input
        type="password"
        value={apiKey}
        placeholder="sk-..."
        onChange={(e) => setApiKey(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSubmit();
          }
        }}
      />
      <p className="hint">It is not written to disk or browser storage.</p>
      <div className="buttons">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <NormalButton onClick={handleSubmit}>Save</NormalButton>
      </div>
    </Container>
  );
};

export default ApiKeyModal;
