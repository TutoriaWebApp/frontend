import React from "react";
import Link from "next/link"

export default function Header() {
  return (
    <header className="flex flex-row [grid-area:header] bg-surface-card">
        <h1>Tutoria Web</h1>
        <nav className="flex flex-row">
          <ul>
            <li>
              <Link href={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link href={"/perfil"}>
                Perfil
              </Link>
            </li>
            <li>
              <Link href={"/buscar"}>
                Perfil
              </Link>
            </li>
            <li>
              <Link href={"/conquistas"}>
                Conquistas
              </Link>
            </li>
            <li>
              <Link href={"/solicitacoes"}>
                Conquistas
              </Link>
            </li>
            <li>
              <Link href={"/chat"}>
                Chat
              </Link>
            </li>
          </ul>
        </nav>
    </header>
  );
}