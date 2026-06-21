'use client';

import { useEffect } from 'react';
import { report404 } from '@/lib/api';

/** Fires once on mount to record the missing URL the visitor actually hit. */
export function NotFoundLogger() {
  useEffect(() => {
    report404(window.location.pathname + window.location.search);
  }, []);
  return null;
}
