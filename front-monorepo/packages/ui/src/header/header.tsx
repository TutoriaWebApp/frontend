import Link from "next/link";
import "./header.css"

export default function Header() {
  return (
    <header className="header">
      <nav>
        <ul className="header-lista">
          <li className="header-link">
            <Link href={`/tutores`}>
              Tutores
            </Link>
          </li>
          <li className="header-link">
            <Link href={`/perfil`}>
              Perfil
            </Link>
          </li>
          <li className="header-link">
            <Link href={`/conquistas`}>
              Conquistas
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
