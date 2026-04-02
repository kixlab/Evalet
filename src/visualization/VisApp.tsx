import styled from 'styled-components';
import { Colors } from '../style/colors';
import { OverlayProvider, overlay } from 'overlay-kit';
import D3Board from './D3Board';
import { TextStyle } from '../style/textStyle';
import { useCallback, useEffect, useState } from 'react';
import { VisTab } from './model/VisTab';
import Sidebar from './template/Sidebar';
import DatabasePage from './template/DatabasePage';
import CriteriaPage from './template/CriteriaPage';
import InspectPage from './template/InspectPage';
import LLMRequestManager from '../network/LLMRequestManager';
import NormalButton from '../component/common/NormalButton';
import { useBehaviorContext } from './store/behaviorStore';
import { useDatabaseContext } from './store/databaseStore';
import pLimit from 'p-limit';
import { evaluateManyData } from './pipeline/evaluate';
import { extractSnippetsOneData, evaluateSnippets } from './pipeline/multistepEvaluate';
import { useCriteriaContext } from './store/criteriaStore';
import { embedBehaviors } from './pipeline/embedding';
import { baseCluster } from './pipeline/baseCluster';
import { higherCluster } from './pipeline/higherCluster';
import { PairData } from './model/PairData';
import { CriteriaDetail } from './model/CriteriaDetail';
import { Cluster, HigherCluster } from './model/Clusters';
import { Behavior } from './model/Behavior';
import { useClusterContext } from './store/clusterStore';
import useBoardContext from './store/boardStore';
import FloatToolbar from './components/FloatToolbar';
import { useEvaluationContext } from './store/evaluationStore';
import { TailSpin } from 'react-loader-spinner';
import { DataToCluster } from './model/ClusterCombination';
import { EvaluationDetail } from './model/Evaluation';
import EvalDetailModal from './template/EvalDetailModal';
import SelectedClusterFloater from './components/SelectedClusterFloater';
import ReactDOM from 'react-dom';
import BehaviorTooltip from './components/BehaviorTooltip';
import CriteriaDrawer from './components/CriteriaDrawer';
import ClusterTooltip from './components/ClusterTooltip';
import VisControl from './components/VisControl';
import PrevBehaviorTooltip from './components/PrevBehaviorTooltip';
import { useNavigator } from './store/navigator';
import { dataSyncService } from './services/dataSyncService';
import Overlay from '../component/common/Overlay';
import ApiKeyModal from './template/ApiKeyModal';
import { useApiKeyContext } from './store/apiKeyStore';

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  min-width: 1280px;
  background-color: ${Colors.BACKGROUND};
`;

const Layout = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopBarContainer = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  background-color: ${Colors.WHITE};
  padding: 0 16px;
  border-bottom: 1px solid ${Colors.BLACK12};

  .button-container {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;

    .hint {
      font-size: 12px;
      color: ${Colors.BLACK60};
    }
  }
`;

const Title = styled.div`
  span {
    font-size: 20px;
    font-weight: ${TextStyle.MEDIUM};
    color: ${Colors.BLACK60};

    &.green {
      color: ${Colors.POINT_GREEN};
    }

    &.blue {
      color: ${Colors.POINT_BLUE};
    }

    &.red {
      color: ${Colors.POINT_RED};
    }
  }
`;

const Contents = styled.div`
  width: 100%;
  flex-grow: 1;
  min-height: 0;
  display: flex;
  flex-direction: row;
`;

const PanelArea = styled.div`
  flex-grow: 1;
  min-width: 0;
  height: 100%;
  background-color: ${Colors.WHITE};
  border-right: 1px solid ${Colors.BLACK12};
  position: relative;

  .scroll-area {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding-bottom: 48px;
  }
`;

const VisualizationArea = styled.div`
  width: 50%;
  height: 100%;
  flex-shrink: 0;
  position: relative;
`;

function InnerVisApp() {
  const { database, setMapByCriteria } = useDatabaseContext();
  const { updateAllBehavior } = useBehaviorContext();
  const { setClusterListByCriteriaId, saveAllClusters } = useClusterContext();
  const { criteria, expireAllFewshots } = useCriteriaContext();
  const {
    selectedBehaviorIds,
    currEvalDetailId,
    selectedClusterId,
    hoveringBehavior,
    currPage,
    setCurrentPage,
    isCriteriaDrawerOpen,
    setCriteriaDrawerOpen,
    hoveringCluster,
    setPreviousFewShotBehaviorEmbeddings,
    hoveringPrevBehavior,
    setInspectTabTooltipOn,
    evalDetailOpen,
  } = useBoardContext();
  const { evaluationList, updateEvaluationList } = useEvaluationContext();
  const { behaviorList } = useBehaviorContext();
  const { clusterListMap } = useClusterContext();
  const { openAiApiKey, setOpenAiApiKey } = useApiKeyContext();

  const { isBaseline, isDev } = useNavigator();

  const [isProcessing, setProcessing] = useState<boolean>(false);
  const [progressHint, setProgressHint] = useState<string>('');
  const [tooltipLocation, setTooltipLocation] = useState<{ clientX: number; clientY: number } | null>(null);
  const [isCursorInMap, setCursorInMap] = useState<boolean>(false);

  const openApiKeyModal = useCallback(() => {
    overlay.open(({ isOpen, close, unmount }) => {
      return (
        <Overlay isOpen={isOpen} close={close} unmount={unmount} unableToExitByClickBackground={openAiApiKey === ''}>
          <ApiKeyModal
            close={close}
            initialApiKey={openAiApiKey}
            onSubmit={(key) => {
              setOpenAiApiKey(key);
            }}
          />
        </Overlay>
      );
    });
  }, [openAiApiKey, setOpenAiApiKey]);

  useEffect(() => {
    LLMRequestManager.shared.setOpenAIAPIKey(openAiApiKey);
  }, [openAiApiKey]);

  useEffect(() => {
    if (openAiApiKey === '') openApiKeyModal();
  }, [openAiApiKey, openApiKeyModal]);

  const triggerPipeline = async (withEval: boolean, modelName: string) => {
    if (LLMRequestManager.shared.getOpenAIAPIKey() === '') {
      openApiKeyModal();
      return;
    }
    // 1. Run Evaluation for all current dataset and for all criteria.
    console.log('Triggered');
    setProcessing(true);
    try {
      // 1-a. Run evaluations to create behaviors.
      let evaluationDetails: EvaluationDetail[] = [];
      if (withEval) {
        const limit = pLimit(50);

        setProgressHint('Evaluating all data...');
        const evaluationResults = await limit(() => evaluateManyData(database, criteria, isBaseline, modelName));
        evaluationDetails = evaluationResults.flat();
        updateEvaluationList(evaluationDetails);
        expireAllFewshots();
      } else {
        evaluationDetails = evaluationList;
      }

      console.log(evaluationDetails);

      // 2. Process EvaluationDetail and Behaviors
      const behaviors = evaluationDetails.flatMap((e) => e.behaviors);

      let allBehaviors: Behavior[] = [];
      const clusterList: { id: string; clusters: Cluster[] }[] = [];
      setPreviousFewShotBehaviorEmbeddings((curr) => []);

      // 3. Embedding and Clustering for each criterion
      for (const criterion of criteria) {
        const targetBehaviors = behaviors.filter((b) => b.criteriaId === criterion.id);

        // 3-a. Mock behaviors with few shot in for criterion
        const mockBehavior: Behavior[] = isBaseline
          ? []
          : criteria
              .filter((c) => c.id === criterion.id)
              .flatMap((c) => {
                const fromPositive = c.positiveBehaviors.map((b) => ({
                  id: 'mock-positive',
                  behavior: b.rawSnippet,
                  context: null,
                  reasoning: '',
                  feature: isBaseline ? b.rawSnippet : b.feature,
                  evaluation: '',
                  clusterId: null,
                  isPositive: true,
                  criteriaId: c.id,
                  pairDataId: '',
                  vec1Value: null,
                  vec2Value: null,
                }));

                const fromNegative = c.negativeBehaviors.map((b) => ({
                  id: 'mock-negative',
                  behavior: b.rawSnippet,
                  context: null,
                  reasoning: '',
                  feature: isBaseline ? b.rawSnippet : b.feature,
                  evaluation: '',
                  clusterId: null,
                  isPositive: false,
                  criteriaId: c.id,
                  pairDataId: '',
                  vec1Value: null,
                  vec2Value: null,
                }));

                const fromExclude = c.excludeBehaviors.map((b) => ({
                  id: 'mock-exclude',
                  behavior: b.rawSnippet,
                  context: null,
                  reasoning: '',
                  feature: isBaseline ? b.rawSnippet : b.feature,
                  evaluation: '',
                  clusterId: null,
                  isPositive: false,
                  criteriaId: c.id,
                  pairDataId: '',
                  vec1Value: null,
                  vec2Value: null,
                }));

                return [...fromPositive, ...fromNegative, ...fromExclude];
              });

        console.log(targetBehaviors.length, mockBehavior.length);

        // 3-b. Run embeddings
        setProgressHint('Embedding behaviors for "' + criterion.name + '"...');
        const embededBehaviors = await embedBehaviors([...targetBehaviors, ...mockBehavior]);
        if (!embededBehaviors) return;

        const targetEmbededBehaviors = embededBehaviors.filter((b) => !b.id.includes('mock'));
        const mockEmbededBehaviors = embededBehaviors.filter((b) => b.id.includes('mock'));
        setPreviousFewShotBehaviorEmbeddings((curr) => [...curr, ...mockEmbededBehaviors]);

        setProgressHint('Clustering for "' + criterion.name + '"...');

        // 3-c. Run base clusters for the criterion
        const result = await baseCluster(targetEmbededBehaviors, criterion);
        if (!result) return;
        const [clusteredBehaviors, baseClusters] = result;

        // 3-d. Run higher clusters for each criterion
        const higherResult = await higherCluster(baseClusters as Cluster[], criterion);
        if (!higherResult) return;
        const [lowerClusters, higherClusters] = higherResult;

        // 3-e. Calculate positive, negative counts.
        const processedHigherClusters = (higherClusters as HigherCluster[]).map((hc) => {
          const counts = hc.subClusterIds
            .map((cId) => {
              const targetCluster = lowerClusters.find((lc) => lc.id === cId);
              return {
                positiveCount: targetCluster?.positiveCount ?? 0,
                negativeCount: targetCluster?.negativeCount ?? 0,
              };
            })
            .reduce(
              (prev, curr) => {
                return {
                  positiveCount: prev.positiveCount + curr.positiveCount,
                  negativeCount: prev.negativeCount + curr.negativeCount,
                };
              },
              { positiveCount: 0, negativeCount: 0 },
            );
          return {
            ...hc,
            positiveCount: counts.positiveCount,
            negativeCount: counts.negativeCount,
          };
        });

        // 3-f. Save data
        allBehaviors = allBehaviors.concat(clusteredBehaviors as Behavior[]);
        setClusterListByCriteriaId(criterion.id, [lowerClusters, processedHigherClusters]);
        clusterList.push({ id: criterion.id, clusters: [...lowerClusters, ...processedHigherClusters] });
      }
      updateAllBehavior(allBehaviors);
      const map = mapDataToCluster(allBehaviors, clusterList);
      map.forEach((info) => setMapByCriteria(info.criteriaId, info.info));
      saveAllClusters(clusterList.flatMap((c) => c.clusters));
      setInspectTabTooltipOn(true);
    } finally {
      setProcessing(false);
      setProgressHint('');
    }
  };

  const mapDataToCluster = (
    behaviors: Behavior[],
    clusterList: { id: string; clusters: Cluster[] }[],
    criteriaList?: CriteriaDetail[],
    databaseList?: PairData[],
  ) => {
    const final: { criteriaId: string; info: DataToCluster[] }[] = [];
    const criteriaDict = criteriaList ?? criteria;
    const databaseDict = databaseList ?? database;
    criteriaDict.forEach((criterion) => {
      const clusters = clusterList.find((c) => c.id === criterion.id)?.clusters ?? [];
      const result: DataToCluster[] = [];
      for (const row of databaseDict) {
        let rowCluster: string[] = [];
        const targetBehaviors = behaviors.filter((b) => b.pairDataId === row.id);
        for (const behv of targetBehaviors) {
          rowCluster = [...rowCluster, ...findClusterTree(behv, clusters).map((c) => c.id)];
        }
        result.push({ pairDataId: row.id, clusters: Array.from(new Set(rowCluster)) });
      }
      final.push({ criteriaId: criterion.id, info: result });
    });
    return final;
  };

  const findClusterTree = (behavior: Behavior, clusters: Cluster[]) => {
    function recursive(clusterId: string): Cluster[] {
      const currCluster = clusters.find((c) => c.id === clusterId);
      if (!currCluster) return [];
      if (!currCluster?.higherClusterId) {
        return [currCluster];
      } else {
        return [...recursive(currCluster?.higherClusterId ?? ''), currCluster];
      }
    }
    if (behavior.clusterId === null) return [];
    return recursive(behavior.clusterId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipLocation({
      clientX: e.clientX,
      clientY: e.clientY,
    });
    setCursorInMap(true);
  };

  return (
    <Body>
      <OverlayProvider>
        <Layout>
          <TopBarContainer>
            <Title>
              <span>Eval</span>
              <span className="blue">et</span>
            </Title>
            <div className="button-container">
              {!isProcessing && isDev && (
                <NormalButton
                  inactive={database.length === 0 || criteria.length === 0}
                  onClick={() => {
                    dataSyncService.saveToFile(database, 'pairData');
                    dataSyncService.saveToFile(criteria, 'criteria');
                    dataSyncService.saveToFile(evaluationList, 'evaluation');
                    dataSyncService.saveToFile(behaviorList, 'behavior');
                    dataSyncService.saveToFile(Array.from(clusterListMap.values()).flat(2), 'cluster');
                  }}
                >
                  Save All Data
                </NormalButton>
              )}
              {!isProcessing && isDev && (
                <NormalButton inactive={database.length === 0 || criteria.length === 0} onClick={() => triggerPipeline(false, '')}>
                  Run Clustering
                </NormalButton>
              )}
              {!isProcessing && (
                <NormalButton onClick={openApiKeyModal}>API Key</NormalButton>
              )}
              {!isProcessing && (
                // <NormalButton inactive={database.length === 0 || criteria.length === 0} onClick={() => triggerPipeline(true, 'claude-3-7-sonnet-20250219')}>
                <NormalButton
                  inactive={database.length === 0 || criteria.length === 0 || openAiApiKey === ''}
                  onClick={() => triggerPipeline(true, 'gpt-4o-mini')}
                >
                  Run Evaluation
                </NormalButton>
              )}
              {isProcessing && (
                <>
                  <TailSpin width={24} height={24} color={Colors.POINT_BLUE} />
                  <div className="hint">{progressHint}</div>
                </>
              )}
            </div>
          </TopBarContainer>
          <Contents>
            <Sidebar currPage={currPage} setCurrPage={setCurrentPage} />
            <PanelArea>
              <div className="scroll-area">
                {currPage === VisTab.DATABASE && <DatabasePage />}
                {currPage === VisTab.CRITERIA && <CriteriaPage />}
                {currPage === VisTab.EXPLORE && <InspectPage />}
                {currEvalDetailId && evalDetailOpen && (
                  <EvalDetailModal pairDataId={currEvalDetailId.pairDataId} entryBehaviorId={currEvalDetailId.entryBehaviorId} />
                )}
              </div>
              {currPage === VisTab.EXPLORE && selectedBehaviorIds.length > 0 && !isBaseline && (
                <FloatToolbar goToCriteriaPage={() => setCurrentPage(VisTab.CRITERIA)} />
              )}
              <CriteriaDrawer isOpen={isCriteriaDrawerOpen} onClose={() => setCriteriaDrawerOpen(false)} />
            </PanelArea>
            <VisualizationArea onMouseLeave={() => setCursorInMap(false)} onMouseMove={(e) => handleMouseMove(e)}>
              <D3Board />
              <VisControl />
              {selectedClusterId && <SelectedClusterFloater clusterId={selectedClusterId} />}
              {hoveringBehavior &&
                tooltipLocation &&
                ReactDOM.createPortal(<BehaviorTooltip behaviorId={hoveringBehavior} location={tooltipLocation} />, document.body)}
              {hoveringCluster &&
                tooltipLocation &&
                isCursorInMap &&
                ReactDOM.createPortal(<ClusterTooltip clusterId={hoveringCluster} location={tooltipLocation} />, document.body)}
              {hoveringPrevBehavior &&
                tooltipLocation &&
                isCursorInMap &&
                ReactDOM.createPortal(<PrevBehaviorTooltip behavior={hoveringPrevBehavior} location={tooltipLocation} />, document.body)}
            </VisualizationArea>
          </Contents>
        </Layout>
      </OverlayProvider>
    </Body>
  );
}

export default InnerVisApp;
