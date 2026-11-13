
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiLogOut, FiLayout, FiEdit3, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>

      <header className="fixed top-0 left-0 right-0 z-50 w-full h-16 bg-white border-b border-[#dddddd] shadow-sm">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">

            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="font-heading font-bold text-xl text-[#222222] tracking-tight hover:text-[#2563eb] transition-colors"
              >
                TechBlog
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#222222]">
                <Link to="/" className="hover:text-[#2563eb] transition-colors">
                  Home
                </Link>
                <Link to="/blog" className="hover:text-[#2563eb] transition-colors">
                  All Articles
                </Link>
                <Link
                  to="/submit-blog"
                  className="inline-flex items-center gap-1.5 text-[#2563eb] font-semibold hover:underline"
                >
                  <FiEdit3 className="w-4 h-4" />
                  <span>Submit Blog</span>
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-blogs"
                    className="inline-flex items-center gap-1.5 hover:text-[#2563eb] transition-colors"
                  >
                    <FiBookOpen className="w-4 h-4" />
                    <span>My Blogs</span>
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded text-[#222222] hover:bg-[#f4f4f4] transition-colors"
                aria-label="Toggle Search"
              >
                <FiSearch className="w-4 h-4" />
              </button>

              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-[#dddddd]">
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold bg-[#222222] text-white hover:bg-[#333333] transition-colors"
                    >
                      <FiLayout className="w-3.5 h-3.5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <span className="text-xs font-medium text-[#666666]">
                    {user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#222222] hover:text-[#2563eb] p-1 rounded hover:bg-[#f4f4f4] transition-colors"
                    title="Sign Out"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-[#2563eb] text-white px-3.5 py-1.5 rounded hover:bg-[#1d4ed8] transition-colors"
                >
                  <span>Login / Register</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded text-[#222222] hover:bg-[#f4f4f4]"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-[#dddddd] bg-white py-3 px-4 shadow-sm animate-fade-in">
            <div className="max-w-content mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666] w-4 h-4" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type keyword or topic and press Enter..."
                  className="w-full pl-10 pr-10 py-2 text-sm bg-[#f4f4f4] border border-[#dddddd] rounded focus:outline-none focus:border-[#2563eb] text-[#222222] placeholder-[#666666]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#222222]"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#dddddd] bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#222222] hover:text-[#2563eb]"
            >
              Home
            </Link>
            <Link
              to="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#222222] hover:text-[#2563eb]"
            >
              All Articles
            </Link>
            <Link
              to="/submit-blog"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-[#2563eb] hover:underline"
            >
              ✍️ Submit Blog
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-blogs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-[#222222] hover:text-[#2563eb]"
              >
                📁 My Blogs
              </Link>
            )}

            <div className="pt-3 border-t border-[#dddddd]">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[#666666]">
                    Signed in as <span className="text-[#222222] font-bold">{user?.name}</span>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-semibold text-[#2563eb]"
                    >
                      Admin Dashboard →
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block text-xs text-[#222222] hover:text-[#2563eb] font-semibold py-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm font-semibold text-[#2563eb]"
                >
                  Login / Register →
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
