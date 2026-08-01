"""
WiFi Vision — CSI Processing Service
Handles real-time CSI data processing, filtering, and windowing.
"""
import numpy as np
from typing import Optional
from collections import deque


class CSIProcessor:
    """Processes raw CSI subcarrier data through filtering and windowing."""

    def __init__(self, window_size: int = 100, overlap: int = 50, num_subcarriers: int = 64):
        self.window_size = window_size
        self.overlap = overlap
        self.num_subcarriers = num_subcarriers
        self._buffer: deque = deque(maxlen=window_size * 2)
        self._frame_count = 0

    def add_frame(self, subcarriers: list[float]) -> Optional[np.ndarray]:
        """
        Add a single CSI frame to the buffer.
        Returns a windowed numpy array when enough frames have accumulated.
        """
        if len(subcarriers) != self.num_subcarriers:
            # Pad or truncate to expected size
            subcarriers = (subcarriers + [0.0] * self.num_subcarriers)[:self.num_subcarriers]

        self._buffer.append(subcarriers)
        self._frame_count += 1

        # Check if we have a complete window
        step = self.window_size - self.overlap
        if self._frame_count >= self.window_size and self._frame_count % step == 0:
            window_data = list(self._buffer)[-self.window_size:]
            return np.array(window_data)

        return None

    @staticmethod
    def butterworth_filter(data: np.ndarray, cutoff: float = 10.0, fs: float = 50.0, order: int = 5) -> np.ndarray:
        """
        Apply a Butterworth low-pass filter to each subcarrier column.
        Uses a simple moving average as a fallback when scipy is unavailable.
        """
        try:
            from scipy.signal import butter, filtfilt
            nyq = 0.5 * fs
            normalized_cutoff = cutoff / nyq
            b, a = butter(order, normalized_cutoff, btype='low')
            filtered = np.zeros_like(data)
            for col in range(data.shape[1]):
                filtered[:, col] = filtfilt(b, a, data[:, col])
            return filtered
        except ImportError:
            # Fallback: simple moving average
            kernel_size = max(3, int(fs / cutoff))
            filtered = np.zeros_like(data)
            for col in range(data.shape[1]):
                filtered[:, col] = np.convolve(
                    data[:, col],
                    np.ones(kernel_size) / kernel_size,
                    mode='same',
                )
            return filtered

    @staticmethod
    def hampel_filter(data: np.ndarray, window_size: int = 5, threshold: float = 3.0) -> np.ndarray:
        """Replace outliers detected by the Hampel identifier."""
        filtered = data.copy()
        half = window_size // 2
        for col in range(data.shape[1]):
            for i in range(half, len(data) - half):
                window = data[i - half:i + half + 1, col]
                median = np.median(window)
                mad = 1.4826 * np.median(np.abs(window - median))
                if mad > 0 and abs(data[i, col] - median) / mad > threshold:
                    filtered[i, col] = median
        return filtered

    def reset(self) -> None:
        """Clear the frame buffer."""
        self._buffer.clear()
        self._frame_count = 0
