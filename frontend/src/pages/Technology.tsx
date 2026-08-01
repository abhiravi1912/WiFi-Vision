import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';
import { Radio, Cpu, BarChart3, Brain, ShieldCheck } from 'lucide-react';

const TOPICS = [
  {
    icon: <Radio className="w-5 h-5" />,
    title: 'Wi-Fi Channel State Information',
    content: `Channel State Information (CSI) describes how a Wi-Fi signal propagates between a transmitter and receiver across multiple subcarriers. Unlike RSSI, which provides a single aggregate signal strength value, CSI captures fine-grained amplitude and phase information for each OFDM subcarrier in the Wi-Fi channel. In a 20 MHz 802.11n channel, this yields 64 subcarrier measurements per frame—each sensitive to multipath reflections, scattering, and absorption caused by objects and people in the environment. When a human moves through the signal path, the CSI pattern changes measurably. These perturbations are the foundation of WiFi Vision's sensing capability.`,
    detail: 'CSI provides 64 subcarrier amplitudes per frame at up to 100 Hz, enabling sub-wavelength sensitivity to environmental changes.',
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: 'ESP32 Platform',
    content: `The ESP32-WROOM-32 is a dual-core microcontroller with integrated Wi-Fi and Bluetooth, manufactured by Espressif Systems. WiFi Vision uses two ESP32 boards: one configured as a transmitter that continuously sends Wi-Fi frames using the ESP-NOW protocol, and one as a receiver that captures incoming frames and extracts CSI metadata. Espressif's ESP-IDF framework exposes a callback-based CSI API that reports subcarrier amplitudes, RSSI, noise floor, and channel information for every received frame. The extracted data is streamed over USB serial to a host computer for processing. This architecture keeps per-node cost below $5 while supporting frame rates above 50 Hz.`,
    detail: 'ESP-NOW enables direct peer-to-peer communication without requiring a Wi-Fi access point, reducing infrastructure dependencies.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Signal Processing Pipeline',
    content: `Raw CSI data contains noise from hardware imperfections, multi-path interference, and environmental drift. WiFi Vision applies a multi-stage signal processing pipeline before feeding data to ML models. First, subcarrier amplitudes are extracted from the raw complex CSI values. A Butterworth low-pass filter removes high-frequency noise. Hampel filtering detects and replaces outlier samples. Sliding-window segmentation groups frames into fixed-length windows (typically 50–100 frames), and statistical features—mean, variance, skewness, kurtosis, and frequency-domain energy—are computed for each window. Principal Component Analysis (PCA) optionally reduces dimensionality before classification.`,
    detail: 'Feature extraction produces a compact vector per window, reducing 64×100 raw values to ~30 engineered features.',
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Machine Learning Models',
    content: `WiFi Vision supports multiple classification algorithms for activity recognition and localization. Random Forest serves as the primary classifier due to its robustness to noise and ability to handle high-dimensional feature spaces without extensive hyperparameter tuning. Support Vector Machines (SVM) with RBF kernels are used as an alternative, particularly effective when the number of training samples is limited. Gradient-boosted trees (XGBoost) provide the highest accuracy in offline benchmarks but require more computational resources. All models are trained using scikit-learn on labeled CSI datasets collected during controlled experiments, with stratified k-fold cross-validation to evaluate generalization.`,
    detail: 'Random Forest achieves 92%+ accuracy on 4-class activity recognition with 200 training samples per class.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Privacy-Preserving Sensing',
    content: `Camera-based monitoring systems inherently capture identifiable visual information, raising significant privacy concerns in residential, healthcare, and workplace environments. WiFi Vision operates exclusively on radio-frequency signal metadata—subcarrier amplitudes and phase values—that cannot reconstruct images or identify individuals. The sensing data contains no biometric, facial, or body-shape information. This makes WiFi Vision compliant with privacy-sensitive deployment scenarios where visual surveillance is unacceptable. The system can detect that a person is present and classify their activity without ever recording what they look like, what they are wearing, or any other personally identifiable attribute.`,
    detail: 'CSI data is fundamentally non-visual: no image, video, or biometric information is captured at any point.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Technology() {
  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container-default">
        <SectionHeader
          label="Technology"
          title="How WiFi Vision works"
          description="An overview of the signal processing, machine learning, and hardware components that enable camera-free human sensing."
        />

        <div className="space-y-6">
          {TOPICS.map((topic, i) => (
            <motion.div
              key={topic.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={fadeUp}
              className={`card p-8 md:p-10 grid md:grid-cols-[1fr_280px] gap-8 items-start ${i % 2 === 1 ? 'md:grid-cols-[280px_1fr]' : ''}`}
            >
              <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-accent/5 text-accent">{topic.icon}</div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{topic.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {topic.content}
                </p>
              </div>
              <div className={`bg-slate-50 dark:bg-slate-800/50 rounded-lg p-5 border border-surface-border dark:border-slate-700/50 ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Key Insight</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{topic.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
