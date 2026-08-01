"""
WiFi Vision — System Management Routes
Endpoints for controlling the CSI collection pipeline and ML training.
"""
import logging
import numpy as np
from flask import Blueprint, jsonify, request, current_app

system_bp = Blueprint('system', __name__)
logger = logging.getLogger(__name__)

# Module-level state (in production, use a proper service layer)
_serial_reader = None
_ml_manager = None


def _get_ml_manager():
    global _ml_manager
    if _ml_manager is None:
        from ml_model import MLModelManager
        from config import Config
        _ml_manager = MLModelManager(Config.MODEL_DIR)
    return _ml_manager


@system_bp.route('/system', methods=['GET'])
def get_system_info():
    """Return system health and statistics."""
    import psutil
    db = current_app.config['db']
    stats = db.get_stats()

    try:
        cpu = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory().percent
    except Exception:
        cpu = 0.0
        memory = 0.0

    return jsonify({
        'cpu': round(cpu, 1),
        'memory': round(memory, 1),
        'db_size': stats['db_size_mb'],
        'packet_count': stats['csi_records'],
        'prediction_count': stats['activity_records'],
    })


@system_bp.route('/start', methods=['POST'])
def start_collection():
    """Start serial data collection from the ESP32 receiver."""
    global _serial_reader
    from serial_reader import SerialReader
    from config import Config

    if _serial_reader and _serial_reader.is_connected:
        return jsonify({'message': 'Collection is already running.'}), 200

    _serial_reader = SerialReader(Config.SERIAL_PORT, Config.SERIAL_BAUD)

    db = current_app.config['db']

    def on_packet(packet):
        db.insert_csi(
            subcarriers=packet.subcarriers,
            rssi=packet.rssi,
            noise_floor=packet.noise_floor,
            channel=packet.channel,
            bandwidth=packet.bandwidth,
            mac=packet.mac,
        )

    _serial_reader.on_packet(on_packet)
    success = _serial_reader.start()

    if success:
        db.log_event('collection_start', f'Started on {Config.SERIAL_PORT}')
        return jsonify({'message': f'Collection started on {Config.SERIAL_PORT}.'})
    else:
        return jsonify({'message': f'Failed to open {Config.SERIAL_PORT}. Check connection.'}), 500


@system_bp.route('/stop', methods=['POST'])
def stop_collection():
    """Stop serial data collection."""
    global _serial_reader
    if _serial_reader:
        _serial_reader.stop()
        db = current_app.config['db']
        db.log_event('collection_stop', 'Serial collection stopped by user.')
        return jsonify({'message': 'Collection stopped.'})
    return jsonify({'message': 'Collection was not running.'}), 200


@system_bp.route('/train', methods=['POST'])
def train_model():
    """
    Train an ML model on collected CSI data.
    Expects JSON body: { "model_type": "random_forest" | "svm" | "xgboost" }
    """
    data = request.get_json(silent=True) or {}
    model_type = data.get('model_type', 'random_forest')

    manager = _get_ml_manager()

    try:
        manager.create_model(model_type)
    except (RuntimeError, ValueError) as e:
        return jsonify({'error': str(e)}), 400

    # In production, load labeled CSI data from the database.
    # For now, return a message indicating the model is ready for training.
    return jsonify({
        'message': f'{model_type} model created and ready for training.',
        'note': 'Collect labeled CSI data and call this endpoint with training data to fit the model.',
        'model_type': model_type,
    })


@system_bp.route('/predict', methods=['POST'])
def predict():
    """
    Run inference on a feature vector.
    Expects JSON body: { "features": [f1, f2, ..., fN] }
    """
    data = request.get_json(silent=True) or {}
    features = data.get('features')

    if not features or not isinstance(features, list):
        return jsonify({'error': 'Provide a "features" array in the request body.'}), 400

    manager = _get_ml_manager()

    if not manager.is_loaded:
        return jsonify({'error': 'No model loaded. Train a model first.'}), 400

    try:
        features_np = np.array(features, dtype=float)
        result = manager.predict(features_np)
        return jsonify(result)
    except Exception as e:
        logger.error(f'Prediction error: {e}')
        return jsonify({'error': str(e)}), 500
