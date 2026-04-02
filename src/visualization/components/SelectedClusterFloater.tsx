import { Cluster } from '../model/Clusters';
import * as S from './SelectedClusterFloater.style';
import { ReactComponent as XIcon } from '../../assets/icon/ic_x.svg';
import { Colors } from '../../style/colors';
import { useClusterContext } from '../store/clusterStore';
import useBoardContext from '../store/boardStore';

interface Props {
  clusterId: string;
}

const SelectedClusterFloater = ({ clusterId }: Props) => {
  const { findClusterById } = useClusterContext();
  const { setSelectedClusterId } = useBoardContext();
  const cluster = findClusterById(clusterId);
  return (
    <S.Container>
      <div className="desc-label">Selected</div>
      <div className="cluster-name">{cluster?.name ?? ''}</div>
      <div className="button" onClick={() => setSelectedClusterId(null)}>
        <XIcon width={10} height={10} stroke={Colors.BLACK80} />
      </div>
    </S.Container>
  );
};

export default SelectedClusterFloater;
