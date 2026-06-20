'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="font-body text-xs font-bold text-navy/50 uppercase tracking-widest mb-3">Share</p>
      <div className="flex flex-col gap-2">
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-body text-sm text-navy/70 hover:text-green-600 transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">W</span>
          WhatsApp
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-body text-sm text-navy/70 hover:text-blue-700 transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">in</span>
          LinkedIn
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-body text-sm text-navy/70 hover:text-blue-600 transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-bold">f</span>
          Facebook
        </a>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-2 font-body text-sm text-navy/70 hover:text-navy transition-colors text-left"
        >
          <span className="w-7 h-7 rounded-full bg-navy/10 flex items-center justify-center text-navy text-xs">
            {copied ? '✓' : '⎘'}
          </span>
          {copied ? 'Copied!' : 'Copy link'}
        </button>
      </div>
    </div>
  );
}
