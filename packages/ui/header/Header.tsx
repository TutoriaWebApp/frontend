import React from "react";

export default function Header({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <header className="[grid-area:header] bg-surface-card border-2">
        <h1>Tutoria Web</h1>
        <nav>            
        </nav>
    </header>
  );
}