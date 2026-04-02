import * as d3 from 'd3';
import { useState, useRef, useEffect } from 'react';
import { useBehaviorContext } from './store/behaviorStore';
import { Behavior } from './model/Behavior';
import { useClusterContext } from './store/clusterStore';
import useBoardContext from './store/boardStore';
import { BaseCluster, Cluster, HigherCluster, isBaseCluster, isHigherCluster } from './model/Clusters';
import styled from 'styled-components';
import { Colors } from '../style/colors';
import { symbol, symbolCircle, symbolCross } from 'd3-shape';
import { useDatabaseContext } from './store/databaseStore';
import { DataToCluster } from './model/ClusterCombination';
import { VisTab } from './model/VisTab';
import { VisControlType } from './model/VisControlType';

import track, { useTracking } from 'react-tracking';

const StyledSVG = styled.svg`
  .cluster-label {
    fill: black;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.8);
    cursor: pointer;

    &:hover {
      text-shadow: 0px 0px 16px rgba(0, 0, 0, 0.8);
    }
  }
`;

/**
 * @param selection D3에서 선택한 text 요소들
 * @param width 줄바꿈을 적용할 최대 너비(px)
 */
function wrapText(selection: d3.Selection<SVGTextElement, any, any, any>, width: number) {
  selection.each(function (d) {
    const text = d3.select(this);
    const words = text.text().split(/\s+/).reverse();

    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.2; // 줄 간격(em)

    // 기존 text 속성 백업
    const x = text.attr('x');
    const y = text.attr('y');
    const dy = parseFloat(text.attr('dy') || '0');

    // 먼저 text 내용을 비우고 첫 번째 <tspan> 생성
    let tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('dy', `${dy}em`);

    let word: string | undefined;
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(' '));

      // 현재 tspan의 text 길이를 측정해 width를 초과하면 줄바꿈
      if (tspan.node() && tspan.node()!.getComputedTextLength() > width) {
        // 초과한 단어를 빼고, 바로 이전 라인에 확정
        line.pop();
        tspan.text(line.join(' '));

        // 새 줄 추가
        line = [word];
        tspan = text
          .append('tspan')
          .attr('x', x)
          .attr('y', y)
          .attr('dy', `${++lineNumber * lineHeight + dy}em`)
          .text(word);
      }
    }
  });
}

const D3Board = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dataLayerRef = useRef(null);
  const clusterLayerRef = useRef(null);
  const higherClusterLayerRef = useRef(null);
  const brushLayerRef = useRef(null);
  const zoomPanLayerRef = useRef(null);
  const labelLayerRef = useRef(null);
  const prevLayerRef = useRef(null);
  const transformRef = useRef(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGRectElement, unknown> | null>(null);
  const xScaleRef = useRef<d3.ScaleLinear<number, number, never> | null>(null);
  const yScaleRef = useRef<d3.ScaleLinear<number, number, never> | null>(null);
  const zoomScaleRef = useRef(null);
  const highClusterColorsRef = useRef<d3.ScaleOrdinal<string, string, never> | null>(null);

  const { behaviorList, findBehaviorById } = useBehaviorContext();
  const { clusterListMap, findClusterById, findClusterTree } = useClusterContext();
  const {
    currentCriterionId,
    setHoveringCluster,
    selectedClusterId,
    setSelectedClusterId,
    pushNavigationTree,
    selectedBehaviorIds,
    selectBehaviorById,
    unSelectBehaviorById,
    unSelectAllBehavior,
    setHoveringBehavior,
    goToInspectPage,
    goToCriteriaPage,
    inspectFullOrSelect,
    setInspectFullOrSelect,
    currentVisControlType,
    setCurrentVisControlType,
    previousFewShotBehaviorEmbeddings,
    isComparePreviousOn,
    setHoveringPrevBehavior,
    temporarySelectedBehaviorIdInDetail,
    setTemporarySelectedBehaviorIdInDetail,
  } = useBoardContext();

  const { trackEvent } = useTracking();

  const [WIDTH, setWIDTH] = useState(960);
  const [HEIGHT, setHEIGHT] = useState(960);

  const CONTOUR_OPACITY_STEP = 0.03;
  const ZOOM_LEVEL_THRESHOLD = 1.0;
  const FONT_SIZE = 14;

  useEffect(() => {
    if (behaviorList.length === 0) return;
    if (!currentCriterionId) return;
    if (svgRef.current === null) return;
    if (zoomPanLayerRef.current === null) return;
    if (brushLayerRef.current === null) return;

    const currentBehaviorList = behaviorList.filter((b) => b.criteriaId === currentCriterionId);
    const clustersIncludingSelectedBehaviors = Array.from(
      new Set(
        currentBehaviorList.flatMap((b) => {
          return findClusterTree(b);
        }),
      ),
    );

    const clusterList = clusterListMap.get(currentCriterionId);
    const baseClusterList: BaseCluster[] | null = clusterList === undefined ? null : (clusterList[0] as BaseCluster[]);
    const higherClusterList: HigherCluster[] | null = clusterList === undefined ? null : (clusterList[1] as HigherCluster[]);

    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    svg.style('background', 'white');

    setWIDTH(svgRef.current.getBoundingClientRect().width);
    setHEIGHT(svgRef.current.getBoundingClientRect().height);

    const dataLayer = d3.select(dataLayerRef.current);
    const labelLayer = d3.select(labelLayerRef.current);
    if (clusterLayerRef.current === null) return;
    const clusterLayer = d3.select<SVGGElement, unknown>(clusterLayerRef.current);
    if (higherClusterLayerRef.current === null) return;
    const highClusterLayer = d3.select(higherClusterLayerRef.current);
    const prevLayer = d3.select(prevLayerRef.current);

    dataLayer.selectAll('*').remove();
    labelLayer.selectAll('*').remove();

    const margin = 180;

    // 스케일
    const xExtent = d3.extent(currentBehaviorList, (b) => b.vec1Value) as [number, number];
    const yExtent = d3.extent(currentBehaviorList, (b) => b.vec2Value) as [number, number];

    const xRange = xExtent[1] - xExtent[0];
    const yRange = yExtent[1] - yExtent[0];

    const dynamicPointSize = Math.max(8, 32 / ((xRange * yRange) / 32));

    const xScale = d3
      .scaleLinear()
      .domain(xExtent)
      .range([margin, WIDTH - margin]);

    const yScale = d3
      .scaleLinear()
      .domain(yExtent)
      .range([HEIGHT - margin, margin]);

    xScaleRef.current = xScale;
    yScaleRef.current = yScale;

    const clusterIds = Array.from(new Set(currentBehaviorList.map((b) => b.clusterId))); //.filter((c) => c !== -1);

    const highClusterColor = d3
      .scaleOrdinal<string, string>()
      .domain((higherClusterList ?? []).map((c) => c.id))
      .range(d3.schemeCategory10);

    highClusterColorsRef.current = highClusterColor;

    const colorScale = (clusterId: string) => {
      const cluster = findClusterById(clusterId ?? '');
      const highClusterId = cluster?.higherClusterId ?? '';
      const highCluster = findClusterById(highClusterId);
      const baseColor = d3.color(highClusterColor(highClusterId)) as d3.RGBColor;

      const clusterIndex = (highCluster as HigherCluster)?.subClusterIds.findIndex((c) => c === clusterId) ?? 0;
      const numClusters = (highCluster as HigherCluster)?.subClusterIds.length ?? 1;

      const hueVariation = (clusterIndex / numClusters) * 60 - 30; // Vary hue by ±30 degrees
      const brightnessVariation = (clusterIndex / numClusters) * 0.2 - 0.1; // Vary brightness by ±10%

      // Convert to HSL and adjust
      const newColor = d3.hsl(baseColor);
      newColor.h = ((newColor.h ?? 0) + hueVariation) % 360; // Wrap hue
      newColor.l = Math.max(0, Math.min(1, newColor.l + brightnessVariation)); // Clamp lightness

      return newColor.toString();
    };

    // 데이터 포인트 찍기
    dataLayer
      .selectAll<SVGCircleElement, Behavior>('path.point')
      .data(currentBehaviorList)
      .join('path')
      .attr('class', 'point')
      .attr('transform', (b) => {
        const x = xScale(b.vec1Value ?? 0);
        const y = yScale(b.vec2Value ?? 0);
        const rotation = b.isPositive ? 0 : 45;
        return `translate(${x}, ${y}) rotate(${rotation})`;
      })
      .attr(
        'd',
        symbol<Behavior>()
          .type((b) => (b.isPositive ? symbolCircle : symbolCross))
          .size(dynamicPointSize),
      )
      // add outline to symbol if selected
      .attr('stroke', (b) => {
        if (temporarySelectedBehaviorIdInDetail === b.id) return Colors.POINT_RED;
        return selectedBehaviorIds.includes(b.id) ? Colors.POINT_BLUE : 'none';
      })
      .attr('fill', (b) => {
        const clusterId = b.clusterId;
        const cluster = findClusterById(clusterId ?? '');
        const highClusterId = cluster?.higherClusterId ?? '';

        if (clusterId?.startsWith('-1-') || clusterId === '-1') return 'lightgrey';

        const isFriendsInSameClusterSelected = clustersIncludingSelectedBehaviors
          .map((c) => c.id)
          .some((id) => {
            return id === clusterId || id === highClusterId;
          });

        if (temporarySelectedBehaviorIdInDetail === b.id) return colorScale(b.clusterId ?? '');

        if (!selectedBehaviorIds.includes(b.id) || !isFriendsInSameClusterSelected) {
          if (selectedClusterId) {
            const selectedCluster = findClusterById(selectedClusterId);
            if (selectedCluster && (selectedClusterId === clusterId || selectedClusterId === highClusterId)) return colorScale(b.clusterId ?? '');
            return 'lightgrey';
          }
        }

        if (currentVisControlType === VisControlType.HIGH_CLUSTER) {
          return highClusterColor(highClusterId);
        } else if (currentVisControlType === VisControlType.BASE_CLUSTER) {
          return colorScale(b.clusterId ?? '');
        } else {
          return b.isPositive ? 'green' : 'orange';
        }
      })
      .attr('opacity', (d) => {
        if (selectedBehaviorIds.length === 0) return 1;
        return selectedBehaviorIds.includes(d.id) || temporarySelectedBehaviorIdInDetail === d.id ? 1 : 0.2;
      })
      .attr('cursor', 'pointer')
      .on('click', (event, b) => {
        // Prevent zoom on click
        event.stopPropagation();
        if (selectedBehaviorIds.includes(b.id)) {
          unSelectBehaviorById(b.id);
          trackEvent({ section: 'Viz', component: 'Behavior', action: 'Unselect' });
        } else {
          selectBehaviorById(b.id);
          trackEvent({ section: 'Viz', component: 'Behavior', action: 'Select' });
        }
        goToInspectPage();
        if (inspectFullOrSelect !== 'select') setInspectFullOrSelect('select');
      })
      .on('mouseover', (event, b) => {
        setHoveringBehavior(b.id);
      })
      .on('mouseout', (event, b) => {
        setHoveringBehavior(null);
      });

    const zoomBehavior = d3
      .zoom<SVGRectElement, unknown>()
      .scaleExtent([0.5, 10]) // 최소 0.5배 ~ 최대 10배 확대
      .translateExtent([
        [0, 0], // 화면 왼상단
        [WIDTH, HEIGHT], // 화면 오른하단
      ])
      .on('zoom', (event) => {
        // event.transform 을 dataLayer에 적용
        dataLayer.attr('transform', event.transform);
        clusterLayer.attr('transform', event.transform);
        highClusterLayer.attr('transform', event.transform);
        labelLayer.attr('transform', event.transform);
        prevLayer.attr('transform', event.transform);
        transformRef.current = event.transform;
        clusterLayer.selectAll('.cluster-label').attr('font-size', FONT_SIZE / event.transform.k);
        highClusterLayer.selectAll('.cluster-label').attr('font-size', FONT_SIZE / event.transform.k);
        labelLayer.selectAll('.cluster-label').attr('font-size', FONT_SIZE / event.transform.k);

        const k = event.transform.k;
        zoomScaleRef.current = k;
      });

    zoomBehaviorRef.current = zoomBehavior;

    const brushBehavior = d3
      .brush<unknown>()
      .keyModifiers(false)
      .extent([
        [0, 0],
        [WIDTH, HEIGHT],
      ])
      .on('start brush end', (event) => {
        // 선택 영역 계산
        const s = event.selection; // [[x0, y0], [x1, y1]]
        if (!s) {
          return;
        }

        // 브러시 좌표
        const [[x0, y0], [x1, y1]] = s;
        const [invX0, invY0] = transformRef.current.invert([x0, y0]);
        const [invX1, invY1] = transformRef.current.invert([x1, y1]);

        // “데이터가 있는” circle만 선별
        const selectedIdsInBrush: string[] = [];
        d3.selectAll<SVGCircleElement, Behavior>('path.point').each(function (d) {
          if (!d) return;
          const cx = xScale(d.vec1Value ?? 0);
          const cy = yScale(d.vec2Value ?? 0);
          if (invX0 <= cx && cx <= invX1 && invY0 <= cy && cy <= invY1) {
            selectedIdsInBrush.push(d.id);
          }
        });

        d3.selectAll<SVGCircleElement, Behavior>('path.point')
          .attr('stroke', (d) => (selectedIdsInBrush.includes(d?.id ?? '') ? 'red' : 'none'))
          .attr('stroke-width', 2);

        // 브러시가 “끝났을 때(end)” 최종 Store 갱신
        if (event.type === 'end') {
          trackEvent({ section: 'Viz', component: 'Behavior', action: 'Brush' });

          unSelectAllBehavior();
          selectedIdsInBrush.forEach((id) => selectBehaviorById(id));
          if (selectedIdsInBrush.length > 0) goToInspectPage();
          if (inspectFullOrSelect !== 'select') setInspectFullOrSelect('select');
          brushLayer.call(brushBehavior.move, null);
        }
      });

    const zoomPanLayer = d3.select<SVGRectElement, unknown>(zoomPanLayerRef.current);
    const brushLayer = d3.select<SVGGElement, unknown>(brushLayerRef.current);

    const handleShiftKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        zoomPanLayer.style('pointer-events', 'none');
        brushLayer.style('display', 'block');
        brushLayer.style('pointer-events', 'all');
      }
    };

    const handleShiftKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        zoomPanLayer.style('pointer-events', 'all');
        brushLayer.style('display', 'none');
        brushLayer.style('pointer-events', 'none');
      }
    };

    document.addEventListener('keydown', handleShiftKeyDown);
    document.addEventListener('keyup', handleShiftKeyUp);

    zoomPanLayer.style('pointer-events', 'all');
    brushLayer.style('display', 'none');
    brushLayer.style('pointer-events', 'none');

    zoomPanLayer.call(zoomBehavior).on('click', (event) => {
      // 1) 만약 '드래그'로 인해 이벤트가 이미 소비되었다면, click으로 처리하지 않음
      if (event.defaultPrevented) return;
      // defaultPrevented == true 이면 d3-zoom이 드래그로 판단

      // 2) 여기 왔다는 것은 "진짜 클릭"이라 간주
      // => 모든 circle의 선택 해제
      d3.selectAll('path.point').attr('stroke', 'none');
    });
    brushLayer.call(brushBehavior);

    if (!baseClusterList || !higherClusterList) return;

    const labelData = (() => {
      if (selectedClusterId) {
        const selectedCluster = findClusterById(selectedClusterId);
        if (selectedCluster && isBaseCluster(selectedCluster))
          return [
            {
              id: selectedCluster.id,
              name: selectedCluster.name,
              vec1: selectedCluster.centroidVec1,
              vec2: selectedCluster.centroidVec2,
            },
          ];
        else if (selectedCluster && isHigherCluster(selectedCluster)) {
          return baseClusterList
            .filter((bc) => bc.higherClusterId === selectedCluster.id)
            .map((c) => {
              return {
                id: c.id,
                name: c.name,
                vec1: c.centroidVec1,
                vec2: c.centroidVec2,
              };
            });
        }
      }
      if (currentVisControlType !== VisControlType.HIGH_CLUSTER) {
        return baseClusterList.map((c) => {
          return {
            id: c.id,
            name: c.name,
            vec1: c.centroidVec1,
            vec2: c.centroidVec2,
          };
        });
      } else {
        return higherClusterList.map((c) => {
          const subClusters = c.subClusterIds.map((id) => findClusterById(id)).filter((cls): cls is BaseCluster => cls !== undefined);
          let topCluster: BaseCluster | null = null;
          for (const sc of subClusters) {
            if (topCluster === null) topCluster = sc;
            else if (topCluster.behaviorIds.length < sc.behaviorIds.length) topCluster = sc;
          }
          return {
            id: c.id,
            name: c.name,
            vec1: topCluster?.centroidVec1 ?? 0,
            vec2: topCluster?.centroidVec2 ?? 0,
          };
        });
      }
    })();

    const labels = labelLayer
      .selectAll<SVGTextElement, { id: string; name: string; vec1: number; vec2: number }>('text.cluster-label')
      .data(labelData, (d: any) => d.id);
    labels.exit().remove();
    labels
      .enter()
      .append('text')
      .attr('class', 'cluster-label')
      .merge(labels)
      .attr('x', (d) => xScale(d.vec1))
      .attr('y', (d) => yScale(d.vec2))
      .text((d) => d.name)
      .attr('font-size', FONT_SIZE / (transformRef.current.k ?? 1))
      .attr('text-anchor', 'middle')
      .call(wrapText, 200 / (transformRef.current.k ?? 1))
      .on('mouseenter', (event, d) => {
        setHoveringCluster(d.id);
      })
      .on('mouseleave', (event, d) => {
        setHoveringCluster(null);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedClusterId(d.id);
        const cluster = findClusterById(d.id);
        if (!cluster) return;
        trackEvent({ section: 'Viz', component: 'Cluster', action: 'Click', value: isBaseCluster(cluster) ? 'Base' : 'Higher' });
        if (isBaseCluster(cluster)) pushNavigationTree([cluster.higherClusterId ?? '', cluster.id]);
        else if (isHigherCluster(cluster)) pushNavigationTree([cluster.id]);
        goToInspectPage();
      });

    // Reset selected point and cluster when clicking on the background
    svg.on('click', () => {
      unSelectAllBehavior();
      setSelectedClusterId(null);
      setTemporarySelectedBehaviorIdInDetail(null);
      trackEvent({ section: 'Viz', component: 'Behavior', action: 'unselectAll', value: 'background' });
    });

    return () => {
      document.removeEventListener('keydown', handleShiftKeyDown);
      document.removeEventListener('keyup', handleShiftKeyUp);
    };
  }, [behaviorList, selectedClusterId, selectedBehaviorIds, currentVisControlType, currentCriterionId, temporarySelectedBehaviorIdInDetail]);

  // Handling Zoom behavior for cluster selection
  useEffect(() => {
    if (!selectedClusterId || !zoomPanLayerRef.current) return;
    const zoomPanLayer = d3.select<SVGRectElement, unknown>(zoomPanLayerRef.current);
    const zoomBehavior = zoomBehaviorRef.current;
    const xScale = xScaleRef.current;
    const yScale = yScaleRef.current;

    function zoomToCluster(clusterData: Behavior[]) {
      if (zoomPanLayer === null || zoomBehavior === null || xScale === null || yScale === null) return;
      const xCoords = clusterData.map((b) => xScale(b.vec1Value ?? 0));
      const yCoords = clusterData.map((b) => yScale(b.vec2Value ?? 0));

      const x0 = d3.min(xCoords) ?? 0;
      const x1 = d3.max(xCoords) ?? 0;
      const y0 = d3.min(yCoords) ?? 0;
      const y1 = d3.max(yCoords) ?? 0;

      if (x1 - x0 < 1 || y1 - y0 < 1) {
        return;
      }

      // 3) Zoom transform 계산 후 적용
      const dx = x1 - x0;
      const dy = y1 - y0;
      const margin = 400; // 여백
      const xMid = (x0 + x1) / 2;
      const yMid = (y0 + y1) / 2;

      const scale = Math.min((WIDTH - margin) / dx, (HEIGHT - margin) / dy);

      const transform = d3.zoomIdentity
        .translate(WIDTH / 2, HEIGHT / 2)
        .scale(scale)
        .translate(-xMid, -yMid);

      // zoomBehavior.transform(...) 으로 적용
      zoomPanLayer.transition().duration(750).call(zoomBehavior.transform, transform);
    }

    function recursiveBehaviorIdFinder(cluster: Cluster) {
      if (isBaseCluster(cluster)) {
        return cluster.behaviorIds;
      } else if (isHigherCluster(cluster)) {
        return cluster.subClusterIds.flatMap((id): string[] => {
          const target = findClusterById(id);
          if (!target) return [];
          return recursiveBehaviorIdFinder(target);
        });
      }
      return [];
    }

    const targetCluster = findClusterById(selectedClusterId);
    if (targetCluster) {
      const behaviorIds = recursiveBehaviorIdFinder(targetCluster);
      const behaviors = behaviorIds.map((bid) => findBehaviorById(bid)).filter((b): b is Behavior => b !== undefined);

      if (behaviors.length > 0) {
        zoomToCluster(behaviors);
      }
    }
  }, [selectedClusterId]);

  useEffect(() => {
    const currentBehaviorList = behaviorList.filter((b) => b.criteriaId === currentCriterionId);
    if (currentCriterionId === null) return;
    const clusterList = clusterListMap.get(currentCriterionId);
    const baseClusterList: BaseCluster[] | null = clusterList === undefined ? null : (clusterList[0] as BaseCluster[]);
    const higherClusterList: HigherCluster[] | null = clusterList === undefined ? null : (clusterList[1] as HigherCluster[]);
    const xExtent = d3.extent(currentBehaviorList, (b) => b.vec1Value) as [number, number];
    const yExtent = d3.extent(currentBehaviorList, (b) => b.vec2Value) as [number, number];
    const xRange = xExtent[1] - xExtent[0];
    const yRange = yExtent[1] - yExtent[0];
    const xScale = xScaleRef.current;
    const yScale = yScaleRef.current;
    if (xScale === null || yScale === null) return;
    const clusterIds = Array.from(new Set(currentBehaviorList.map((b) => b.clusterId))); //.filter((c) => c !== -1);

    if (clusterLayerRef.current === null) return;
    const clusterLayer = d3.select<SVGGElement, unknown>(clusterLayerRef.current);
    if (higherClusterLayerRef.current === null) return;
    const highClusterLayer = d3.select(higherClusterLayerRef.current);

    clusterLayer.selectAll('*').remove();
    highClusterLayer.selectAll('*').remove();

    const highClusterColor = highClusterColorsRef.current;
    if (highClusterColor === null) return;

    const colorScale = (clusterId: string) => {
      const cluster = findClusterById(clusterId ?? '');
      const highClusterId = cluster?.higherClusterId ?? '';
      const highCluster = findClusterById(highClusterId);
      const baseColor = d3.color(highClusterColor(highClusterId)) as d3.RGBColor;

      const clusterIndex = (highCluster as HigherCluster)?.subClusterIds.findIndex((c) => c === clusterId) ?? 0;
      const numClusters = (highCluster as HigherCluster)?.subClusterIds.length ?? 1;

      const hueVariation = (clusterIndex / numClusters) * 60 - 30; // Vary hue by ±30 degrees
      const brightnessVariation = (clusterIndex / numClusters) * 0.2 - 0.1; // Vary brightness by ±10%

      // Convert to HSL and adjust
      const newColor = d3.hsl(baseColor);
      newColor.h = ((newColor.h ?? 0) + hueVariation) % 360; // Wrap hue
      newColor.l = Math.max(0, Math.min(1, newColor.l + brightnessVariation)); // Clamp lightness

      return newColor.toString();
    };

    // ---- CALCULATE AVERAGE DISTANCE ----------------------------------------
    const calculateAverageDistance = () => {
      let totalDist = 0;
      let count = 0;
      for (let i = 0; i < currentBehaviorList.length; i++) {
        let minDist = Infinity;
        for (let j = 0; j < currentBehaviorList.length; j++) {
          if (i !== j) {
            const dist = Math.sqrt(
              Math.pow((currentBehaviorList[i].vec1Value ?? 0) - (currentBehaviorList[j].vec1Value ?? 0), 2) +
                Math.pow((currentBehaviorList[i].vec2Value ?? 0) - (currentBehaviorList[j].vec2Value ?? 0), 2),
            );
            minDist = Math.min(minDist, dist);
          }
        }
        if (minDist !== Infinity) {
          totalDist += minDist;
          count++;
        }
      }
      return totalDist / count;
    };

    const avgDistance = calculateAverageDistance();
    const bandwidthScale = Math.min(WIDTH, HEIGHT) * (avgDistance / Math.min(xRange, yRange));

    const contourDensityGenerator = d3
      .contourDensity<Behavior>()
      .x((d) => xScale(d.vec1Value ?? 0))
      .y((d) => yScale(d.vec2Value ?? 0))
      .size([WIDTH, HEIGHT])
      .bandwidth(bandwidthScale * 2)
      .thresholds(6);

    const highContourDensityGenerator = d3
      .contourDensity<Behavior>()
      .x((d) => xScale(d.vec1Value ?? 0))
      .y((d) => yScale(d.vec2Value ?? 0))
      .size([WIDTH, HEIGHT])
      .bandwidth(bandwidthScale * 2)
      .thresholds(8);

    clusterIds.forEach((clusterId) => {
      if (!clusterId) return;
      const clusterData = currentBehaviorList.filter((b) => b.clusterId === clusterId);
      if (clusterData.length === 0) return;

      const contours = contourDensityGenerator(clusterData);
      const clusterInfo = findClusterById(clusterId ?? '');
      if (!clusterInfo) return;

      const drowned = selectedClusterId === null ? false : clusterInfo.higherClusterId !== selectedClusterId;

      clusterLayer
        .selectAll(`path.contour-${clusterId}`)
        .data(contours)
        .join('path')
        .attr('class', `contour-${clusterId}`)
        .attr('d', d3.geoPath())
        .attr('fill', drowned ? Colors.BLACK08 : colorScale(clusterId))
        .attr('opacity', (d, i) => {
          if (drowned) {
            return 0;
          } else return CONTOUR_OPACITY_STEP + i * CONTOUR_OPACITY_STEP;
        })
        .attr('pointer-events', 'none');
      // .style('transition', 'opacity 0.3s ease');
    });

    higherClusterList?.forEach((highCluster) => {
      const clusterData = currentBehaviorList.filter((d) => highCluster.subClusterIds.includes(d.clusterId ?? ''));
      const contours = highContourDensityGenerator(clusterData);

      highClusterLayer
        .selectAll(`path.contour-high-${highCluster.id}`)
        .data(contours)
        .join('path')
        .attr('class', `contour-high-${highCluster.id}`)
        .attr('d', d3.geoPath())
        .attr('stroke', highClusterColor(highCluster.id))
        .attr('fill', 'none')
        .attr('stroke-width', 2)
        .attr('opacity', (d, i) => {
          // Set only last contour line to be visible
          if (i === 0) {
            if (selectedClusterId && selectedClusterId !== highCluster.id) {
              return 0;
            } else return 0.1;
          } else {
            return 0;
          }
        })
        .attr('pointer-events', 'none');
      // .style('transition', 'opacity 0.3s ease');
    });
  }, [behaviorList, selectedClusterId, selectedBehaviorIds, currentVisControlType, currentCriterionId]);

  useEffect(() => {
    const prevLayer = d3.select(prevLayerRef.current);
    prevLayer.selectAll('rect.prev-point').remove();
    const xScale = xScaleRef.current;
    const yScale = yScaleRef.current;
    const SIZE = 12;

    if (!isComparePreviousOn || xScale === null || yScale === null) return;

    prevLayer
      .selectAll<SVGCircleElement, Behavior>('rect.prev-point')
      .data(previousFewShotBehaviorEmbeddings.filter((e) => e.criteriaId === currentCriterionId))
      .join('rect')
      .attr('class', 'prev-point')
      .attr('x', -SIZE / 2)
      .attr('y', -SIZE / 2)
      .attr('width', SIZE)
      .attr('height', SIZE)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('transform', (b) => {
        const x = xScale(b.vec1Value ?? 0);
        const y = yScale(b.vec2Value ?? 0);
        return `translate(${x}, ${y})`;
      })
      // add outline to symbol if selected
      .attr('stroke', Colors.WHITE)
      .attr('fill', (b) => {
        if (b.id.includes('positive')) {
          return Colors.POINT_GREEN;
        } else if (b.id.includes('negative')) {
          return Colors.POINT_RED;
        } else {
          return Colors.NAVY;
        }
      })
      .attr('opacity', (d) => {
        if (selectedBehaviorIds.length === 0) return 1;
        return selectedBehaviorIds.includes(d.id) ? 1 : 0.2;
      })
      .attr('cursor', 'pointer')
      .on('click', (event, b) => {
        // Prevent zoom on click
        event.stopPropagation();
        goToCriteriaPage();
      })
      .on('mouseover', (event, b) => {
        setHoveringPrevBehavior(b);
      })
      .on('mouseout', (event, b) => {
        setHoveringPrevBehavior(null);
      });
  }, [currentCriterionId, isComparePreviousOn, previousFewShotBehaviorEmbeddings, currentVisControlType]);

  return (
    <StyledSVG ref={svgRef} className="wrapper" width={'100%'} height={'100%'} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <rect ref={zoomPanLayerRef} className="zoompan" width={WIDTH} height={HEIGHT} fill="none"></rect>
      <g ref={brushLayerRef} className="brush"></g>
      <g ref={clusterLayerRef} className="clusters"></g>
      <g ref={higherClusterLayerRef} className="higher-clusters"></g>
      <g ref={dataLayerRef} className="data-point"></g>
      <g ref={labelLayerRef} className="cluster-label"></g>
      <g ref={prevLayerRef} className="prev-point"></g>
    </StyledSVG>
  );
};

export default D3Board;
