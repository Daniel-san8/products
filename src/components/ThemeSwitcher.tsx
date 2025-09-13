'use client';

import { Button } from '@heroui/react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  return (
    <Button
      size="sm"
      variant="flat"
      onClick={() => setDark(!dark)}
      className="absolute top-4 right-4"
    >
      {dark ? '☀️ Light' : '🌙 Dark'}
    </Button>
  );
}
