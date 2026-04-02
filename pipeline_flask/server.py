from flask import Flask, render_template
from flask_cors import CORS

from routes.cluster import create_cluster_api
from routes.ai import create_ai_api

app = Flask(__name__, static_folder='../build/static', template_folder='../build')
CORS(app)  # 모든 도메인에서 접근 허용 (특정 도메인만 허용하려면 origins 인자를 설정)

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')

app.register_blueprint(create_cluster_api(), url_prefix='/cluster')
app.register_blueprint(create_ai_api(), url_prefix='/ai')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
