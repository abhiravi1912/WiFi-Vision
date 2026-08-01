"""
WiFi Vision — Utility Functions
Common helpers used across the backend.
"""
import time
from datetime import datetime, timezone
from functools import wraps
from flask import jsonify
import logging

logger = logging.getLogger(__name__)


def timestamp_now() -> str:
    """Return the current UTC timestamp as an ISO 8601 string."""
    return datetime.now(timezone.utc).isoformat()


def format_uptime(seconds: int) -> str:
    """Format seconds into a human-readable uptime string."""
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    secs = seconds % 60
    return f'{hours}h {minutes}m {secs}s'


def format_bytes(size_bytes: int) -> str:
    """Format bytes into a human-readable size string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f'{size_bytes:.1f} {unit}'
        size_bytes /= 1024
    return f'{size_bytes:.1f} TB'


def handle_errors(f):
    """Decorator to catch and return exceptions as JSON error responses."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.exception(f'Unhandled error in {f.__name__}')
            return jsonify({'error': str(e)}), 500
    return wrapper


def clamp(value: float, min_val: float, max_val: float) -> float:
    """Clamp a value between min and max."""
    return max(min_val, min(max_val, value))
