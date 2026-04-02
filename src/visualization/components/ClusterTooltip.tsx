import { useEffect, useRef, useState } from 'react';
import * as S from './ClusterTooltip.style';
import { useClusterContext } from '../store/clusterStore';

interface Props {
  clusterId: string;
  location: { clientX: number; clientY: number };
}

const ClusterTooltip = ({ clusterId, location }: Props) => {
  const { findClusterById } = useClusterContext();
  const cluster = findClusterById(clusterId);

  const [tooltipSize, setTooltipSize] = useState({ width: 0, height: 0 });

  const tooltipRef = useRef<HTMLDivElement>(null);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tooltipCursorPadding = 10;

  const top = Math.min(location.clientY + tooltipCursorPadding, viewportHeight - tooltipSize.height - tooltipCursorPadding);
  const left = Math.min(location.clientX + tooltipCursorPadding, viewportWidth - tooltipSize.width - tooltipCursorPadding);

  useEffect(() => {
    // 툴팁 크기를 계산
    if (tooltipRef.current) {
      const { offsetWidth, offsetHeight } = tooltipRef.current;
      setTooltipSize({ width: offsetWidth, height: offsetHeight });
    }
  }, [cluster]);

  return (
    <S.Container
      ref={tooltipRef}
      style={{
        position: 'absolute',
        top: top,
        left: left,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <S.InfoRow>
        <div className="pos">Positive</div>
        <div className="count">{cluster?.positiveCount ?? '-'}</div>
      </S.InfoRow>
      <S.InfoRow>
        <div className="neg">Negative</div>
        <div className="count">{cluster?.negativeCount ?? '-'}</div>
      </S.InfoRow>
    </S.Container>
  );
};

export default ClusterTooltip;
