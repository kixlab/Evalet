import numpy as np
import hdbscan

def run_hdbscan(data):
  clusterer = hdbscan.HDBSCAN(min_cluster_size=5, min_samples=2)
  result = clusterer.fit_predict(data)
  return result