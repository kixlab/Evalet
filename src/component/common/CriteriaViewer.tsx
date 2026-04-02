import { Criteria } from '../../model/Criteria';
import ColorBlock from './ColorBlock';
import * as S from './CriteriaViewer.style';

interface Props {
  criteria: Criteria;
}

const CriteriaViewer = ({ criteria }: Props) => {
  return (
    <S.Container>
      <S.Header>
        <ColorBlock color={criteria.color} />
        <h3 className="title">{criteria.title}</h3>
      </S.Header>
      {criteria.rubrics.map((c) => {
        return <S.Item key={`${c.point}-${c.rubric}`}>{`${c.point}: ${c.rubric}`}</S.Item>;
      })}
    </S.Container>
  );
};

export default CriteriaViewer;
