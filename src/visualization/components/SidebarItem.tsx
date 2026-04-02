import { VisTab } from '../model/VisTab';
import * as S from './SidebarItem.style';
import { ReactComponent as DatabaseIcon } from '../../assets/icon/ic_database.svg';
import { ReactComponent as CriteriaIcon } from '../../assets/icon/ic_file_dock.svg';
import { ReactComponent as CompassIcon } from '../../assets/icon/ic_compass.svg';
import { ReactComponent as InspectIcon } from '../../assets/icon/ic_file_dock_search.svg';
import { Colors } from '../../style/colors';
import { Tooltip, TooltipRefProps } from 'react-tooltip';
import useBoardContext from '../store/boardStore';
import { useEffect, useRef } from 'react';

interface Props {
  tab: VisTab;
  selected: boolean;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ tab, selected, active, onClick }: Props) => {
  const { isCriteriaTabTooltipOn, setCriteriaTabTooltipOn, isInspectTabTooltipOn, setInspectTabTooltipOn } = useBoardContext();
  const tooltipRef = useRef<TooltipRefProps>(null);

  useEffect(() => {
    if (isCriteriaTabTooltipOn && tab === VisTab.CRITERIA && tooltipRef.current) {
      tooltipRef.current.open();
      tooltipRef.current.close({ delay: 5000 });
      setCriteriaTabTooltipOn(false);
    }
  }, [isCriteriaTabTooltipOn]);

  useEffect(() => {
    if (isInspectTabTooltipOn && tab === VisTab.EXPLORE && tooltipRef.current) {
      tooltipRef.current.open();
      tooltipRef.current.close({ delay: 5000 });
      setInspectTabTooltipOn(false);
    }
  }, [isInspectTabTooltipOn]);

  return (
    <S.Container
      id={`sidebar-item-${tab}`}
      className={`${selected ? 'selected' : ''} ${active ? '' : 'inactive'}`}
      onClick={() => {
        if (active) onClick();
      }}
    >
      <>
        {tab === VisTab.DATABASE && <DatabaseIcon width={24} height={24} stroke={!active ? Colors.BLACK40 : selected ? Colors.POINT_BLUE : Colors.BLACK80} />}
        {tab === VisTab.CRITERIA && <CriteriaIcon width={24} height={24} stroke={!active ? Colors.BLACK40 : selected ? Colors.POINT_BLUE : Colors.BLACK80} />}
        {tab === VisTab.EXPLORE && <CompassIcon width={24} height={24} stroke={!active ? Colors.BLACK40 : selected ? Colors.POINT_BLUE : Colors.BLACK80} />}
        {tab === VisTab.DETAIL && <InspectIcon width={24} height={24} stroke={!active ? Colors.BLACK40 : selected ? Colors.POINT_BLUE : Colors.BLACK80} />}
      </>
      <S.Title className={`${selected ? 'selected' : ''} ${active ? '' : 'inactive'}`}>
        {tab === VisTab.DATABASE && 'Database'}
        {tab === VisTab.CRITERIA && 'Criteria'}
        {tab === VisTab.EXPLORE && 'Explore'}
        {tab === VisTab.DETAIL && 'Detail'}
      </S.Title>
      <Tooltip ref={tooltipRef} anchorSelect={`#sidebar-item-${tab}`} place="right" imperativeModeOnly={true} openEvents={{}}>
        {tab === VisTab.CRITERIA ? `Now you can set your criteria set!` : `Now you can check the evaluation results and clusters!`}
      </Tooltip>
    </S.Container>
  );
};

export default SidebarItem;
