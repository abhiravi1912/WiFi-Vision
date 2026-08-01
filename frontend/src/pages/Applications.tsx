import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';
import { Home, HeartPulse, ShieldCheck, Building2, UsersRound, Zap, AlertTriangle, GraduationCap } from 'lucide-react';

const APPLICATIONS = [
  {
    icon: <Home className="w-5 h-5" />,
    title: 'Smart Homes',
    desc: 'Automate lighting, HVAC, and appliance control based on room occupancy and resident activity patterns—without installing cameras in private living spaces.',
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    title: 'Healthcare & Elderly Care',
    desc: 'Monitor patient movement and detect falls or prolonged inactivity in hospital rooms, assisted living facilities, and home care environments non-intrusively.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Security Monitoring',
    desc: 'Detect unauthorized presence in restricted areas using passive Wi-Fi sensing, providing an invisible perimeter that does not rely on visible cameras or motion sensors.',
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    title: 'Smart Offices',
    desc: 'Track meeting room utilization, desk occupancy, and workspace activity to optimize office space planning and resource allocation.',
  },
  {
    icon: <UsersRound className="w-5 h-5" />,
    title: 'Occupancy Detection',
    desc: 'Count and estimate the number of people in a defined zone for crowd management, retail analytics, and building management systems.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Energy Optimization',
    desc: 'Reduce energy consumption by automatically adjusting building systems based on real-time occupancy data from Wi-Fi sensing rather than scheduled timers.',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Emergency Response',
    desc: 'Locate occupants during building evacuations or emergencies when visibility is limited, using Wi-Fi signals that penetrate smoke and darkness.',
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: 'Research & Smart Buildings',
    desc: 'Provide researchers with a low-cost, reproducible platform for studying human-computer interaction, ambient intelligence, and indoor sensing algorithms.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45 } }),
};

export default function Applications() {
  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container-default">
        <SectionHeader
          label="Applications"
          title="Where WiFi Vision can be deployed"
          description="Camera-free sensing opens deployment opportunities in environments where visual surveillance is impractical, prohibited, or undesirable."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {APPLICATIONS.map((app, i) => (
            <motion.div
              key={app.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
              variants={fadeUp}
              className="card group hover:border-accent/20 dark:hover:border-accent/20 transition-colors"
            >
              <div className="p-2 w-fit rounded-lg bg-accent/5 text-accent mb-4 group-hover:bg-accent/10 transition-colors">
                {app.icon}
              </div>
              <h3 className="text-sm font-semibold text-primary dark:text-white mb-2">{app.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{app.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
