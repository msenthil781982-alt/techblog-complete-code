
import React from 'react';
import { FiTwitter, FiLinkedin, FiGithub, FiGlobe } from 'react-icons/fi';

const AuthorBio = ({ author }) => {
  if (!author) return null;

  return (
    <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-gray-100 my-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">

      {author.avatar ? (
        <img
          src={author.avatar}
          alt={author.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-sm shrink-0"
        />
      ) : (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center font-heading font-bold text-xl sm:text-2xl border-2 border-white shadow-sm shrink-0">
          {author.initials || author.name?.slice(0, 2).toUpperCase() || 'AU'}
        </div>
      )}

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-0.5">
              Written By
            </span>
            <h4 className="font-heading font-bold text-lg text-gray-900">
              {author.name}
            </h4>
          </div>

          {author.social && (
            <div className="flex items-center justify-center sm:justify-end gap-2 text-gray-400">
              {author.social.twitter && (
                <a
                  href={author.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full hover:bg-white hover:text-gray-900 transition-colors"
                  aria-label="Author Twitter"
                >
                  <FiTwitter className="w-4 h-4" />
                </a>
              )}
              {author.social.linkedin && (
                <a
                  href={author.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full hover:bg-white hover:text-[#0077b5] transition-colors"
                  aria-label="Author LinkedIn"
                >
                  <FiLinkedin className="w-4 h-4" />
                </a>
              )}
              {author.social.github && (
                <a
                  href={author.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full hover:bg-white hover:text-gray-900 transition-colors"
                  aria-label="Author GitHub"
                >
                  <FiGithub className="w-4 h-4" />
                </a>
              )}
              {author.social.website && (
                <a
                  href={author.social.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-full hover:bg-white hover:text-brand-600 transition-colors"
                  aria-label="Author Website"
                >
                  <FiGlobe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">
          {author.bio ||
            `${author.name} is a contributing technical author and engineering specialist at TechBlog, writing about software systems, architecture, and technology.`}
        </p>
      </div>
    </div>
  );
};

export default AuthorBio;
