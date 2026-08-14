import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  PlayCircle,
  BrainCircuit,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Sparkles,
  Sliders,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AppShellProps {
  children?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, logout, activeResumeProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/prepare', label: 'Prepare', icon: Target },
    { path: '/app/resume', label: 'My Resume', icon: FileText },
    { path: '/app/interview', label: 'Mock Interview', icon: PlayCircle },
    { path: '/app/aptitude', label: 'Aptitude Practice', icon: BrainCircuit },
    { path: '/app/performance', label: 'Performance', icon: TrendingUp },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex bg-[#FDFCF9] text-[#121212] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[248px] bg-[#121212] text-white shrink-0 sticky top-0 h-screen select-none justify-between py-8 px-5 border-r border-white/5">
        <div>
          {/* Brand Header */}
          <NavLink
            to="/app/dashboard"
            className="flex items-center gap-2.5 mb-8 text-left group focus:outline-none px-1"
          >
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-950/50 group-hover:scale-105 transition-transform">
              I
            </div>
            <div>
              <span className="text-xl font-semibold tracking-tight text-white flex items-center gap-1.5 font-serif">
                InterviewAI
              </span>
            </div>
          </NavLink>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold shadow-sm'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer & User Profile */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <NavLink
            to="/app/settings"
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              location.pathname === '/app/settings'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 text-white/60" />
            <span>Settings</span>
          </NavLink>

          {/* User info card */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0">
              {user?.full_name
                ? user.full_name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'AH'}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold text-white truncate">
                {user?.full_name || 'Alex Harrison'}
              </span>
              <span className="text-[10px] font-mono text-white/40 truncate">
                {activeResumeProfile ? 'Resume Grounded' : 'FastAPI Connected'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#FDFCF9]">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-[#121212] text-white border-b border-white/10 p-4 sticky top-0 z-40 flex items-center justify-between">
          <NavLink
            to="/app/dashboard"
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
              I
            </div>
            <span className="font-semibold text-white tracking-tight font-serif">InterviewAI</span>
          </NavLink>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white/80 hover:bg-white/10 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-xs bg-[#121212] text-white h-full flex flex-col p-6 shadow-2xl justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-sm">
                      I
                    </div>
                    <span className="font-semibold font-serif">InterviewAI</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="py-6 space-y-1 overflow-y-auto">
                  {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive
                            ? 'bg-white/10 text-white font-semibold'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                  <NavLink
                    to="/app/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      location.pathname === '/app/settings'
                        ? 'bg-white/10 text-white font-semibold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </NavLink>
                </nav>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
                    {user?.full_name ? user.full_name[0].toUpperCase() : 'AH'}
                  </div>
                  <div className="text-xs text-white/60">
                    <div className="text-white font-medium">{user?.full_name || 'Alex Harrison'}</div>
                    <div className="text-[10px] text-white/40 truncate">{user?.email || 'FastAPI User'}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-white/60 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
