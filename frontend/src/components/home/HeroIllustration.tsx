/**
 * Custom SVG illustration for the Hero section.
 * Depicts the WiFi Vision system flow:
 * Laptop Dashboard → ESP32 Receiver → Wi-Fi Signals → ESP32 Transmitter → Human Movement
 */
export default function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 480 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-md mx-auto"
      aria-label="WiFi Vision system diagram showing data flow from human movement through ESP32 devices to a monitoring dashboard"
    >
      {/* ── Dashboard / Laptop ── */}
      <g>
        {/* Laptop body */}
        <rect x="140" y="24" width="200" height="130" rx="8" className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-700" strokeWidth="1.5" />
        {/* Screen content - mini dashboard */}
        <rect x="154" y="38" width="172" height="96" rx="4" className="fill-slate-50 dark:fill-slate-900" />
        {/* Mini chart bars */}
        <rect x="164" y="92" width="12" height="32" rx="2" className="fill-accent/30" />
        <rect x="182" y="78" width="12" height="46" rx="2" className="fill-accent/50" />
        <rect x="200" y="84" width="12" height="40" rx="2" className="fill-accent/40" />
        <rect x="218" y="70" width="12" height="54" rx="2" className="fill-accent/60" />
        <rect x="236" y="60" width="12" height="64" rx="2" className="fill-accent" />
        <rect x="254" y="74" width="12" height="50" rx="2" className="fill-accent/50" />
        <rect x="272" y="82" width="12" height="42" rx="2" className="fill-accent/40" />
        <rect x="290" y="68" width="12" height="56" rx="2" className="fill-accent/55" />
        {/* Status dots */}
        <circle cx="170" cy="48" r="3" className="fill-emerald-400" />
        <circle cx="182" cy="48" r="3" className="fill-amber-400" />
        <circle cx="194" cy="48" r="3" className="fill-slate-300 dark:fill-slate-600" />
        {/* Label */}
        <rect x="250" y="44" width="60" height="8" rx="2" className="fill-slate-200 dark:fill-slate-700" />
        {/* Laptop base */}
        <rect x="120" y="154" width="240" height="10" rx="4" className="fill-slate-200 dark:fill-slate-700" />
      </g>

      {/* ── Arrow: Dashboard → Receiver ── */}
      <line x1="240" y1="168" x2="240" y2="195" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4 3" />
      <polygon points="234,193 240,203 246,193" className="fill-slate-300 dark:fill-slate-600" />

      {/* ── ESP32 Receiver ── */}
      <g>
        <rect x="170" y="206" width="140" height="52" rx="6" className="fill-white dark:fill-slate-800 stroke-accent" strokeWidth="1.5" />
        {/* Chip icon */}
        <rect x="184" y="220" width="24" height="24" rx="3" className="fill-accent/10 stroke-accent/40" strokeWidth="1" />
        <rect x="192" y="228" width="8" height="8" rx="1" className="fill-accent" />
        {/* Pins */}
        <line x1="184" y1="228" x2="178" y2="228" className="stroke-accent/40" strokeWidth="1" />
        <line x1="184" y1="236" x2="178" y2="236" className="stroke-accent/40" strokeWidth="1" />
        <line x1="208" y1="228" x2="214" y2="228" className="stroke-accent/40" strokeWidth="1" />
        <line x1="208" y1="236" x2="214" y2="236" className="stroke-accent/40" strokeWidth="1" />
        {/* Text */}
        <text x="222" y="229" className="fill-primary dark:fill-white text-[11px] font-semibold" fontFamily="Inter, sans-serif">ESP32</text>
        <text x="222" y="244" className="fill-slate-400 text-[9px]" fontFamily="Inter, sans-serif">Receiver</text>
        {/* Antenna */}
        <line x1="296" y1="232" x2="316" y2="216" className="stroke-accent" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="316" cy="214" r="3" className="fill-accent/30 stroke-accent" strokeWidth="1" />
      </g>

      {/* ── Wi-Fi Signal Waves ── */}
      <g className="opacity-60">
        {/* Wave arcs between receiver and transmitter */}
        <path d="M 210 280 Q 240 295 270 280" className="stroke-accent" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M 195 290 Q 240 310 285 290" className="stroke-accent" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" begin="0.3s" repeatCount="indefinite" />
        </path>
        <path d="M 180 300 Q 240 325 300 300" className="stroke-accent" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" begin="0.6s" repeatCount="indefinite" />
        </path>
        <path d="M 195 318 Q 240 340 285 318" className="stroke-accent" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" begin="0.9s" repeatCount="indefinite" />
        </path>
        <path d="M 210 328 Q 240 345 270 328" className="stroke-accent" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" begin="1.2s" repeatCount="indefinite" />
        </path>
      </g>

      {/* ── Signal disruption indicator ── */}
      <text x="330" y="305" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-medium" fontFamily="Inter, sans-serif">CSI</text>
      <text x="324" y="318" className="fill-slate-400 dark:fill-slate-500 text-[9px]" fontFamily="Inter, sans-serif">Signal</text>

      {/* ── ESP32 Transmitter ── */}
      <g>
        <rect x="170" y="350" width="140" height="52" rx="6" className="fill-white dark:fill-slate-800 stroke-emerald-500" strokeWidth="1.5" />
        {/* Chip icon */}
        <rect x="184" y="364" width="24" height="24" rx="3" className="fill-emerald-50 dark:fill-emerald-900/30 stroke-emerald-400/40" strokeWidth="1" />
        <rect x="192" y="372" width="8" height="8" rx="1" className="fill-emerald-500" />
        {/* Pins */}
        <line x1="184" y1="372" x2="178" y2="372" className="stroke-emerald-400/40" strokeWidth="1" />
        <line x1="184" y1="380" x2="178" y2="380" className="stroke-emerald-400/40" strokeWidth="1" />
        <line x1="208" y1="372" x2="214" y2="372" className="stroke-emerald-400/40" strokeWidth="1" />
        <line x1="208" y1="380" x2="214" y2="380" className="stroke-emerald-400/40" strokeWidth="1" />
        {/* Text */}
        <text x="222" y="373" className="fill-primary dark:fill-white text-[11px] font-semibold" fontFamily="Inter, sans-serif">ESP32</text>
        <text x="222" y="388" className="fill-slate-400 text-[9px]" fontFamily="Inter, sans-serif">Transmitter</text>
        {/* Antenna */}
        <line x1="296" y1="376" x2="316" y2="360" className="stroke-emerald-500" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="316" cy="358" r="3" className="fill-emerald-400/30 stroke-emerald-500" strokeWidth="1" />
      </g>

      {/* ── Arrow: Transmitter → Human ── */}
      <line x1="240" y1="406" x2="240" y2="433" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4 3" />
      <polygon points="234,431 240,441 246,431" className="fill-slate-300 dark:fill-slate-600" />

      {/* ── Human figure (minimal) ── */}
      <g>
        {/* Head */}
        <circle cx="240" cy="458" r="10" className="fill-slate-200 dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
        {/* Body */}
        <line x1="240" y1="468" x2="240" y2="492" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" strokeLinecap="round" />
        {/* Arms */}
        <line x1="224" y1="478" x2="256" y2="480" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" strokeLinecap="round" />
        {/* Legs */}
        <line x1="240" y1="492" x2="228" y2="510" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" strokeLinecap="round" />
        <line x1="240" y1="492" x2="252" y2="510" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="2" strokeLinecap="round" />
        {/* Motion lines */}
        <line x1="264" y1="470" x2="274" y2="468" className="stroke-accent/40" strokeWidth="1" strokeLinecap="round" />
        <line x1="266" y1="480" x2="278" y2="480" className="stroke-accent/40" strokeWidth="1" strokeLinecap="round" />
        <line x1="264" y1="490" x2="274" y2="492" className="stroke-accent/40" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* ── Vertical connecting line (faint) ── */}
      <line x1="240" y1="260" x2="240" y2="275" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="240" y1="333" x2="240" y2="348" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* ── Side labels ── */}
      <text x="90" y="88" className="fill-slate-400 dark:fill-slate-500 text-[9px] font-medium" fontFamily="Inter, sans-serif">Monitoring</text>
      <text x="90" y="100" className="fill-slate-400 dark:fill-slate-500 text-[9px]" fontFamily="Inter, sans-serif">Dashboard</text>

      <text x="90" y="236" className="fill-slate-400 dark:fill-slate-500 text-[9px]" fontFamily="Inter, sans-serif">CSI Extraction</text>

      <text x="86" y="380" className="fill-slate-400 dark:fill-slate-500 text-[9px]" fontFamily="Inter, sans-serif">Signal Source</text>

      <text x="90" y="482" className="fill-slate-400 dark:fill-slate-500 text-[9px]" fontFamily="Inter, sans-serif">Human Activity</text>
    </svg>
  );
}
