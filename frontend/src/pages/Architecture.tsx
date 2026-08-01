import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';
import { Radio, Waves, Users, Cpu, BarChart3, Brain, Monitor, Cog } from 'lucide-react';

const STEPS = [
  { icon: <Radio className="w-5 h-5" />, title: 'ESP32 Transmitter', desc: 'Continuously broadcasts Wi-Fi frames using ESP-NOW protocol at a configurable rate (default 50 Hz).', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
  { icon: <Waves className="w-5 h-5" />, title: 'Wi-Fi Signal Propagation', desc: 'Transmitted frames propagate through the indoor environment, interacting with walls, furniture, and human bodies via multipath reflection.', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { icon: <Users className="w-5 h-5" />, title: 'Human Interaction', desc: 'Human movement and presence alter the multipath signal profile—changing subcarrier amplitudes and phases in the received CSI.', color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
  { icon: <Cpu className="w-5 h-5" />, title: 'ESP32 Receiver', desc: 'Captures each incoming frame and extracts raw CSI data including 64 subcarrier amplitudes, RSSI, and noise floor via the ESP-IDF CSI API.', color: 'text-accent bg-accent/5' },
  { icon: <Cog className="w-5 h-5" />, title: 'CSI Extraction & Parsing', desc: 'Raw CSI bytes are parsed into complex values, converted to amplitude/phase, and transmitted over USB serial as structured CSV packets.', color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Signal Processing', desc: 'Butterworth filtering, outlier removal, windowing, and statistical feature extraction produce ML-ready feature vectors from raw CSI streams.', color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20' },
  { icon: <Brain className="w-5 h-5" />, title: 'Machine Learning', desc: 'Trained Random Forest, SVM, or XGBoost models classify the feature vector into activity categories and localization zones.', color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20' },
  { icon: <Monitor className="w-5 h-5" />, title: 'Activity & Location Prediction', desc: 'The predicted activity, confidence score, and estimated zone are emitted as structured JSON for downstream consumption.', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
  { icon: <Monitor className="w-5 h-5" />, title: 'Live Dashboard', desc: 'A React-based monitoring interface displays real-time CSI waveforms, RSSI trends, activity timeline, and system health metrics.', color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
];

export default function Architecture() {
  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container-default">
        <SectionHeader
          label="System Architecture"
          title="End-to-end data pipeline"
          description="From Wi-Fi frame transmission to real-time activity prediction—a nine-stage processing pipeline."
        />

        <div className="max-w-2xl mx-auto">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative"
            >
              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <div className="absolute left-5 top-14 w-px h-[calc(100%-2rem)] bg-surface-border dark:bg-slate-800" />
              )}

              <div className="flex gap-5 pb-8 relative">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 relative z-10 ${step.color}`}>
                  {step.icon}
                </div>

                {/* Content */}
                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 font-mono">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-semibold text-primary dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
