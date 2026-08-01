import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';

const SECTIONS = [
  {
    id: 'objective',
    title: 'Project Objective',
    content: `WiFi Vision aims to demonstrate that standard Wi-Fi infrastructure can be repurposed as a passive sensing modality for detecting, classifying, and localizing human activity indoors. The project addresses the growing demand for non-intrusive occupancy monitoring in smart buildings, healthcare facilities, and residential environments—without deploying cameras or requiring occupants to carry wearable devices.

The specific objectives are:

• Develop an ESP32-based hardware platform capable of transmitting and receiving Wi-Fi frames with CSI extraction at 50+ Hz.
• Build a signal processing pipeline that filters, segments, and extracts statistical features from raw CSI subcarrier data.
• Train and evaluate machine learning classifiers (Random Forest, SVM, XGBoost) for multi-class activity recognition and zone-level indoor localization.
• Create a real-time monitoring dashboard that visualizes CSI waveforms, RSSI trends, and activity predictions.
• Validate system performance across different indoor environments with varying room layouts and occupant counts.`,
  },
  {
    id: 'principle',
    title: 'Working Principle',
    content: `WiFi Vision exploits the physical phenomenon of multipath propagation. When a Wi-Fi transmitter sends a frame, the electromagnetic wave travels from the antenna to the receiver through multiple paths—reflecting off walls, ceilings, furniture, and human bodies. The receiver captures a composite signal that encodes information about all these propagation paths.

Channel State Information (CSI) decomposes this composite signal across the frequency domain. In 802.11n with a 20 MHz channel bandwidth, CSI provides amplitude and phase measurements for 64 individual OFDM subcarriers. Each subcarrier is affected differently by the environment, creating a rich, high-dimensional representation of the wireless channel state.

When a person moves through the signal propagation area, their body absorbs, reflects, and scatters the Wi-Fi waves. This alters the CSI pattern across subcarriers in a manner that correlates with the type of movement (walking vs. standing), the person's position (Zone A vs. Zone B), and the number of occupants. Machine learning models trained on labeled CSI datasets learn these correlations and predict activities from new, unseen CSI observations.`,
  },
  {
    id: 'hardware',
    title: 'Hardware Setup',
    content: `The hardware configuration consists of:

1. ESP32 Transmitter — An ESP32-WROOM-32 development board running custom firmware built with ESP-IDF. The transmitter is configured to broadcast ESP-NOW frames at a fixed rate (default: 50 packets/second). ESP-NOW is chosen over standard Wi-Fi because it enables direct peer-to-peer communication without requiring an access point, provides consistent frame intervals, and allows MAC-level control over packet parameters.

2. ESP32 Receiver — A second ESP32-WROOM-32 board running firmware that registers an ESP-IDF CSI callback function. For every received frame, the callback extracts the raw CSI buffer, RSSI, noise floor, and channel metadata. This data is serialized as a CSV-formatted line and transmitted over UART at 921,600 baud.

3. Host Computer — A laptop running Python reads the serial data stream using PySerial, parses CSI packets, stores them in a SQLite database, and runs the ML inference pipeline. The React-based dashboard connects to the Flask API to display real-time system telemetry.

The transmitter and receiver should be placed 2–5 meters apart in the target monitoring area. The transmitter can be powered by any 5V USB source; the receiver must be connected to the host computer via USB for both power and data.`,
  },
  {
    id: 'software',
    title: 'Software Stack',
    content: `Frontend:
• React 18 with TypeScript for type-safe component architecture
• Vite for fast development builds and hot module replacement
• Tailwind CSS for utility-first, responsive styling
• Recharts for CSI and RSSI data visualization
• Framer Motion for subtle page transitions and entrance animations
• React Router for client-side navigation between pages

Backend:
• Flask as the HTTP API server with Blueprint-based route organization
• PySerial for serial communication with the ESP32 receiver
• SQLite for lightweight, file-based storage of CSI records and activity logs
• Pandas and NumPy for CSI data manipulation and feature extraction
• scikit-learn for training and inference with Random Forest, SVM classifiers
• Flask-CORS for cross-origin request handling between frontend and backend

Firmware:
• ESP-IDF v5.x (Espressif IoT Development Framework)
• ESP-NOW protocol for peer-to-peer frame transmission
• CSI callback API for raw subcarrier data extraction`,
  },
  {
    id: 'ml',
    title: 'Machine Learning Pipeline',
    content: `Data Collection:
CSI data is collected during controlled experiments where participants perform specific activities (walking, standing, sitting, empty room) in predefined zones. Each data collection session typically captures 2–5 minutes of continuous CSI at 50 Hz per activity per zone, yielding approximately 6,000–15,000 frames per class.

Preprocessing:
Raw CSI amplitude values are extracted from complex I/Q samples. A 5th-order Butterworth low-pass filter with a 10 Hz cutoff removes high-frequency noise. Hampel filtering replaces outlier samples caused by hardware glitches. The filtered data is segmented into sliding windows of 100 frames with 50% overlap.

Feature Extraction:
For each window, the following statistical features are computed per subcarrier: mean, standard deviation, variance, skewness, kurtosis, median, interquartile range, max-min range, and frequency-domain energy (via FFT). With 64 subcarriers and 9 features per subcarrier, this produces a 576-dimensional feature vector per window. PCA reduces this to 30–50 principal components.

Classification:
• Random Forest (default): 200 trees, max_depth=20, min_samples_split=5. Provides robust performance with minimal hyperparameter sensitivity.
• SVM: RBF kernel with C=10, gamma='scale'. Effective with limited training data.
• XGBoost: 300 rounds, learning_rate=0.1, max_depth=6. Highest accuracy in offline evaluation.

Evaluation:
5-fold stratified cross-validation is used to estimate generalization accuracy. Typical results: 92–96% accuracy for 4-class activity recognition, 85–90% accuracy for 4-zone localization.`,
  },
  {
    id: 'future',
    title: 'Future Scope',
    content: `1. Multi-Person Detection — Extend the ML pipeline to classify the number of occupants (0, 1, 2, 3+) using CSI variance and spectral entropy features.

2. Through-Wall Sensing — Evaluate system performance when the transmitter and receiver are placed in adjacent rooms, leveraging Wi-Fi signal penetration through drywall and concrete.

3. Continuous Learning — Implement online learning pipelines that adapt the model to environmental changes (furniture rearrangement, new occupants) without full retraining.

4. Edge Deployment — Port lightweight ML models (decision trees, quantized neural networks) directly to the ESP32 receiver, enabling inference without a host computer.

5. Mesh Network Sensing — Deploy multiple transmitter-receiver pairs in a mesh topology to extend coverage across multi-room and multi-floor environments.

6. Gesture Recognition — Investigate fine-grained gesture classification (hand waves, arm movements) using higher frame rates and frequency-domain features.

7. Integration with Smart Home Platforms — Build MQTT/Home Assistant integrations to trigger automations based on WiFi Vision's activity and occupancy predictions.`,
  },
];

export default function Documentation() {
  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container-default">
        <SectionHeader
          label="Documentation"
          title="Technical reference"
          description="Comprehensive documentation covering the project's objectives, architecture, machine learning pipeline, and future development roadmap."
        />

        <div className="grid lg:grid-cols-[220px_1fr] gap-10 max-w-5xl mx-auto">
          {/* Table of contents */}
          <nav className="hidden lg:block sticky top-24 self-start" aria-label="Table of contents">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Contents</p>
            <ul className="space-y-1.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors block py-1"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Content */}
          <div className="space-y-12">
            {SECTIONS.map((section, i) => (
              <motion.article
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="scroll-mt-28"
              >
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-4 pb-3 border-b border-surface-border dark:border-slate-800">
                  {section.title}
                </h3>
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
