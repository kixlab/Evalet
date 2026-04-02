import * as S from './Navigator.style';
import { ReactComponent as ChevronUpIcon } from '../../assets/icon/ic_chevron_up.svg';
import useBoardContext from '../store/boardStore';
import { isBaseCluster, isHigherCluster } from '../model/Clusters';
import { useClusterContext } from '../store/clusterStore';
import { useTracking } from 'react-tracking';

const Navigator = () => {
  const { navigationStack, restoreNavigation } = useBoardContext();
  const { findClusterById } = useClusterContext();

  const { trackEvent } = useTracking();

  const current = navigationStack.length === 0 ? 'Root' : navigationStack[navigationStack.length - 1];
  const previous = navigationStack.length === 0 ? null : navigationStack.length === 1 ? 'Root' : navigationStack[navigationStack.length - 2];

  return (
    <S.Container>
      {previous && (
        <S.PreviousButton
          onClick={() => {
            trackEvent({ section: 'Viz', component: 'Navigator', action: 'goBack' });
            restoreNavigation();
          }}
        >
          <ChevronUpIcon width={16} height={16} />
          Higher: {previous === 'Root' ? 'Root' : findClusterById(previous)?.name}
        </S.PreviousButton>
      )}
      <S.CurrentStack>
        {current != 'Root' && isHigherCluster(findClusterById(current)!) && 'Super Cluster: '}
        {current != 'Root' && isBaseCluster(findClusterById(current)!) && 'Cluster: '}
        {current === 'Root' ? 'Root' : findClusterById(current)?.name}
      </S.CurrentStack>
      {current !== 'Root' && <S.CurrentExplanation>{findClusterById(current)?.description}</S.CurrentExplanation>}
    </S.Container>
  );
};

export default Navigator;
