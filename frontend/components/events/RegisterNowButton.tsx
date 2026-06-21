'use client';

interface Props { label?: string }

export function RegisterNowButton({ label = 'Register Now →' }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="flex-shrink-0 font-heading font-semibold text-white gradient-sunrise rounded-lg px-7 py-3 text-sm hover:shadow-glow-orange transition-all duration-200"
    >
      {label}
    </button>
  );
}
