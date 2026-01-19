import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

import "../styles/chat.css";

export default function Chat({ onBack }) {
  // ===== BACKEND / LÓGICA (del primer código) =====
  const sessionIdRef = useRef(crypto.randomUUID());

  const firstBotMessage = useMemo(
    () => ({
      id: crypto.randomUUID(),
      role: "bot",
      text: "Hola, gracias por estar aquí. Puedes contarme lo que necesites, estoy para escucharte 💙",
      timestamp: Date.now(),
    }),
    []
  );

  const [messages, setMessages] = useState([firstBotMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId: sessionIdRef.current,
        }),
      });

      if (!res.ok) throw new Error("Error en la API");

      const data = await res.json();

      const botMsg = {
        id: crypto.randomUUID(),
        role: "bot",
        text: data.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error al conectar con la API:", error);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text:
            "Lo siento, ahora mismo tengo un problema técnico, pero sigo aquí contigo 💙",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ===== FRONTEND / UI (del segundo código) =====
  return (
    <div className="chatPage">
      {/* HEADER */}
      <header className="topBar">
        <div className="topBarLeft">
          <div className="topAvatar" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="topBarText">
            <div className="topTitle">Asistente de Apoyo</div>
            <div className="topStatus">
              <span className="statusDot" />
              {isLoading ? "Escribiendo..." : "En línea"}
            </div>
          </div>
        </div>

        <button className="menuBtn" type="button" onClick={onBack}>
          Volver
        </button>
      </header>

      {/* MENSAJES */}
      <main className="chatBody" ref={listRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`msgRow ${m.role === "user" ? "right" : "left"}`}
          >
            {m.role === "bot" && (
              <div className="msgMiniIcon" aria-hidden="true">
                💬
              </div>
            )}
            <div className={`msgBubble ${m.role}`}>
              {m.role === "bot" ? (
                <ReactMarkdown>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
              <div className="msgTime">
                {new Intl.DateTimeFormat("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(m.timestamp))
                }
              </div>
            </div>



          </div>
        ))}

        {isLoading && (
          <div className="msgRow left">
            <div className="msgBubble bot">Escribiendo…</div>
          </div>
        )}
      </main>

      {/* INPUT */}
      <footer className="composerBar">
        <div className="composerInner">
          <textarea
            className="chatInput"
            placeholder="Escribe tu mensaje aquí..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            className="sendBtn"
            type="button"
            onClick={send}
            disabled={isLoading}
            aria-label="Enviar"
          >
            ➤
          </button>
        </div>
      </footer>
    </div>
  );
}