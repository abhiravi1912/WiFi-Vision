import { Link } from 'react-router-dom';
import { FileText, Mail } from 'lucide-react';
import { GitHubIcon } from '../shared/SocialIcons';
import Logo from '../shared/Logo';

const FOOTER_LINKS = {
  Product: [
    { label: 'Technology', path: '/technology' },
    { label: 'Architecture', path: '/architecture' },
    { label: 'Applications', path: '/applications' },
    { label: 'Hardware', path: '/hardware' },
    { label: 'Dashboard', path: '/dashboard' },
  ],
  Resources: [
    { label: 'Documentation', path: '/documentation' },
    { label: 'GitHub', path: 'https://github.com', external: true },
    { label: 'Project Report', path: '/documentation' },
  ],
  Team: [
    { label: 'Our Team', path: '/team' },
    { label: 'VIT-AP University', path: 'https://vitap.ac.in', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-surface-border dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container-default py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <Logo size="sm" />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              AI-powered, privacy-preserving indoor human sensing using Wi-Fi CSI and Machine Learning.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon className="w-4 h-4" />
              </a>
              <a
                href="/documentation"
                className="p-2 rounded-md text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Documentation"
              >
                <FileText className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@wifivision.dev"
                className="p-2 rounded-md text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Contact"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-surface-border dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} WiFi Vision · VIT-AP University
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Built with ESP32, Python & React
          </p>
        </div>
      </div>
    </footer>
  );
}
