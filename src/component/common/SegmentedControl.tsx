import * as S from './SegmentedControl.style';

export interface SegmentedType {
  id: string | number;
  label: string;
}

interface Props {
  data: SegmentedType[];
  selectedId: string | number | null;
  onChange: (id: string | number) => void;
}

const SegmentedControl = ({ data, selectedId, onChange }: Props) => {
  return (
    <S.Container>
      {data.map((d) => {
        return (
          <S.Item key={d.id} className={d.id === selectedId ? 'selected' : ''} onClick={() => onChange(d.id)}>
            {d.label}
          </S.Item>
        );
      })}
    </S.Container>
  );
};

export default SegmentedControl;
