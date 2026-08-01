import { motion } from 'framer-motion';

interface Props {
  label: string;
  title: string;
  description?: string;
  center?: boolean;
}

export default function SectionHeader({ label, title, description, center = true }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`mb-14 ${center ? 'text-center' : ''}`}
    >
      <p className="section-label">{label}</p>
      <h2 className="section-title">{title}</h2>
      {description && (
        <p className={`section-description mt-4 ${center ? 'mx-auto' : ''}`}>{description}</p>
      )}
    </motion.div>
  );
}
