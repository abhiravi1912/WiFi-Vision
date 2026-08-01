import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../shared/Logo';

const NAV_LINKS = [
  { label: 'Technology', path: '/technology' },
  { label: 'Architecture', path: '/architecture' },
  { label: 'Applications', path: '/applications' },
  { label: 'Hardware', path: '/hardware' },
  { label: 'Team', path: '/team' },
  { label: 'Docs', path: '/documentation' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-surface-border dark:border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-default flex items-center justify-between h-16" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="group" aria-label="WiFi Vision home">
          <Logo size="md" />
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                location.pathname === link.path
                  ? 'text-accent bg-accent/5'
                  : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Link to="/dashboard" className="hidden sm:inline-flex btn-primary text-xs">
            Live Dashboard
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-surface-border dark:border-slate-800">
          <div className="container-default py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.path
                    ? 'text-accent bg-accent/5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/dashboard" className="btn-primary text-xs justify-center mt-2">
              Live Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
