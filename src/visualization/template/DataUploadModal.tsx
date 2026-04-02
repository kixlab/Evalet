import styled from 'styled-components';
import { Colors } from '../../style/colors';
import { TextStyle } from '../../style/textStyle';
import { ReactComponent as Upload } from '../../assets/icon/ic_upload.svg';
import { useRef, useState } from 'react';
import { v4 } from 'uuid';
import { PairData } from '../model/PairData';
import NormalButton, { SecondaryButton } from '../../component/common/NormalButton';
import { useDatabaseContext } from '../store/databaseStore';
import useBoardContext from '../store/boardStore';

export const OverlayContainer = styled.div`
  width: 560px;
  height: fit-content;
  padding: 32px;
  background-color: ${Colors.WHITE};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  h1.title {
    font-size: 16px;
    font-weight: ${TextStyle.BOLD};
    margin-bottom: 8px;
  }

  .buttons {
    width: fit-content;
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
`;

export const InputWrapper = styled.div`
  width: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${Colors.POINT_BLUE_TRANSPARENT_20};
  border: 1px dashed ${Colors.POINT_BLUE};
  cursor: pointer;
  font-size: 14px;
  font-weight: ${TextStyle.MEDIUM};
  color: ${Colors.POINT_BLUE};
`;

export const JSONInput = styled.input`
  all: unset;
  display: none;
`;

export const InfoArea = styled.div`
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  background-color: ${Colors.POINT_BLUE_TRANSPARENT_20};
  gap: 8px;

  .row {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .title {
      font-size: 12px;
      font-weight: ${TextStyle.LIGHT};
      color: ${Colors.BLACK60};
    }

    .label {
      font-size: 14px;
      font-weight: ${TextStyle.MEDIUM};
    }
  }
`;

interface Props {
  close: () => void;
  onComplete: () => void;
}

const DataUploadModal = ({ close, onComplete }: Props) => {
  const [inputs, setInputs] = useState<PairData[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { updateDatabase } = useDatabaseContext();
  const { setCriteriaTabTooltipOn } = useBoardContext();

  const handleComplete = () => {
    updateDatabase(inputs);
    setCriteriaTabTooltipOn(true);
    onComplete();
  };

  const validateJSON = (json: any): boolean => {
    // if ('input' in json && Array.isArray(json.input)) {
    //   if ('output' in json) {
    //     if (Array.isArray(json.output) && json.input.length === json.output.length) {
    //       return true;
    //     } else {
    //       window.alert('Invalid JSON format or check whether the number of inputs and outputs are same');
    //       return false;
    //     }
    //   }
    //   return true;
    // }
    // window.alert('Invalid JSON format');
    // return false;
    return true;
  };

  const processData = (data: any) => {
    const processed = data.map((d: any) => {
      return {
        id: v4(),
        query: d.query,
        response: d.response,
      };
    });
    setInputs(processed);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target) {
          try {
            const json = JSON.parse(event.target.result as string);
            if (validateJSON(json)) {
              const inputs = json;
              const filename = file.name;
              processData(inputs);
              setFileName(filename);
            }
          } catch (err) {
            window.alert('The file could not be parsed as JSON');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <OverlayContainer>
      <h1 className="title">Upload Dataset</h1>
      <InputWrapper onClick={() => inputRef.current?.click()}>
        <Upload width={16} height={16} stroke={Colors.POINT_BLUE} />
        Click to upload your JSON
        <JSONInput ref={inputRef} type="file" accept=".json" onChange={handleFileChange} />
      </InputWrapper>
      {fileName !== '' && inputs.length > 0 && (
        <InfoArea>
          <div className="row">
            <h3 className="title">File</h3>
            <p className="label">{fileName}</p>
          </div>
          <div className="row">
            <h3 className="title">Inputs</h3>
            <p className="label">{inputs.length}</p>
          </div>
        </InfoArea>
      )}
      <div className="buttons">
        <SecondaryButton onClick={close}>Cancel</SecondaryButton>
        <NormalButton inactive={inputs.length === 0} onClick={handleComplete}>
          Confirm
        </NormalButton>
      </div>
    </OverlayContainer>
  );
};

export default DataUploadModal;
