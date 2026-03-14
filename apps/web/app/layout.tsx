import React from "react";

import "./normalize.css"
import "./grid.css"
import "@repo/ui/styles";
import "./globals.css";

import Header from "@repo/ui/Header/Header";
import Footer from "@repo/ui/Footer/Footer";

import { NotificationContextProvider } from "@repo/ui/contexts/NotificationContext/NotificationContext";

import type { Metadata } from "next";

import {Montserrat, Quicksand, Inter} from "next/font/google"


export const metadata: Metadata = {
  title: "TutoriaWeb - Aprenda, ensine, evolua!",
  description:
    "Se conecte com tutores e aprendizes para aprender e ensinar, conseguir conquistas e níveis e aprender de forma gamificada!",
};

const montserrat = Montserrat({subsets: ["latin"], variable: "--font-montserrat"})
const quicksand = Quicksand({subsets: ["latin"], variable: "--font-quicksand"})
const inter = Inter({subsets: ["latin"], variable: "--font-inter"})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={`${inter.variable} ${montserrat.variable} ${quicksand.variable}`}>
      <body className="font-inter">
        <NotificationContextProvider>
          <Header/>
          {children}
          <Footer/>
        </NotificationContextProvider>
      </body>
    </html>
  );
}
