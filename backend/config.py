"""
WiFi Vision — Configuration
Central configuration for the Flask backend.
"""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'wifi-vision-dev-key')
    DATABASE_PATH = os.path.join(BASE_DIR, 'data', 'wifi_vision.db')
    CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173']

    # Serial communication settings
    SERIAL_PORT = os.environ.get('SERIAL_PORT', 'COM4')
    SERIAL_BAUD = int(os.environ.get('SERIAL_BAUD', 921600))
    SERIAL_TIMEOUT = 1

    # ML model settings
    MODEL_DIR = os.path.join(BASE_DIR, 'models', 'trained')
    DEFAULT_MODEL = 'random_forest'
    WINDOW_SIZE = 100
    WINDOW_OVERLAP = 50
    NUM_SUBCARRIERS = 64

    # CSI collection settings
    CSI_FRAME_RATE = 50  # Expected frames per second
    CSI_BUFFER_SIZE = 1000  # Max frames to buffer before writing to DB
