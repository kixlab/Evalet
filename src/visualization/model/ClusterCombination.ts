export interface DataToCluster {
  pairDataId: string;
  clusters: string[];
}

export interface ClusterCombinationResult {
  additionalClusterId: string;
  combination: string[];
  count: number;
  pairDataIds: string[];
}
