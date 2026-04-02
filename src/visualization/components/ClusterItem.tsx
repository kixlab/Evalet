import { BaseCluster, Cluster, HigherCluster, isBaseCluster, isHigherCluster } from '../model/Clusters';
import { useBehaviorContext } from '../store/behaviorStore';
import useBoardContext from '../store/boardStore';
import { useClusterContext } from '../store/clusterStore';
import * as S from './ClusterItem.style';
import { ReactComponent as PinIcon } from '../../assets/icon/ic_pin.svg';
import { Colors } from '../../style/colors';
import { useTracking } from 'react-tracking';

interface Props {
  cluster: HigherCluster;
}

const HigherClusterItem = ({ cluster }: Props) => {
  const { findClusterById } = useClusterContext();
  const { pushNavigationTree, pinCluster, unPinCluster, pinnedClusterIds, setHoveringCluster, setSelectedClusterId } = useBoardContext();
  const { findBehaviorById } = useBehaviorContext();
  const subClusters = cluster.subClusterIds.map((id) => findClusterById(id));

  const { trackEvent } = useTracking();

  /**
   * 재귀적으로 클러스터의 자식(하위) cluster를 순회하면서
   * behavior들의 isPositive = true/false 개수를 모두 세어 리턴
   */
  function countBehaviorsForCluster(clusterId: string): { positiveCount: number; negativeCount: number } {
    const cluster = findClusterById(clusterId);
    if (!cluster) {
      return { positiveCount: 0, negativeCount: 0 };
    }
    if (isBaseCluster(cluster)) {
      let positiveCount = 0;
      let negativeCount = 0;

      for (const behaviorId of cluster.behaviorIds) {
        const behavior = findBehaviorById(behaviorId);
        if (!behavior) continue;
        if (behavior.isPositive) {
          positiveCount++;
        } else {
          negativeCount++;
        }
      }

      return { positiveCount, negativeCount };
    } else if (isHigherCluster(cluster)) {
      let totalPositive = 0;
      let totalNegative = 0;

      for (const subClusterId of cluster.subClusterIds) {
        const { positiveCount, negativeCount } = countBehaviorsForCluster(subClusterId);
        totalPositive += positiveCount;
        totalNegative += negativeCount;
      }

      return {
        positiveCount: totalPositive,
        negativeCount: totalNegative,
      };
    } else {
      return {
        positiveCount: 0,
        negativeCount: 0,
      };
    }
  }
  return (
    <S.Container
      onClick={() => {
        pushNavigationTree([cluster.id]);
        setSelectedClusterId(cluster.id);
        trackEvent({ section: 'Viz', component: 'ClusterItem', action: 'selectCluster', value: 'Higher' });
      }}
      onMouseOver={() => setHoveringCluster(cluster.id)}
      onMouseLeave={() => setHoveringCluster(null)}
    >
      <S.Header>
        <S.TypeLabel>Super Cluster</S.TypeLabel>
        {/* <S.PinButton
          onClick={(e) => {
            if (pinnedClusterIds.includes(cluster.id)) {
              trackEvent({ section: 'Viz', component: 'ClusterItem', action: 'unpinCluster', value: 'Higher' });
              unPinCluster(cluster.id);
            } else {
              trackEvent({ section: 'Viz', component: 'ClusterItem', action: 'pinCluster', value: 'Higher' });
              pinCluster(cluster.id);
            }
            e.stopPropagation();
          }}
        >
          <PinIcon width={16} height={16} fill={pinnedClusterIds.includes(cluster.id) ? Colors.POINT_BLUE : Colors.BLACK60} />
        </S.PinButton> */}
      </S.Header>
      <S.ClusterName>{cluster.name}</S.ClusterName>
      <S.Description>{cluster.description}</S.Description>
      <S.TypeLabel>Clusters</S.TypeLabel>
      {subClusters.map((sc) => (
        <S.Description key={`sub-cluster-${cluster.id}-${sc?.id}`}>{sc?.name ?? ''}</S.Description>
      ))}
      <S.InfoRow>
        <p className="pos-label">Positive</p>
        <p className="count">{cluster.positiveCount}</p>
        <p className="neg-label">Negative</p>
        <p className="count">{cluster.negativeCount}</p>
      </S.InfoRow>
    </S.Container>
  );
};

interface BaseProps {
  cluster: BaseCluster;
}

export const BaseClusterItem = ({ cluster }: BaseProps) => {
  const { findBehaviorById } = useBehaviorContext();
  const { pushNavigationTree, pinCluster, unPinCluster, pinnedClusterIds, setHoveringCluster, setSelectedClusterId } = useBoardContext();
  const { findAllConnectedClusters } = useClusterContext();
  const subBehaviors = cluster.behaviorIds.map((id) => findBehaviorById(id));

  const { trackEvent } = useTracking();

  return (
    <S.Container
      onClick={() => {
        pushNavigationTree([cluster.higherClusterId ?? '', cluster.id]);
        trackEvent({ section: 'Viz', component: 'ClusterItem', action: 'selectCluster', value: 'Base' });
        setSelectedClusterId(cluster.id);
      }}
      onMouseOver={() => setHoveringCluster(cluster.id)}
      onMouseLeave={() => setHoveringCluster(null)}
    >
      <S.Header>
        <S.TypeLabel>Cluster</S.TypeLabel>
        {/* <S.PinButton
          onClick={(e) => {
            if (pinnedClusterIds.includes(cluster.id)) {
              unPinCluster(cluster.id);
              trackEvent({ section: 'Viz', component: 'ClusterItem', action: 'unpinCluster', value: 'Base' });
            } else {
              pinCluster(cluster.id);
              trackEvent({ section: 'Viz', component: 'ClusterItem', action: 'pinCluster', value: 'Base' });
            }
            e.stopPropagation();
          }}
        >
          <PinIcon width={16} height={16} fill={pinnedClusterIds.includes(cluster.id) ? Colors.POINT_BLUE : Colors.BLACK60} />
        </S.PinButton> */}
      </S.Header>
      <S.ClusterName>{cluster.name}</S.ClusterName>
      <S.Description>{cluster.description}</S.Description>
      <S.TypeLabel>Representative Fragments</S.TypeLabel>
      {subBehaviors.slice(0, 3).map((sb) => (
        <S.Description key={`sub-behavior-${cluster.id}-${sb?.id}`}>{sb?.feature ?? ''}</S.Description>
      ))}
      <S.InfoRow>
        <p className="pos-label">Positive</p>
        <p className="count">{cluster.positiveCount}</p>
        <p className="neg-label">Negative</p>
        <p className="count">{cluster.negativeCount}</p>
      </S.InfoRow>
    </S.Container>
  );
};

export default HigherClusterItem;
