# WiFi Vision

**AI-Powered Camera-Free Indoor Human Sensing using Wi-Fi CSI**

WiFi Vision detects human presence, recognizes activities, and estimates indoor location using Wi-Fi Channel State Information (CSI) and Machine Learning — without capturing images or compromising privacy.

---

## Overview

WiFi Vision uses two ESP32-WROOM development boards as a Wi-Fi transmitter and receiver. The system analyzes disturbances in Wi-Fi signals caused by human presence and activities. Collected CSI data is processed through a signal processing pipeline and classified using Machine Learning models to recognize activities such as walking, standing, sitting, occupancy detection, and zone-level indoor localization in real time.

## Architecture

```
ESP32 Transmitter → Wi-Fi Signal → Human Interaction → ESP32 Receiver
                                                            ↓
                                                     CSI Extraction
                                                            ↓
                                                   Signal Processing
                                                            ↓
                                                    Machine Learning
                                                            ↓
                                                   Live Dashboard
```

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- React Router
- Lucide Icons

### Backend
- Python + Flask
- SQLite
- scikit-learn (Random Forest, SVM)
- PySerial (ESP32 communication)
- NumPy / Pandas

### Hardware
- ESP32-WROOM-32 × 2
- USB cables
- Laptop / host computer

## Project Structure

```
wifi-vision/
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── dashboard/   # Dashboard widgets
│   │   │   ├── home/        # Hero illustration
│   │   │   └── shared/      # Section headers, etc.
│   │   ├── pages/           # Page components
│   │   ├── context/         # Theme context
│   │   ├── services/        # API service layer
│   │   └── types/           # TypeScript type definitions
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                 # Flask REST API
│   ├── app.py               # Application factory
│   ├── config.py            # Configuration
│   ├── database.py          # SQLite operations
│   ├── serial_reader.py     # ESP32 serial communication
│   ├── ml_model.py          # ML model management
│   ├── routes/              # API endpoint blueprints
│   ├── services/            # Business logic services
│   ├── models/              # Data schemas
│   ├── utils/               # Helper functions
│   └── requirements.txt
│
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server starts at `http://localhost:5173`.

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask API starts at `http://localhost:5000`.

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `SERIAL_PORT` | `COM4` | Serial port for ESP32 receiver |
| `SERIAL_BAUD` | `921600` | Serial baud rate |
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API URL (frontend) |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/status` | System running status and uptime |
| `GET` | `/api/devices` | Connected device information |
| `GET` | `/api/csi/latest` | Most recent CSI frame |
| `GET` | `/api/activity` | Latest activity prediction |
| `GET` | `/api/history` | Activity prediction history |
| `GET` | `/api/system` | System health metrics |
| `POST` | `/api/start` | Start CSI data collection |
| `POST` | `/api/stop` | Stop CSI data collection |
| `POST` | `/api/train` | Create/train ML model |
| `POST` | `/api/predict` | Run inference on features |

## Pages

| Page | Route | Description |
|---|---|---|
| Home | `/` | Hero section with system overview |
| Technology | `/technology` | CSI, ESP32, ML pipeline explained |
| Architecture | `/architecture` | System data flow diagram |
| Applications | `/applications` | Deployment use cases |
| Hardware | `/hardware` | Component specifications |
| Dashboard | `/dashboard` | Real-time monitoring interface |
| Team | `/team` | Project team members |
| Documentation | `/documentation` | Technical reference |

## Machine Learning

WiFi Vision supports three classifiers:

- **Random Forest** — Default. 200 trees, robust to noise. ~92% accuracy.
- **SVM** — RBF kernel, effective with limited data.
- **XGBoost** — Highest accuracy in offline benchmarks.

Features extracted per CSI window: mean, std, variance, skewness, kurtosis, median, IQR, range, spectral energy — computed across 64 subcarriers.

## License

This project is developed at VIT-AP University for academic and research purposes.
