// app/ConditionalHeader.tsx
"use client";

import { usePathname } from 'next/navigation';
import Header from '../header/header';

export function ConditionalHeader() {
  const pathname = usePathname();

  const noHeaderRoutes = ['/'];

  if (noHeaderRoutes.includes(pathname)) {
    return null;
  }

  return <Header />;
}