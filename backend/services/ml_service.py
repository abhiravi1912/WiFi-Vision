"""
WiFi Vision — ML Inference Service
Orchestrates the full pipeline: CSI → features → prediction.
"""
import logging
import numpy as np
from typing import Optional

from services.csi_service import CSIProcessor
from ml_model import MLModelManager, extract_features

logger = logging.getLogger(__name__)


class MLService:
    """End-to-end service connecting CSI processing to ML inference."""

    def __init__(self, model_dir: str, window_size: int = 100, overlap: int = 50):
        self.processor = CSIProcessor(window_size=window_size, overlap=overlap)
        self.manager = MLModelManager(model_dir)
        self._prediction_count = 0

    @property
    def model_loaded(self) -> bool:
        return self.manager.is_loaded

    def load_model(self, filename: str = 'model.pkl') -> bool:
        """Load a pre-trained model from disk."""
        return self.manager.load(filename)

    def process_frame(self, subcarriers: list[float]) -> Optional[dict]:
        """
        Process a single CSI frame. Returns a prediction dict when a
        complete window has been accumulated and processed.
        """
        window = self.processor.add_frame(subcarriers)
        if window is None:
            return None

        # Apply signal processing
        filtered = self.processor.butterworth_filter(window)
        cleaned = self.processor.hampel_filter(filtered)

        # Extract features
        features = extract_features(cleaned)

        # Run inference
        if not self.manager.is_loaded:
            logger.debug('No model loaded, skipping prediction.')
            return None

        try:
            result = self.manager.predict(features)
            self._prediction_count += 1
            return result
        except Exception as e:
            logger.error(f'Prediction failed: {e}')
            return None

    def get_stats(self) -> dict:
        return {
            'model_loaded': self.model_loaded,
            'model_name': self.manager.model_name,
            'prediction_count': self._prediction_count,
        }
