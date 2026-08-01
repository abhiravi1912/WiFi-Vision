"""
WiFi Vision — SQLite Database
Manages CSI data storage, activity logs, and system state.
"""
import sqlite3
import os
import json
from datetime import datetime
from typing import Optional


class Database:
    def __init__(self, db_path: str):
        self.db_path = db_path
        os.makedirs(os.path.dirname(db_path), exist_ok=True)

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute('PRAGMA journal_mode=WAL')
        return conn

    def initialize(self) -> None:
        """Create tables if they do not exist."""
        conn = self._connect()
        try:
            conn.executescript('''
                CREATE TABLE IF NOT EXISTS csi_data (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    subcarriers TEXT NOT NULL,
                    rssi REAL NOT NULL,
                    noise_floor REAL,
                    channel INTEGER DEFAULT 6,
                    bandwidth INTEGER DEFAULT 20,
                    mac_address TEXT
                );

                CREATE TABLE IF NOT EXISTS activity_log (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    activity TEXT NOT NULL,
                    confidence REAL NOT NULL,
                    zone TEXT,
                    model TEXT DEFAULT 'random_forest',
                    rssi REAL,
                    features TEXT
                );

                CREATE TABLE IF NOT EXISTS system_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    message TEXT
                );

                CREATE INDEX IF NOT EXISTS idx_csi_timestamp ON csi_data(timestamp);
                CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON activity_log(timestamp);
            ''')
            conn.commit()
        finally:
            conn.close()

    def insert_csi(self, subcarriers: list, rssi: float, noise_floor: float = -90.0,
                   channel: int = 6, bandwidth: int = 20, mac: str = '') -> int:
        """Insert a single CSI frame into the database."""
        conn = self._connect()
        try:
            cursor = conn.execute(
                'INSERT INTO csi_data (timestamp, subcarriers, rssi, noise_floor, channel, bandwidth, mac_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (datetime.utcnow().isoformat(), json.dumps(subcarriers), rssi, noise_floor, channel, bandwidth, mac)
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    def get_latest_csi(self, count: int = 1) -> list:
        """Retrieve the most recent CSI frames."""
        conn = self._connect()
        try:
            rows = conn.execute(
                'SELECT * FROM csi_data ORDER BY id DESC LIMIT ?', (count,)
            ).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def insert_activity(self, activity: str, confidence: float, zone: str = '',
                        model: str = 'random_forest', rssi: float = 0.0,
                        features: Optional[list] = None) -> int:
        """Log a predicted activity."""
        conn = self._connect()
        try:
            cursor = conn.execute(
                'INSERT INTO activity_log (timestamp, activity, confidence, zone, model, rssi, features) VALUES (?, ?, ?, ?, ?, ?, ?)',
                (datetime.utcnow().isoformat(), activity, confidence, zone, model, rssi,
                 json.dumps(features) if features else None)
            )
            conn.commit()
            return cursor.lastrowid
        finally:
            conn.close()

    def get_activity_history(self, limit: int = 50) -> list:
        """Retrieve recent activity predictions."""
        conn = self._connect()
        try:
            rows = conn.execute(
                'SELECT * FROM activity_log ORDER BY id DESC LIMIT ?', (limit,)
            ).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def get_latest_activity(self) -> Optional[dict]:
        """Get the most recent activity prediction."""
        results = self.get_activity_history(limit=1)
        return results[0] if results else None

    def get_stats(self) -> dict:
        """Get database statistics."""
        conn = self._connect()
        try:
            csi_count = conn.execute('SELECT COUNT(*) FROM csi_data').fetchone()[0]
            activity_count = conn.execute('SELECT COUNT(*) FROM activity_log').fetchone()[0]
            db_size = os.path.getsize(self.db_path) / (1024 * 1024) if os.path.exists(self.db_path) else 0
            return {
                'csi_records': csi_count,
                'activity_records': activity_count,
                'db_size_mb': round(db_size, 2),
            }
        finally:
            conn.close()

    def log_event(self, event_type: str, message: str) -> None:
        """Log a system event."""
        conn = self._connect()
        try:
            conn.execute(
                'INSERT INTO system_events (timestamp, event_type, message) VALUES (?, ?, ?)',
                (datetime.utcnow().isoformat(), event_type, message)
            )
            conn.commit()
        finally:
            conn.close()
