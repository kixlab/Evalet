from flask import Blueprint, request, jsonify
import numpy as np

from clustering.run_hdbscan import run_hdbscan
from clustering.run_kmeans import run_kmeans
from clustering.run_pacmap import run_pacmap

def create_cluster_api() -> Blueprint:
    api = Blueprint('cluster', __name__)

    @api.route('/hdbscan', methods=['POST'])
    def postHdbscan():
        data = request.json

        input_data = np.array(data)

        predictions = run_hdbscan(input_data)

        # 결과 반환
        return jsonify({"predictions": predictions.tolist()})

    @api.route('/kmeans', methods=['POST'])
    def postKmeans():
        data = request.json

        k = data['k']
        input_data = np.array(data['data'])

        predictions = run_kmeans(k, input_data)

        return jsonify({'predictions': predictions.tolist()})

    @api.route('/pacmap', methods=['POST'])
    def postPacmap():
        data = request.json

        input_data = np.array(data['data'])
        embeddings = run_pacmap(input_data)

        return jsonify({'embeddings': embeddings})
    
    return api