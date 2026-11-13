
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiCheck, FiAlertCircle, FiInfo, FiLoader, FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';
import { subscribeNewsletter } from '../../services/newsletterService';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setFeedbackMessage('');

    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus('invalid');
      setFeedbackMessage('Invalid email.');
      return;
    }

    try {
      setStatus('loading');
      const res = await subscribeNewsletter(trimmed);
      setStatus('success');
      setFeedbackMessage(res?.message || 'Successfully subscribed!');
      setEmail('');
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.toLowerCase().includes('already subscribed')) {
        setStatus('already');
        setFeedbackMessage('Already subscribed.');
      } else if (errMsg.toLowerCase().includes('invalid email')) {
        setStatus('invalid');
        setFeedbackMessage('Invalid email.');
      } else {
        setStatus('error');
        setFeedbackMessage(errMsg || 'Something went wrong.');
      }
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 font-sans border-t border-slate-800">

      <div className="border-b border-slate-800">
        <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-white mb-2">
                Stay updated with modern engineering insights
              </h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Get our weekly digest of software architecture, AI advancements, and engineering best practices delivered straight to your inbox.
              </p>
            </div>

            <div className="w-full lg:w-auto min-w-[340px] max-w-md">
              {status === 'success' ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-800/80 text-emerald-200 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <FiCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feedbackMessage || 'Successfully subscribed!'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFeedbackMessage('');
                    }}
                    className="text-xs text-emerald-400 hover:text-emerald-300 underline sm:ml-auto cursor-pointer"
                  >
                    Subscribe another
                  </button>
                </div>
              ) : status === 'already' ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm">
                  <div className="flex items-center gap-2 font-medium">
                    <FiInfo className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{feedbackMessage || 'Already subscribed.'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFeedbackMessage('');
                    }}
                    className="text-xs text-slate-400 hover:text-white underline sm:ml-auto cursor-pointer"
                  >
                    Try another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col w-full">
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                    <div className="relative w-full">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                      <input
                        type="email"
                        required
                        value={email}
                        disabled={status === 'loading'}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'invalid' || status === 'error') {
                            setStatus('idle');
                            setFeedbackMessage('');
                          }
                        }}
                        placeholder="Enter your work email..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-800/80 border border-slate-700 text-white rounded-lg placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 disabled:opacity-60"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full sm:w-auto shrink-0 px-5 py-2.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium text-sm rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'loading' && <FiLoader className="w-4 h-4 animate-spin" />}
                      <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                    </button>
                  </div>
                  {status === 'invalid' && (
                    <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{feedbackMessage || 'Invalid email.'}</span>
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                      <FiAlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{feedbackMessage || 'Something went wrong.'}</span>
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center">
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                TechBlog
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              A modern engineering and technology publication designed for developers, architects, and technology leaders.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FiTwitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FiGithub className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 hover:text-white hover:bg-slate-700 transition-colors">
                <FiLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Explore Topics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/blog?category=software-development" className="hover:text-white transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/blog?category=artificial-intelligence-machine-learning" className="hover:text-white transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/blog?category=web-and-mobile-app-development" className="hover:text-white transition-colors">
                  Web & Mobile Apps
                </Link>
              </li>
              <li>
                <Link to="/blog?category=cybersecurity" className="hover:text-white transition-colors">
                  Cybersecurity
                </Link>
              </li>
              <li>
                <Link to="/blog?category=cloud-computing" className="hover:text-white transition-colors">
                  Cloud Computing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/blog?featured=true" className="hover:text-white transition-colors">
                  Featured Stories
                </Link>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  XML Sitemap
                </a>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Author Console
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-sm text-white uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-gray-500">Tech Stack: MERN</span>
              </li>
              <li>
                <span className="text-gray-500">Node.js + Express 4</span>
              </li>
              <li>
                <span className="text-gray-500">React 18 + Tailwind</span>
              </li>
              <li>
                <span className="text-gray-500">MongoDB Atlas / Mongoose</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} TechBlog. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
