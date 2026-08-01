import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';
import { Cpu, Monitor, Wifi, Usb, BatteryCharging, Cable } from 'lucide-react';

interface HardwareItem {
  icon: React.ReactNode;
  name: string;
  role: string;
  description: string;
  specs: { label: string; value: string }[];
  color: string;
}

const HARDWARE: HardwareItem[] = [
  {
    icon: <Cpu className="w-6 h-6" />,
    name: 'ESP32-WROOM-32',
    role: 'Transmitter',
    description: 'Configured as the signal source, this ESP32 continuously broadcasts Wi-Fi frames using the ESP-NOW protocol at a configurable packet rate.',
    specs: [
      { label: 'MCU', value: 'Dual-core Xtensa LX6 @ 240 MHz' },
      { label: 'Flash', value: '4 MB' },
      { label: 'SRAM', value: '520 KB' },
      { label: 'Wi-Fi', value: '802.11 b/g/n, 2.4 GHz' },
      { label: 'Protocol', value: 'ESP-NOW (peer-to-peer)' },
      { label: 'Power', value: '5V via USB or 3.3V regulated' },
    ],
    color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    name: 'ESP32-WROOM-32',
    role: 'Receiver',
    description: 'Captures incoming Wi-Fi frames from the transmitter and extracts CSI metadata using the ESP-IDF CSI callback API, streaming data over USB serial.',
    specs: [
      { label: 'MCU', value: 'Dual-core Xtensa LX6 @ 240 MHz' },
      { label: 'CSI Output', value: '64 subcarriers per frame' },
      { label: 'Frame Rate', value: 'Up to 100 Hz' },
      { label: 'Serial Baud', value: '921600' },
      { label: 'Data Format', value: 'CSV over UART' },
      { label: 'Firmware', value: 'ESP-IDF v5.x with CSI enabled' },
    ],
    color: 'text-accent bg-accent/5',
  },
  {
    icon: <Monitor className="w-6 h-6" />,
    name: 'Laptop / Host Computer',
    role: 'Processing Hub',
    description: 'Runs the Flask backend, ML inference pipeline, and the React dashboard. Reads serial data from the ESP32 receiver and processes it in real time.',
    specs: [
      { label: 'OS', value: 'Windows / Linux / macOS' },
      { label: 'Python', value: '3.9+' },
      { label: 'Dependencies', value: 'Flask, scikit-learn, PySerial' },
      { label: 'Min RAM', value: '4 GB' },
      { label: 'USB Ports', value: '1× for ESP32 Receiver' },
      { label: 'Browser', value: 'Chrome / Firefox (for dashboard)' },
    ],
    color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20',
  },
  {
    icon: <Wifi className="w-6 h-6" />,
    name: 'Wi-Fi Router',
    role: 'Optional',
    description: 'A standard Wi-Fi router can optionally serve as the transmitter in place of the second ESP32, simplifying hardware requirements for basic setups.',
    specs: [
      { label: 'Standard', value: '802.11n or later' },
      { label: 'Band', value: '2.4 GHz' },
      { label: 'Role', value: 'Alternative signal source' },
      { label: 'Note', value: 'ESP-NOW provides more control' },
    ],
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
  },
  {
    icon: <Usb className="w-6 h-6" />,
    name: 'USB Interface',
    role: 'Data Link',
    description: 'Micro-USB or USB-C cable connects the ESP32 receiver to the host laptop, providing both power and a serial data channel for CSI streaming.',
    specs: [
      { label: 'Connector', value: 'Micro-USB (most ESP32 boards)' },
      { label: 'Protocol', value: 'USB CDC / CP2102 UART bridge' },
      { label: 'Baud Rate', value: '921600 bps' },
    ],
    color: 'text-slate-500 bg-slate-100 dark:bg-slate-800',
  },
  {
    icon: <BatteryCharging className="w-6 h-6" />,
    name: 'Power Supply',
    role: 'Power Source',
    description: 'Each ESP32 board is powered via USB from the host laptop or a standard 5V USB power adapter. No external power circuitry is required.',
    specs: [
      { label: 'Voltage', value: '5V USB' },
      { label: 'Current Draw', value: '~80 mA active Wi-Fi TX' },
      { label: 'Alternative', value: '3.7V LiPo with regulator' },
    ],
    color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',
  },
];

function HardwareCard({ item }: { item: HardwareItem }) {
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div
      className="card group cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setShowSpecs(true)}
      onMouseLeave={() => setShowSpecs(false)}
      onFocus={() => setShowSpecs(true)}
      onBlur={() => setShowSpecs(false)}
      tabIndex={0}
      role="button"
      aria-label={`${item.name} — ${item.role}. Hover for specifications.`}
    >
      {/* Default view */}
      <div className={`transition-opacity duration-200 ${showSpecs ? 'opacity-0' : 'opacity-100'}`}>
        <div className={`p-2.5 w-fit rounded-lg ${item.color} mb-4`}>{item.icon}</div>
        <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">{item.name}</h3>
        <p className="text-xs font-medium text-accent mb-3">{item.role}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
      </div>

      {/* Specs overlay */}
      <div
        className={`absolute inset-0 p-6 bg-white dark:bg-slate-900 transition-opacity duration-200 ${showSpecs ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-3">Specifications</p>
        <dl className="space-y-2">
          {item.specs.map((s) => (
            <div key={s.label} className="flex items-start justify-between gap-2">
              <dt className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{s.label}</dt>
              <dd className="text-[11px] text-primary dark:text-white text-right font-medium">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Hardware() {
  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container-default">
        <SectionHeader
          label="Hardware"
          title="System components"
          description="WiFi Vision requires minimal hardware — two ESP32 boards, a laptop, and USB cables. Hover over each component to view technical specifications."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {HARDWARE.map((item, i) => (
            <motion.div
              key={`${item.name}-${item.role}`}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <HardwareCard item={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
