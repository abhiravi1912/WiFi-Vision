import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Shield, Cpu, Activity, MapPin, Zap, Radio } from 'lucide-react';
import { GitHubIcon } from '../components/shared/SocialIcons';
import HeroIllustration from '../components/home/HeroIllustration';

const FEATURES = [
  { icon: <Shield className="w-5 h-5" />, title: 'Camera-Free Monitoring', desc: 'Detects human presence using Wi-Fi signals, eliminating cameras entirely from the sensing pipeline.' },
  { icon: <Activity className="w-5 h-5" />, title: 'Activity Recognition', desc: 'Classifies activities such as walking, standing, and sitting in real time using trained ML models.' },
  { icon: <MapPin className="w-5 h-5" />, title: 'Indoor Localization', desc: 'Estimates which zone a person occupies based on spatial variations in CSI subcarrier amplitudes.' },
  { icon: <Cpu className="w-5 h-5" />, title: 'Low-Cost Hardware', desc: 'Runs on two ESP32-WROOM boards costing under $10 combined, making deployment economically viable.' },
  { icon: <Zap className="w-5 h-5" />, title: 'Real-Time Inference', desc: 'Processes CSI frames and outputs predictions within milliseconds on standard laptop hardware.' },
  { icon: <Radio className="w-5 h-5" />, title: 'Scalable Deployment', desc: 'Additional transmitter-receiver pairs can extend coverage to multi-room and multi-floor environments.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container-default">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="section-label">Wi-Fi CSI × Machine Learning</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary dark:text-white leading-[1.08] mb-6">
                WiFi Vision
              </h1>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mb-4">
                AI-Powered Camera-Free Indoor Human Sensing using Wi-Fi CSI
              </p>
              <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mb-8">
                Transform ordinary Wi-Fi signals into intelligent sensing technology. WiFi Vision detects human presence, recognizes activities, and estimates indoor location using Wi-Fi Channel State Information and Machine Learning—without capturing images or compromising privacy.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/dashboard" className="btn-primary">
                  Live Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/documentation" className="btn-secondary">
                  <FileText className="w-4 h-4" />
                  Documentation
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <GitHubIcon className="w-4 h-4" />
                  GitHub
                </a>
              </div>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="hidden lg:block"
            >
              <HeroIllustration />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="container-default">
        <div className="border-t border-surface-border dark:border-slate-800" />
      </div>

      {/* ── Features grid ── */}
      <section className="section-spacing">
        <div className="container-default">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <p className="section-label">Capabilities</p>
            <h2 className="section-title">Built for intelligent indoor sensing</h2>
            <p className="section-description mx-auto mt-4">
              A complete system that turns ambient Wi-Fi into a passive sensor, detecting human activity and position with no optical hardware.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={fadeUp}
                className="card group hover:border-accent/20 dark:hover:border-accent/20 transition-colors"
              >
                <div className="p-2 w-fit rounded-lg bg-accent/5 text-accent mb-4 group-hover:bg-accent/10 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-primary dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="pb-20">
        <div className="container-default">
          <div className="bg-primary dark:bg-slate-800 rounded-xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">See WiFi Vision in action</h3>
              <p className="text-sm text-slate-400 max-w-md">
                Explore the live monitoring dashboard to see real-time CSI waveforms, activity predictions, and system telemetry.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors shrink-0"
            >
              Open Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
