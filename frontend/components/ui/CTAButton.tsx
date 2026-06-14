import type { ButtonHTMLAttributes } from 'react';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  primary: 'bg-orange text-white hover:bg-orange/90 focus-visible:ring-orange border border-orange',
  ghost:   'bg-transparent text-navy hover:bg-navy/5 focus-visible:ring-navy border border-navy',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

// Note: white-on-orange (#fff on #E8590C) = ~3.2:1 contrast.
// Passes WCAG AA for large/bold text (≥18px or ≥14px bold, threshold 3:1).
// Use only for large CTA buttons; not suitable for small body text.
export function CTAButton({ variant = 'primary', size = 'md', className = '', children, ...props }: CTAButtonProps) {
  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center font-heading font-semibold rounded-lg
        transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {children}
    </button>
  );
}
