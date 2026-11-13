
import React from 'react';

const SIZES = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-3',
  lg: 'w-12 h-12 border-4',
};

const Spinner = ({ size = 'md', className = '', label = 'Loading content...' }) => {
  return (
    <div className="flex items-center justify-center p-4" role="status" aria-label={label}>
      <div
        className={`${SIZES[size] || SIZES.md} border-[#2563eb] border-t-transparent rounded-full animate-spin ${className}`}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default Spinner;
