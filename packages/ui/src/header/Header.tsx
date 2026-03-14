import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const loggedIn = false;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Perfil", href: "/perfil" },
    { name: "Conquistas", href: "/conquistas" },
    { name: "Buscar Tutores", href: "/buscar" },
    { name: "Solicitações", href: "/solicitacoes" },
    { name: "Chat", href: "/chat" },
  ];

  return (
    <header
      className="[grid-area:header] bg-surface-card flex flex-row
    items-center justify-between border-b border-slate-200 sticky top-0 z-10"
    >
      <Link href="/" className="flex items-center ml-6">
        <Image
          alt="Tutor e Aprendiz se conectando por telas"
          src="/logo.svg"
          width="50"
          height="50"
        />
        <h1 className=" ml-2 text-brand-secondary font-medium font-montserrat text-2xl">
          Tutoria<span className="text-brand-primary">Web</span>
        </h1>
      </Link>
      {loggedIn && (
        <nav>
          <ul>
            {navLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <li
                  className="
                    inline 
                    p-4
                    pl-6
                    pr-6
                    text-slate-600 
                    hover:text-brand-primary 
                    hover:font-bold
                    hover:bg-gray-200
                    hover:rounded-xl
                    transition-all
                    font-inter
                    "
                >
                  {link.name}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
