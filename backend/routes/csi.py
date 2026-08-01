"""
WiFi Vision — CSI Data Routes
Endpoints for retrieving CSI data from the database.
"""
import json
from flask import Blueprint, jsonify, request, current_app

csi_bp = Blueprint('csi', __name__)


@csi_bp.route('/csi/latest', methods=['GET'])
def get_latest_csi():
    """Return the most recent CSI frame from the database."""
    db = current_app.config['db']
    rows = db.get_latest_csi(count=1)

    if not rows:
        return jsonify({
            'csi': None,
            'message': 'No CSI data available. Connect the ESP32 receiver and start collection.',
        }), 200

    row = rows[0]
    return jsonify({
        'csi': {
            'id': row['id'],
            'timestamp': row['timestamp'],
            'subcarriers': json.loads(row['subcarriers']),
            'rssi': row['rssi'],
            'noise_floor': row['noise_floor'],
            'channel': row['channel'],
            'bandwidth': row['bandwidth'],
        }
    })


@csi_bp.route('/csi/history', methods=['GET'])
def get_csi_history():
    """Return recent CSI frames. Query param: ?limit=N (default 50)."""
    db = current_app.config['db']
    limit = request.args.get('limit', 50, type=int)
    limit = min(limit, 500)  # Cap at 500 to prevent excessive queries

    rows = db.get_latest_csi(count=limit)
    data = []
    for row in rows:
        data.append({
            'id': row['id'],
            'timestamp': row['timestamp'],
            'rssi': row['rssi'],
            'subcarriers': json.loads(row['subcarriers']),
        })

    return jsonify({'csi_history': data, 'count': len(data)})
