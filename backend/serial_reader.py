"""
WiFi Vision — ESP32 Serial Reader
Reads CSI_DATA packets from the ESP32 receiver over USB serial.
Parses raw CSI bytes into subcarrier amplitudes and stores them in SQLite.
"""
import threading
import time
import math
import logging
from typing import Optional, Callable

logger = logging.getLogger(__name__)

try:
    import serial
    SERIAL_AVAILABLE = True
except ImportError:
    SERIAL_AVAILABLE = False
    logger.warning('PySerial not installed. Serial communication will be unavailable.')


class CSIPacket:
    """Parsed CSI data packet from ESP32."""

    def __init__(self, raw_line: str):
        self.timestamp = time.time()
        self.valid = False
        self.rssi = 0.0
        self.noise_floor = -90.0
        self.channel = 6
        self.bandwidth = 20
        self.mac = ''
        self.subcarriers: list[float] = []
        self._parse(raw_line)

    def _parse(self, line: str) -> None:
        """
        Parse a CSI_DATA line from the ESP32 firmware.
        Expected format: CSI_DATA,<mac>,<rssi>,<noise_floor>,<channel>,<bw>,<len>,<data...>
        The <data> section contains comma-separated signed integers representing
        I/Q pairs: I0,Q0,I1,Q1,...,I63,Q63
        """
        try:
            if not line.startswith('CSI_DATA'):
                return

            parts = line.strip().split(',')
            if len(parts) < 8:
                return

            self.mac = parts[1]
            self.rssi = float(parts[2])
            self.noise_floor = float(parts[3])
            self.channel = int(parts[4])
            self.bandwidth = int(parts[5])
            data_len = int(parts[6])

            # Parse I/Q pairs and compute amplitudes
            raw_iq = [int(x) for x in parts[7:]]
            num_pairs = min(len(raw_iq) // 2, 64)
            self.subcarriers = []

            for i in range(num_pairs):
                real = raw_iq[2 * i]
                imag = raw_iq[2 * i + 1]
                amplitude = math.sqrt(real ** 2 + imag ** 2)
                self.subcarriers.append(round(amplitude, 2))

            # Pad to 64 subcarriers if needed
            while len(self.subcarriers) < 64:
                self.subcarriers.append(0.0)

            self.valid = True

        except (ValueError, IndexError) as e:
            logger.debug(f'Failed to parse CSI line: {e}')
            self.valid = False


class SerialReader:
    """
    Manages serial communication with the ESP32 receiver.
    Runs in a background thread, reading and parsing CSI_DATA packets.
    """

    def __init__(self, port: str, baud: int = 921600, timeout: float = 1.0):
        self.port = port
        self.baud = baud
        self.timeout = timeout
        self._serial: Optional['serial.Serial'] = None
        self._thread: Optional[threading.Thread] = None
        self._running = False
        self._packet_count = 0
        self._callbacks: list[Callable[[CSIPacket], None]] = []
        self._last_packet: Optional[CSIPacket] = None

    @property
    def is_connected(self) -> bool:
        return self._serial is not None and self._serial.is_open

    @property
    def packet_count(self) -> int:
        return self._packet_count

    @property
    def last_packet(self) -> Optional[CSIPacket]:
        return self._last_packet

    def on_packet(self, callback: Callable[[CSIPacket], None]) -> None:
        """Register a callback to be invoked for each valid CSI packet."""
        self._callbacks.append(callback)

    def start(self) -> bool:
        """Open serial port and begin reading in a background thread."""
        if not SERIAL_AVAILABLE:
            logger.error('PySerial is not installed. Run: pip install pyserial')
            return False

        if self._running:
            logger.warning('Serial reader is already running.')
            return True

        try:
            self._serial = serial.Serial(
                port=self.port,
                baudrate=self.baud,
                timeout=self.timeout,
            )
            self._running = True
            self._thread = threading.Thread(target=self._read_loop, daemon=True)
            self._thread.start()
            logger.info(f'Serial reader started on {self.port} at {self.baud} baud.')
            return True
        except serial.SerialException as e:
            logger.error(f'Failed to open serial port {self.port}: {e}')
            return False

    def stop(self) -> None:
        """Stop the reader thread and close the serial port."""
        self._running = False
        if self._thread:
            self._thread.join(timeout=3.0)
        if self._serial and self._serial.is_open:
            self._serial.close()
        logger.info('Serial reader stopped.')

    def _read_loop(self) -> None:
        """Background thread: continuously reads lines from the serial port."""
        while self._running and self._serial and self._serial.is_open:
            try:
                raw = self._serial.readline()
                if not raw:
                    continue

                line = raw.decode('utf-8', errors='replace').strip()
                if not line.startswith('CSI_DATA'):
                    continue

                packet = CSIPacket(line)
                if packet.valid:
                    self._packet_count += 1
                    self._last_packet = packet
                    for cb in self._callbacks:
                        try:
                            cb(packet)
                        except Exception as e:
                            logger.error(f'Callback error: {e}')

            except Exception as e:
                logger.error(f'Serial read error: {e}')
                time.sleep(0.1)
