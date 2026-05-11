import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Compass,
  User,
  Menu,
  X,
  Music
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VerificationBanner from './VerificationBanner';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Projects' },
    { path: '/feed', icon: Compass, label: 'Feed' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <VerificationBanner />
      <div className="flex flex-1">
        {/* Mobile menu button */}
        <motion.button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-5 left-5 z-50 p-3 rounded-2xl glass-panel"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: (sidebarOpen || isDesktop) ? 0 : -320 }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed lg:static inset-y-0 left-0 z-40 w-72 lg:w-80 flex flex-col glass-panel lg:border-r border-white/[0.06] lg:rounded-none"
        >
          {/* Logo */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2.5 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Music size={26} className="text-white" />
              </motion.div>
              <h1 className="text-2xl font-bold gradient-text tracking-tight">Symphonia</h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item, i) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-link ${active ? 'active' : ''}`}
                  >
                    <Icon size={22} strokeWidth={1.5} />
                    <span className="text-[15px]">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-white/[0.03]">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full py-2.5 rounded-2xl text-sm font-medium bg-white/5 hover:bg-white/10 border border-white/10 text-text-secondary hover:text-text-primary transition-all duration-200"
            >
              Sign Out
            </button>
          </div>
        </motion.aside>

        {/* Overlay for mobile */}
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-6 lg:p-10 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
