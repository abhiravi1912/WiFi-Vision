"""
WiFi Vision — Status Routes
Endpoints for system status and device information.
"""
import time
from flask import Blueprint, jsonify, current_app

status_bp = Blueprint('status', __name__)

# Track server start time for uptime calculation
_start_time = time.time()


@status_bp.route('/status', methods=['GET'])
def get_status():
    """Return current system running status and uptime."""
    uptime = int(time.time() - _start_time)
    return jsonify({
        'running': True,
        'uptime': uptime,
        'version': '1.0.0',
    })


@status_bp.route('/devices', methods=['GET'])
def get_devices():
    """Return connected device information."""
    # In production, this would query the serial reader for actual device state.
    # For now, return the configured device information.
    devices = [
        {
            'id': 'tx-01',
            'name': 'ESP32 Transmitter',
            'role': 'transmitter',
            'connected': False,
            'port': None,
            'baudRate': 921600,
            'firmware': 'ESP-IDF v5.x',
            'mac': '24:6F:28:A1:B2:C3',
        },
        {
            'id': 'rx-01',
            'name': 'ESP32 Receiver',
            'role': 'receiver',
            'connected': False,
            'port': current_app.config.get('SERIAL_PORT', 'COM4'),
            'baudRate': current_app.config.get('SERIAL_BAUD', 921600),
            'firmware': 'ESP-IDF v5.x',
            'mac': '24:6F:28:D4:E5:F6',
        },
    ]
    return jsonify({'devices': devices})
