"use client";

import { useEffect, useState, useRef, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { usePathname } from "next/navigation";
import { GetChats } from "@repo/services/chat";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { 
  GetAllFutureTutorSolicitations, 
  GetResolvedLearnerSolicitations 
} from "@repo/services/solicitations";

interface HeaderProps {
  onLogout?: () => void;
}

const useUnreadMessages = (loggedIn: boolean) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!loggedIn) return;

    const fetchUnread = async () => {
      if (document.hidden) return;

      const res = await GetChats();
      if (res.success && res.data) {
        const total = res.data.reduce(
          (acc: number, chat: any) => acc + (chat.mensagensNaoLidas || 0),
          0,
        );
        setUnreadCount(total);
      }
    };

    fetchUnread();
    const intervalId = setInterval(fetchUnread, 4000);

    return () => clearInterval(intervalId);
  }, [loggedIn]);

  return unreadCount;
};

const useSolicitationsNotifications = (loggedIn: boolean) => {
  const [pendingTutorCount, setPendingTutorCount] = useState<number>(0);
  const [confirmedLearnerCount, setConfirmedLearnerCount] = useState<number>(0);

  const prevPendingTutorRef = useRef<number | null>(null);
  const prevResolvedLearnerMapRef = useRef<Record<number, string> | null>(null);
  const { showNotification } = useContext(NotificationContext);

  useEffect(() => {
    if (!loggedIn) return;

    const checkNotifications = async () => {
      if (document.hidden) return;

      const [tutorRes, learnerRes] = await Promise.all([
        GetAllFutureTutorSolicitations(),
        GetResolvedLearnerSolicitations(),
      ]);

      if (tutorRes.success && tutorRes.data) {
        const pendentes = tutorRes.data.length;

        if (prevPendingTutorRef.current !== null && pendentes > prevPendingTutorRef.current) {
          const novas = pendentes - prevPendingTutorRef.current;
          showNotification(
            `Você recebeu ${novas > 1 ? `${novas} novas solicitações` : "uma nova solicitação"} de tutoria!`,
            "info"
          );
        }

        prevPendingTutorRef.current = pendentes;
        setPendingTutorCount(pendentes);
      }

      if (learnerRes.success && learnerRes.data) {
        const resolvidas = learnerRes.data;
        const confirmadas = resolvidas.filter((s: any) => s.estado === "ACEITO").length;

        if (prevResolvedLearnerMapRef.current !== null) {
          resolvidas.forEach((s: any) => {
            const previousState = prevResolvedLearnerMapRef.current?.[s.id];

            if (!previousState) {
              if (s.estado === "ACEITO") {
                showNotification(
                  `Sua solicitação de tutoria de ${s.nomeArea} com ${s.nomeTutor} foi confirmada!`,
                  "success"
                );
              } else if (s.estado === "RECUSADO") {
                showNotification(
                  `Sua solicitação de tutoria de ${s.nomeArea} com ${s.nomeTutor} foi recusada.`,
                  "error"
                );
              }
            }
          });
        }

        const currentMap: Record<number, string> = {};
        resolvidas.forEach((s: any) => {
          currentMap[s.id] = s.estado;
        });
        prevResolvedLearnerMapRef.current = currentMap;

        setConfirmedLearnerCount(confirmadas);
      }
    };

    checkNotifications();
    const intervalId = setInterval(checkNotifications, 5000);

    return () => clearInterval(intervalId);
  }, [loggedIn, showNotification]);

  return { pendingTutorCount, confirmedLearnerCount };
};

export default function Header({ onLogout }: HeaderProps) {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const unreadCount = useUnreadMessages(loggedIn);
  const { pendingTutorCount, confirmedLearnerCount } = useSolicitationsNotifications(loggedIn);

  const notLoggedInRoutes = [
    "/",
    "/criar-conta",
    "/esqueci-senha",
    `/redefinir-senha/:path*/:path*`,
  ];

  const navLinks = [
    { name: "Home", href: "/dashboard" },
    { name: "Perfil", href: "/meu-perfil" },
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
      <Link href="/" className="flex items-center ml-6">
        <Image
          alt="Tutor e Aprendiz se conectando por telas"
          src="/logo.svg"
          width="50"
          height="50"
        />
        <h1 className="ml-2 text-brand-secondary font-medium font-montserrat text-2xl">
          Tutoria<span className="text-brand-primary">Web</span>
        </h1>
      </Link>

      {loggedIn && (
        <>
          {/* Botão Hambúrguer (Mobile) */}
          <button
            className="lg:hidden mr-6 text-slate-600 hover:text-brand-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <CloseIcon fontSize="large" />
            ) : (
              <MenuIcon fontSize="large" />
            )}
          </button>

          {/* Navegação Desktop */}
          <nav className="hidden lg:block mr-6">
            <ul className="flex flex-row items-center">
              {navLinks.map((link, index) => (
                <Link key={index} href={link.href}>
                  <li
                    className="
                      relative
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
                    <span>{link.name}</span>

                    {/* Badge do Chat */}
                    {link.name === "Chat" && unreadCount > 0 && (
                      <span
                        className="
                          absolute 
                          top-2 
                          right-2 
                          bg-rose-500 
                          text-white 
                          text-[10px] 
                          font-extrabold 
                          h-4 
                          min-w-4 
                          px-1 
                          rounded-full 
                          flex 
                          items-center 
                          justify-center 
                          shadow-xs 
                          animate-pulse
                        "
                      >
                        {unreadCount > 99 ? "+99" : unreadCount}
                      </span>
                    )}

                    {/* Badges de Solicitações Desktop (Vermelha para Tutor / Verde para Aprendiz) */}
                    {link.name === "Solicitações" && (
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {pendingTutorCount > 0 && (
                          <span
                            title="Solicitações Pendentes (Tutor)"
                            className="
                              bg-rose-500 
                              text-white 
                              text-[10px] 
                              font-extrabold 
                              h-4 
                              min-w-4 
                              px-1 
                              rounded-full 
                              flex 
                              items-center 
                              justify-center 
                              shadow-xs 
                              animate-pulse
                            "
                          >
                            {pendingTutorCount > 99 ? "+99" : pendingTutorCount}
                          </span>
                        )}

                        {confirmedLearnerCount > 0 && (
                          <span
                            title="Sessões Confirmadas (Aprendiz)"
                            className="
                              bg-emerald-500 
                              text-white 
                              text-[10px] 
                              font-extrabold 
                              h-4 
                              min-w-4 
                              px-1 
                              rounded-full 
                              flex 
                              items-center 
                              justify-center 
                              shadow-xs
                            "
                          >
                            {confirmedLearnerCount > 99 ? "+99" : confirmedLearnerCount}
                          </span>
                        )}
                      </div>
                    )}
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
                onClick={onLogout}
              >
                Sair da Conta
              </li>
            </ul>
          </nav>

          {/* Menu Mobile Overlay */}
          {isMenuOpen && (
            <div
              className="
                lg:hidden 
                fixed 
                inset-0 
                top-20 
                bg-white 
                z-[90] 
                animate-in 
                slide-in-from-right 
                duration-300
              "
            >
              <nav className="flex flex-col p-6 space-y-2">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        w-fit
                        p-4 
                        rounded-xl 
                        font-medium 
                        text-lg
                        text-slate-600
                        hover:bg-slate-50
                      "
                    >
                      <span>{link.name}</span>

                      {/* Badge Chat Mobile */}
                      {link.name === "Chat" && unreadCount > 0 && (
                        <span
                          className="
                            bg-rose-500 
                            text-white 
                            text-xs 
                            font-extrabold 
                            h-5 
                            min-w-5 
                            px-1.5 
                            rounded-full 
                            flex 
                            items-center 
                            justify-center 
                            shadow-xs
                            animate-pulse
                          "
                        >
                          {unreadCount > 99 ? "+99" : unreadCount}
                        </span>
                      )}

                      {/* Badges de Solicitações Mobile */}
                      {link.name === "Solicitações" && (
                        <div className="flex items-center gap-1.5">
                          {pendingTutorCount > 0 && (
                            <span
                              className="
                                bg-rose-500 
                                text-white 
                                text-xs 
                                font-extrabold 
                                h-5 
                                min-w-5 
                                px-1.5 
                                rounded-full 
                                flex 
                                items-center 
                                justify-center 
                                shadow-xs 
                                animate-pulse
                              "
                            >
                              {pendingTutorCount > 99 ? "+99" : pendingTutorCount}
                            </span>
                          )}

                          {confirmedLearnerCount > 0 && (
                            <span
                              className="
                                bg-emerald-500 
                                text-white 
                                text-xs 
                                font-extrabold 
                                h-5 
                                min-w-5 
                                px-1.5 
                                rounded-full 
                                flex 
                                items-center 
                                justify-center 
                                shadow-xs
                              "
                            >
                              {confirmedLearnerCount > 99 ? "+99" : confirmedLearnerCount}
                            </span>
                          )}
                        </div>
                      )}
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
                    onLogout;
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