"""
WiFi Vision — Machine Learning Model Manager
Supports Random Forest, SVM, and XGBoost classifiers for activity recognition
and zone-level indoor localization.
"""
import os
import json
import logging
import math
import pickle
from typing import Optional

import numpy as np

logger = logging.getLogger(__name__)

try:
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.svm import SVC
    from sklearn.preprocessing import StandardScaler
    from sklearn.model_selection import StratifiedKFold, cross_val_score
    from sklearn.metrics import classification_report
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False
    logger.warning('scikit-learn not installed. ML features will be unavailable.')

try:
    from xgboost import XGBClassifier
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    logger.info('XGBoost not installed. XGBoost classifier will be unavailable.')


# ── Feature extraction ──────────────────────────────────────────────────────

def extract_features(window: np.ndarray) -> np.ndarray:
    """
    Extract statistical features from a CSI window.

    Args:
        window: numpy array of shape (num_frames, num_subcarriers).
                Typically (100, 64) for a 100-frame window with 64 subcarriers.

    Returns:
        1-D feature vector of shape (num_subcarriers * num_features,).
    """
    features = []
    for sc in range(window.shape[1]):
        col = window[:, sc]
        features.extend([
            np.mean(col),
            np.std(col),
            np.var(col),
            float(_skewness(col)),
            float(_kurtosis(col)),
            np.median(col),
            np.percentile(col, 75) - np.percentile(col, 25),  # IQR
            np.max(col) - np.min(col),  # Range
            float(np.sum(np.abs(np.fft.fft(col)) ** 2)),  # Spectral energy
        ])
    return np.array(features)


def _skewness(x: np.ndarray) -> float:
    n = len(x)
    if n < 3:
        return 0.0
    mean = np.mean(x)
    std = np.std(x)
    if std == 0:
        return 0.0
    return float(np.mean(((x - mean) / std) ** 3))


def _kurtosis(x: np.ndarray) -> float:
    n = len(x)
    if n < 4:
        return 0.0
    mean = np.mean(x)
    std = np.std(x)
    if std == 0:
        return 0.0
    return float(np.mean(((x - mean) / std) ** 4) - 3)


# ── Model Manager ────────────────────────────────────────────────────────────

class MLModelManager:
    """Manages ML model training, persistence, and inference."""

    ACTIVITIES = ['Walking', 'Standing', 'Sitting', 'Empty']
    ZONES = ['Zone A', 'Zone B', 'Zone C', 'Zone D']

    def __init__(self, model_dir: str):
        self.model_dir = model_dir
        os.makedirs(model_dir, exist_ok=True)
        self.model = None
        self.scaler = None
        self.model_name = ''
        self.classes: list[str] = []

    @property
    def is_loaded(self) -> bool:
        return self.model is not None

    def create_model(self, model_type: str = 'random_forest'):
        """
        Instantiate a new, untrained classifier.

        Supported types: 'random_forest', 'svm', 'xgboost'
        """
        if not SKLEARN_AVAILABLE:
            raise RuntimeError('scikit-learn is required for ML features.')

        if model_type == 'random_forest':
            self.model = RandomForestClassifier(
                n_estimators=200,
                max_depth=20,
                min_samples_split=5,
                random_state=42,
                n_jobs=-1,
            )
        elif model_type == 'svm':
            self.model = SVC(
                kernel='rbf',
                C=10,
                gamma='scale',
                probability=True,
                random_state=42,
            )
        elif model_type == 'xgboost':
            if not XGBOOST_AVAILABLE:
                raise RuntimeError('XGBoost is not installed.')
            self.model = XGBClassifier(
                n_estimators=300,
                learning_rate=0.1,
                max_depth=6,
                random_state=42,
                use_label_encoder=False,
                eval_metric='mlogloss',
            )
        else:
            raise ValueError(f'Unknown model type: {model_type}')

        self.model_name = model_type
        self.scaler = StandardScaler()
        logger.info(f'Created {model_type} model.')

    def train(self, X: np.ndarray, y: np.ndarray) -> dict:
        """
        Train the current model on feature matrix X and labels y.

        Returns a dict with cross-validation accuracy and per-class metrics.
        """
        if self.model is None:
            raise RuntimeError('No model created. Call create_model() first.')

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Cross-validation
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        scores = cross_val_score(self.model, X_scaled, y, cv=cv, scoring='accuracy')

        # Final training on all data
        self.model.fit(X_scaled, y)
        self.classes = list(self.model.classes_)

        result = {
            'model': self.model_name,
            'cv_accuracy_mean': round(float(np.mean(scores)), 4),
            'cv_accuracy_std': round(float(np.std(scores)), 4),
            'num_samples': len(y),
            'num_features': X.shape[1],
            'classes': self.classes,
        }
        logger.info(f'Training complete: {result}')
        return result

    def predict(self, features: np.ndarray) -> dict:
        """
        Predict activity from a single feature vector.

        Returns dict with predicted class and confidence.
        """
        if self.model is None or self.scaler is None:
            raise RuntimeError('Model not loaded. Train or load a model first.')

        features_2d = features.reshape(1, -1)
        features_scaled = self.scaler.transform(features_2d)

        prediction = self.model.predict(features_scaled)[0]
        confidence = 0.0

        if hasattr(self.model, 'predict_proba'):
            probas = self.model.predict_proba(features_scaled)[0]
            confidence = float(np.max(probas))

        return {
            'activity': str(prediction),
            'confidence': round(confidence, 4),
            'model': self.model_name,
        }

    def save(self, filename: str = 'model.pkl') -> str:
        """Persist the model and scaler to disk."""
        path = os.path.join(self.model_dir, filename)
        with open(path, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler,
                'model_name': self.model_name,
                'classes': self.classes,
            }, f)
        logger.info(f'Model saved to {path}')
        return path

    def load(self, filename: str = 'model.pkl') -> bool:
        """Load a previously trained model from disk."""
        path = os.path.join(self.model_dir, filename)
        if not os.path.exists(path):
            logger.warning(f'Model file not found: {path}')
            return False

        with open(path, 'rb') as f:
            data = pickle.load(f)

        self.model = data['model']
        self.scaler = data['scaler']
        self.model_name = data.get('model_name', 'unknown')
        self.classes = data.get('classes', [])
        logger.info(f'Model loaded from {path}')
        return True
