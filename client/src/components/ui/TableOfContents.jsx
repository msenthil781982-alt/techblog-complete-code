
import React, { useEffect, useState } from 'react';
import { FiList } from 'react-icons/fi';

const TableOfContents = ({ contentRef }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = Array.from(contentRef.current.querySelectorAll('h2, h3'));

    const items = elements.map((elem, index) => {
      if (!elem.id) {
        elem.id = `heading-${index}-${elem.textContent
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .slice(0, 30)}`;
      }

      return {
        id: elem.id,
        text: elem.textContent,
        level: elem.tagName.toLowerCase(), 
      };
    });

    setHeadings(items);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: 0.1,
      }
    );

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [contentRef]);

  if (headings.length < 2) return null;

  const scrollToHeading = (id) => {
    const target = document.getElementById(id);
    if (target) {
      const topOffset = 85; 
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveId(id);
    }
  };

  return (
    <nav className="bg-slate-50/70 rounded-xl p-5 border border-gray-200/60 text-xs" aria-label="Table of Contents">
      <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-gray-800 mb-3 pb-2 border-b border-gray-200/50">
        <FiList className="w-4 h-4 text-neutral-500" />
        <span>Table of Contents</span>
      </div>

      <ul className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          const isH3 = item.level === 'h3';

          return (
            <li
              key={item.id}
              className={`${isH3 ? 'pl-3' : 'pl-0'} leading-snug`}
            >
              <button
                type="button"
                onClick={() => scrollToHeading(item.id)}
                className={`text-left transition-colors duration-150 line-clamp-2 ${
                  isActive
                    ? 'text-neutral-900 font-bold'
                    : 'text-gray-600 hover:text-gray-900 font-medium'
                }`}
              >
                {item.text}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;
