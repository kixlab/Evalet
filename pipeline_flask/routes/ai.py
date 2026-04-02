from flask import Blueprint, jsonify

def create_ai_api() -> Blueprint:
    api = Blueprint('ai', __name__)

    @api.route('/claude', methods=['POST'])
    def postClaude():
        return jsonify({"error": "Anthropic endpoints are disabled."}), 410
    
    @api.route('/claude_batch', methods=['POST'])
    def postClaudeBatch():
        return jsonify({"error": "Anthropic endpoints are disabled."}), 410
    
    @api.route('/claude_usage', methods=['GET'])
    def getClaudeUsage():
        return jsonify({"error": "Anthropic endpoints are disabled."}), 410

    return api