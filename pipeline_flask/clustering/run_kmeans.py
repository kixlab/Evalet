import numpy as np
from sklearn.cluster import KMeans

def run_kmeans(k, data):
  kmeans = KMeans(n_clusters=k, random_state=42)
  result = kmeans.fit_predict(data)
  return result
