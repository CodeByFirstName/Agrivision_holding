import React from 'react';

const Title = ({ title, subtitle, textColor = '#094363', barColor = '#094363' }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3">
        <div className="w-1 h-6 rounded-sm" style={{ backgroundColor: barColor }} />
        <h2 className="text-2xl md:text-3xl font-bold" style={{ color: textColor }}>
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="mt-2 text-base md:text-lg" style={{ color: textColor, opacity: 0.85 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Title;
