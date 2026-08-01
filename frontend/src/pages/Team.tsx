import { motion } from 'framer-motion';
import SectionHeader from '../components/shared/SectionHeader';
import { GitHubIcon, LinkedInIcon } from '../components/shared/SocialIcons';

interface Member {
  name: string;
  role: string;
  github?: string;
  linkedin?: string;
}

const TEAM: Member[] = [
  { name: 'Team Member 1', role: 'Project Lead · ML Engineer', github: 'https://github.com', linkedin: 'https://linkedin.com' },
  { name: 'Team Member 2', role: 'Embedded Systems · ESP32 Firmware', github: 'https://github.com', linkedin: 'https://linkedin.com' },
  { name: 'Team Member 3', role: 'Frontend · Dashboard Development', github: 'https://github.com', linkedin: 'https://linkedin.com' },
  { name: 'Team Member 4', role: 'Signal Processing · Data Collection', github: 'https://github.com', linkedin: 'https://linkedin.com' },
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .filter((_, i) => i === 0 || i === name.split(' ').length - 1)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border border-surface-border dark:border-slate-700 flex items-center justify-center mx-auto mb-4">
      <span className="text-lg font-semibold text-slate-400 dark:text-slate-500">{initials}</span>
    </div>
  );
}

export default function Team() {
  return (
    <section className="pt-28 pb-20 md:pt-36">
      <div className="container-default">
        <SectionHeader
          label="Team"
          title="Built by engineers"
          description="WiFi Vision is developed at VIT-AP University as an interdisciplinary engineering project spanning embedded systems, signal processing, and machine learning."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card text-center py-8"
            >
              <Avatar name={member.name} />
              <h3 className="text-sm font-semibold text-primary dark:text-white mb-1">{member.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-2">{member.role}</p>
              <div className="flex items-center justify-center gap-2">
                {member.github && (
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={`${member.name} GitHub`}
                  >
                    <GitHubIcon className="w-4 h-4" />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={`${member.name} LinkedIn`}
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
