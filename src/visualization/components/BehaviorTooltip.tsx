import { useEffect, useRef, useState } from 'react';
import { useBehaviorContext } from '../store/behaviorStore';
import * as S from './BehaviorTooltip.style';

interface Props {
  behaviorId: string;
  location: { clientX: number; clientY: number };
}

const BehaviorTooltip = ({ behaviorId, location }: Props) => {
  const { findBehaviorById } = useBehaviorContext();
  const behavior = findBehaviorById(behaviorId);

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
  }, [behavior]);

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
      <S.PosNegTag className={behavior?.isPositive ? 'positive' : 'negative'}>{behavior?.isPositive ? 'Positive' : 'Negative'}</S.PosNegTag>
      <S.Feature>{behavior?.feature ?? '-'}</S.Feature>
    </S.Container>
  );
};

export default BehaviorTooltip;
