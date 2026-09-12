import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, padding = true, onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding ? 'p-6' : ''} ${hover ? 'hover:shadow-lg hover:-translate-y-1 hover:border-gold/30 transition-all duration-300 cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  );
};
