'use client';

import { useEffect } from 'react';

export default function ThemeBoot() {
  useEffect(() => {
    const t = localStorage.getItem('theme') || 'light';
    document.documentElement.dataset.theme = t;
  }, []);
  return null;
}
