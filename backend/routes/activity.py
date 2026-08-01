"""
WiFi Vision — Activity Routes
Endpoints for activity predictions and history.
"""
from flask import Blueprint, jsonify, request, current_app

activity_bp = Blueprint('activity', __name__)


@activity_bp.route('/activity', methods=['GET'])
def get_current_activity():
    """Return the most recent activity prediction."""
    db = current_app.config['db']
    latest = db.get_latest_activity()

    if not latest:
        return jsonify({
            'activity': 'Unknown',
            'confidence': 0.0,
            'zone': '—',
            'timestamp': None,
            'message': 'No predictions available. Train and start the ML pipeline first.',
        })

    return jsonify({
        'activity': latest['activity'],
        'confidence': latest['confidence'],
        'zone': latest['zone'],
        'timestamp': latest['timestamp'],
        'model': latest['model'],
    })


@activity_bp.route('/history', methods=['GET'])
def get_activity_history():
    """Return recent activity predictions. Query param: ?limit=N (default 50)."""
    db = current_app.config['db']
    limit = request.args.get('limit', 50, type=int)
    limit = min(limit, 500)

    rows = db.get_activity_history(limit=limit)
    history = []
    for row in rows:
        history.append({
            'id': row['id'],
            'timestamp': row['timestamp'],
            'activity': row['activity'],
            'confidence': row['confidence'],
            'zone': row['zone'],
            'rssi': row['rssi'],
        })

    return jsonify({'history': history, 'count': len(history)})
