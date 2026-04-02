import { Behavior } from './Behavior';

export interface Cluster {
  id: string;
  name: string;
  description: string;
  shape: any | null; // Visualization Shape, will be replaced to proper type in future
  higherClusterId: string | null;
  centroidVec1: number;
  centroidVec2: number;
  positiveCount: number;
  negativeCount: number;
  criteriaId: string;
}

export interface BaseCluster extends Cluster {
  behaviorIds: string[];
}

export interface HigherCluster extends Cluster {
  subClusterIds: string[];
}

// 타입 가드
export function isBaseCluster(cluster: Cluster): cluster is BaseCluster {
  return cluster !== undefined && cluster !== null && (cluster as BaseCluster).behaviorIds !== undefined && (cluster as BaseCluster).behaviorIds !== null;
}

export function isHigherCluster(cluster: Cluster): cluster is HigherCluster {
  return (
    cluster !== undefined && cluster !== null && (cluster as HigherCluster).subClusterIds !== undefined && (cluster as HigherCluster).subClusterIds !== null
  );
}
