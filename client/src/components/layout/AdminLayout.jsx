
import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiPlusCircle,
  FiFolder,
  FiExternalLink,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { label: 'Create Article', path: '/admin/posts/new', icon: FiPlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: FiFolder },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">

      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-slate-900 border-b border-slate-800 text-slate-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">

          <div className="flex items-center gap-6 lg:gap-8 min-w-0">

            <Link to="/admin/dashboard" className="flex items-center shrink-0">
              <div>
                <span className="font-heading font-bold text-white text-lg block leading-tight tracking-tight">
                  TechBlog
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin/dashboard'}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t transition-colors border-b-2 ${
                        isActive
                          ? 'border-white text-white bg-slate-800'
                          : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors border-b-2 border-transparent ml-1 rounded-t"
              >
                <FiExternalLink className="w-4 h-4" />
                <span>View Live Blog</span>
                <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  NEW TAB
                </span>
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">

            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-800">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.initials || 'BA'}
                </div>
              )}
              <div className="text-left">
                <span className="font-semibold text-xs text-white block leading-tight truncate max-w-[130px]">
                  {user?.name || 'Blog Admin'}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                  {user?.role?.toUpperCase() || 'ADMIN'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1.5"
                title="Sign out of Console"
                aria-label="Logout"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-slate-800 text-white border-l-2 border-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2.5 rounded text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiExternalLink className="w-4 h-4" />
                <span>View Live Blog</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                NEW TAB
              </span>
            </a>

            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center font-bold text-xs">
                  {user?.initials || 'BA'}
                </div>
                <div className="text-left">
                  <span className="font-semibold text-xs text-white block leading-tight">
                    {user?.name || 'Blog Admin'}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                    {user?.role?.toUpperCase() || 'ADMIN'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
