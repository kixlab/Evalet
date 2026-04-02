import { useEffect, useRef, useState } from 'react';
import { useBehaviorContext } from '../store/behaviorStore';
import * as S from './PrevBehaviorTooltip.style';
import { Behavior } from '../model/Behavior';

interface Props {
  behavior: Behavior;
  location: { clientX: number; clientY: number };
}

const PrevBehaviorTooltip = ({ behavior, location }: Props) => {
  const { findBehaviorById } = useBehaviorContext();

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
      <S.PosNegTag className={behavior.id.includes('positive') ? 'positive' : behavior.id.includes('negative') ? 'negative' : 'exclude'}>
        {behavior.id.includes('positive') ? 'Positive' : behavior.id.includes('negative') ? 'Negative' : 'Exclude'}
      </S.PosNegTag>
      <S.Feature>{behavior.feature}</S.Feature>
      <S.Behavior>{behavior.behavior}</S.Behavior>
    </S.Container>
  );
};

export default PrevBehaviorTooltip;
