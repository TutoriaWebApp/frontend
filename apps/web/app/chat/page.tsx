"use client";

import { useState, useEffect, useContext, useRef, useCallback } from "react";
import { GetChatResultData, MessageGetData } from "@repo/services/chatTypes";
import { GetChats, GetChatMessages } from "@repo/services/chat";
import { PostMessageAction } from "@repo/services/chatAction";
import { formatMessageDate } from "@repo/lib/formatMessageDate";
import { NotificationContext } from "@repo/ui/contexts/NotificationContext/NotificationContext";
import { ClipLoader } from "react-spinners";
import Link from "next/link";

export default function ChatPage() {
  const [chats, setChats] = useState<GetChatResultData[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loadingChats, setLoadingChats] = useState<boolean>(true);
  const [loadingChatMessages, setLoadingChatMessages] =
    useState<boolean>(false);
  const [disableSendButton, setDisableSendButton] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageGetData[]>([]);

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { showNotification } = useContext(NotificationContext);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const fetchChats = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setLoadingChats(true);
      }

      const res = await GetChats();

      if (res.success && res.data) {
        setChats(res.data);

        if (isInitial && res.data.length > 0) {
          const firstChatId = res.data[0]!.id;
          selectChat(firstChatId);
        }
      } else if (isInitial) {
        if (res.status !== 500) {
          showNotification("Ocorreu um erro ao buscar os chats.", "error");
        } else {
          showNotification(
            "Ocorreu um erro no servidor ao buscar os chats.",
            "error",
          );
        }
      }

      if (isInitial) {
        setLoadingChats(false);
      }
    },
    [showNotification],
  );

  useEffect(() => {
    fetchChats(true);
  }, [fetchChats]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (document.hidden) return;

      const chatsRes = await GetChats();
      if (chatsRes.success && chatsRes.data) {
        setChats(chatsRes.data);
      }

      if (activeChatId) {
        const msgRes = await GetChatMessages(activeChatId);
        if (msgRes.success && msgRes.data) {
          setMessages(msgRes.data);
        }
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [activeChatId]);

  // Auto-scroll sempre que novas mensagens forem renderizadas
  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages]);

  const selectChat = async (chatId: number) => {
    setActiveChatId(chatId);
    setPage(1);
    setHasMore(true);
    setLoadingChatMessages(true);

    const res = await GetChatMessages(chatId, 1);
    if (res.success && res.data) {
      setMessages(res.data);
      setHasMore(res.hasNext ?? false);
      setTimeout(() => scrollToBottom("auto"), 50);
    } else {
      if (res.status !== 500) {
        showNotification(
          "Ocorreu um erro na busca das mensagens desse chat.",
          "error",
        );
      } else {
        showNotification(
          "Ocorreu um erro no servidor. Não foi possível obter as mensagens desse chat.",
          "error",
        );
      }
    }
    setLoadingChatMessages(false);
  };

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  const filteredChats = chats.filter((chat) =>
    chat.nomePessoa.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !activeChatId) {
      return;
    }

    setDisableSendButton(true);

    const messageToSend = inputMessage;
    setInputMessage("");

    const res = await PostMessageAction({
      chatId: activeChatId,
      conteudo: messageToSend,
    });

    if (res.success) {
      // Atualiza imediatamente tanto a lista de mensagens quanto a barra lateral
      const [msgRes, chatsRes] = await Promise.all([
        GetChatMessages(activeChatId),
        GetChats(),
      ]);

      if (msgRes.success && msgRes.data) {
        setMessages(msgRes.data);
      }
      if (chatsRes.success && chatsRes.data) {
        setChats(chatsRes.data);
      }
    } else {
      setInputMessage(messageToSend);
      if (res.status !== 500) {
        showNotification(
          "Ocorreu um erro no servidor. Não foi possível enviar a mensagem.",
          "error",
        );
      } else {
        showNotification(
          "Ocorreu um erro. Não foi possível enviar a mensagem.",
          "error",
        );
      }
    }

    setDisableSendButton(false);
  };

  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (!container || loadingMore || !hasMore || !activeChatId) return;

    if (container.scrollTop === 0) {
      setLoadingMore(true);
      const nextPage = page + 1;
      const previousScrollHeight = container.scrollHeight;

      const res = await GetChatMessages(activeChatId, nextPage);
      if (res.success && res.data && res.data.length > 0) {
        setPage(nextPage);
        setHasMore(res.hasNext ?? false);

        setMessages((prev) => [...res.data!, ...prev]);

        requestAnimationFrame(() => {
          if (chatContainerRef.current) {
            container.scrollTop = container.scrollHeight - previousScrollHeight;
          }
        });
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {loadingChats ? (
        <div className="flex-1 flex items-center justify-center">
          <ClipLoader color="#64748b" size={80} />
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Sidebar */}
          <aside
            className={`
              w-full md:w-72 lg:w-80 bg-slate-100/80 border-r border-slate-200 
              flex flex-col p-4 gap-4 absolute md:relative inset-0 
              transition-transform duration-200 ease-in-out md:translate-x-0
              ${activeChatId !== null ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
            `}
          >
            <h2 className="text-lg font-bold text-slate-800">
              Histórico de Chat
            </h2>

            {/* Campo de Busca */}
            <div className="relative">
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Lista de Contatos */}
            <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
              {filteredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left
                    ${
                      activeChatId === chat.id
                        ? "bg-brand-primary shadow-sm border border-indigo-800 text-white"
                        : "bg-slate-300/80 hover:bg-slate-300 text-slate-800 border border-transparent"
                    }
                  `}
                >
                  <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center shrink-0 bg-slate-200 overflow-hidden relative">
                    {chat.fotoURL ? (
                      <img
                        src={chat.fotoURL}
                        alt={chat.nomePessoa}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-slate-500 text-xs font-bold">
                        {chat.nomePessoa.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center gap-1">
                      <p
                        className={`font-semibold text-sm truncate ${activeChatId === chat.id ? "text-white" : "text-slate-800"}`}
                      >
                        {chat.nomePessoa}
                      </p>

                      {/* Horário ou Notificação */}
                      {chat.horarioUltimaMensagem && (
                        <span
                          className={`text-[10px] shrink-0 ${activeChatId === chat.id ? "text-indigo-200" : "text-slate-500"}`}
                        >
                          {formatMessageDate(chat.horarioUltimaMensagem)}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center gap-2 mt-0.5">
                      <p
                        className={`text-xs truncate ${activeChatId === chat.id ? "text-indigo-100" : "text-slate-500"}`}
                      >
                        {chat.ultimaMensagem || "Sem mensagens"}
                      </p>

                      {/* Badge de Mensagens Não Lidas */}
                      {chat.mensagensNaoLidas > 0 &&
                        activeChatId !== chat.id && (
                          <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full shrink-0 min-w-5 text-center shadow-xs">
                            {chat.mensagensNaoLidas > 99
                              ? "+99"
                              : chat.mensagensNaoLidas}
                          </span>
                        )}
                    </div>
                  </div>
                </button>
              ))}

              {filteredChats.length === 0 && (
                <p className="text-xs text-center text-slate-400 py-4">
                  Nenhuma conversa encontrada.
                </p>
              )}
            </div>
          </aside>

          {/* Painel do Chat Ativo */}
          <main
            className={`
              flex-1 flex flex-col bg-white w-full absolute md:relative inset-0 min-h-0
              transition-transform duration-200 ease-in-out md:translate-x-0
              ${activeChatId !== null ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            `}
          >
            {activeChat ? (
              <>
                {/* Topbar do Chat Ativo */}
                <div className="h-16 px-4 border-b border-slate-200 flex items-center gap-3 shadow-2xs shrink-0">
                  <button
                    onClick={() => setActiveChatId(null)}
                    className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <Link href={`/perfil/${activeChat.usuarioId}`}>
                    <div className="w-10 h-10 border border-slate-200 rounded-full flex items-center justify-center bg-slate-200 overflow-hidden shrink-0">
                      {activeChat.fotoURL ? (
                        <img
                          src={activeChat.fotoURL}
                          alt={activeChat.nomePessoa}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-500 text-xs font-bold">
                          {activeChat.nomePessoa.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </Link>
                  <h1 className="font-bold text-base md:text-lg text-slate-800 truncate hover:underline">
                    <Link href={`/perfil/${activeChat.usuarioId}`}>
                      {activeChat.nomePessoa}
                    </Link>
                  </h1>
                </div>

                {/* Área de Mensagens */}
                {loadingChatMessages ? (
                  <div className="flex-1 flex items-center justify-center">
                    <ClipLoader color="#64748b" size={80} />
                  </div>
                ) : (
                  <>
                    <div
                      ref={chatContainerRef}
                      className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/40"
                      onScroll={handleScroll}
                    >
                      {loadingMore && (
                        <div className="flex justify-center py-2">
                          <ClipLoader color="#6366f1" size={24} />
                        </div>
                      )}
                      {messages && messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${
                              msg.ehMinha ? "items-end" : "items-start"
                            }`}
                          >
                            <div
                              className={`
                                max-w-[85%] md:max-w-md px-4 py-2.5 md:py-3 rounded-2xl text-sm shadow-2xs 
                                ${
                                  msg.ehMinha
                                    ? "bg-brand-primary text-white rounded-br-xs"
                                    : "bg-slate-200 text-slate-800 rounded-bl-xs"
                                }
                              `}
                            >
                              <p className="leading-relaxed break-words">
                                {msg.conteudo}
                              </p>
                              <span
                                className={`text-[10px] block text-right mt-1 ${
                                  msg.ehMinha
                                    ? "text-indigo-200"
                                    : "text-slate-500"
                                }`}
                              >
                                {formatMessageDate(msg.horario)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                          Nenhuma mensagem por aqui ainda. Envie a primeira!
                        </div>
                      )}
                    </div>

                    {/* Barra de Envio */}
                    <div className="p-3 md:p-4 border-t border-slate-200 bg-white shrink-0">
                      <form
                        onSubmit={handleSendMessage}
                        className="flex items-center gap-2 md:gap-3 max-w-5xl mx-auto"
                      >
                        <input
                          type="text"
                          placeholder="Digite sua mensagem..."
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          maxLength={200}
                          className="flex-1 border border-slate-300 rounded-xl px-3.5 md:px-4 py-2.5 md:py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all bg-slate-50/50"
                        />
                        <button
                          type="submit"
                          disabled={!inputMessage.trim() || disableSendButton}
                          className="w-10 h-10 md:w-11 md:h-11 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-all shrink-0 shadow-md shadow-indigo-600/20 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5 -rotate-45 translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </button>
                      </form>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 text-slate-400 text-sm">
                Selecione uma conversa para começar.
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
