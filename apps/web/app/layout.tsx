import React from "react";

import "./normalize.css"
import "./grid.css"
import "@repo/ui/styles";
import "./globals.css";

//Header
import Header from "@repo/ui/header/Header";
import Footer from "@repo/ui/footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
