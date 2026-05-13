"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname } from "next/navigation";

import { LogOutAction } from "@repo/services/authAction";

export default function Header() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const notLoggedInRoutes = [
    "/",
    "/criar-conta",
    "/esqueci-senha",
    `/redefinir-senha/:path*/:path*`,
  ];

  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Perfil", href: "/perfil" },
    { name: "Conquistas", href: "/conquistas" },
    { name: "Buscar Tutores", href: "/buscar-tutores" },
    { name: "Solicitações", href: "/solicitacoes" },
    { name: "Chat", href: "/chat" },
  ];

  useEffect(() => {
    if (notLoggedInRoutes.includes(pathname)) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
    }
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className="
        [grid-area:header] 
        bg-surface-card 
        flex 
        flex-row
        items-center 
        justify-between 
        border-b 
        border-slate-200 
        sticky 
        top-0 
        z-10
    "
    >
      <Link
        href="/"
        className="
        flex 
        items-center 
        ml-6
      "
      >
        <Image
          alt="Tutor e Aprendiz se conectando por telas"
          src="/logo.svg"
          width="50"
          height="50"
        />
        <h1
          className="
          ml-2 
          text-brand-secondary 
          font-medium 
          font-montserrat 
          text-2xl
        "
        >
          Tutoria<span className="text-brand-primary">Web</span>
        </h1>
      </Link>
      {loggedIn && (
        <>
          {/* Botão Hambúrguer (Mobile/Tablet) */}
          <button
            className="
              lg:hidden 
              mr-6 
              text-slate-600 
              hover:text-brand-primary 
              transition-colors
            "
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </button>

          {/* Navegação Desktop */}
          <nav className="
            hidden 
            lg:block 
            mr-6
          ">
            <ul className="
              flex 
              flex-row 
              items-center
            ">
              {navLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <li
                    className="
                      p-4
                      px-6
                      text-slate-600 
                      hover:text-brand-primary 
                      hover:font-bold
                      hover:bg-gray-100
                      rounded-xl
                      transition-all
                      2xl:text-xl
                      "
                  >
                    {link.name}
                  </li>
                </Link>
              ))}
              <li
                className="
                p-4
                px-6
                text-slate-600 
                hover:text-brand-primary 
                hover:font-bold
                hover:bg-gray-100
                rounded-xl
                transition-all
                2xl:text-xl
                cursor-pointer
                "
                onClick={LogOutAction}
              >
                Sair da Conta
              </li>
            </ul>
          </nav>

          {/* Menu Mobile Overlay */}
          {isMenuOpen && (
            <div className="
              lg:hidden 
              fixed 
              inset-0 
              top-20 
              bg-white 
              z-[90] 
              animate-in 
              slide-in-from-right 
              duration-300
            ">
              <nav className="
                flex 
                flex-col 
                p-6 
                space-y-2
              ">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div
                      className={`
                        p-4 
                        rounded-xl 
                        font-medium 
                        text-lg
                      text-slate-600
                      `}
                    >
                      {link.name}
                    </div>
                  </Link>
                ))}
                <div
                  className="
                    p-4 
                    rounded-xl 
                    font-medium 
                    text-lg 
                    active:bg-rose-50 
                    cursor-pointer
                  text-slate-600
                  "
                  onClick={() => {
                    LogOutAction();
                    setIsMenuOpen(false);
                  }}
                >
                  Sair da Conta
                </div>
              </nav>
            </div>
          )}
        </>
      )}
    </header>
  );
}
