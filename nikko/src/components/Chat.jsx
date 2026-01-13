import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/chat.css";

function buildEmpathicReply(userText) {
  const t = (userText || "").trim().toLowerCase();

  // Respuestas simples y empáticas (sin juicios / sin minimizar)
  const patterns = [
    {
      keys: ["miedo", "asust", "panic", "ansiedad"],
      reply:
        "Siento que estés pasando por eso. Tener miedo puede ser muy duro. ¿Quieres contarme qué es lo que más te preocupa ahora mismo?",
    },
    {
      keys: ["triste", "llorar", "solo", "sola", "vacío", "vacia"],
      reply:
        "Gracias por abrirte. Lo que sientes importa. ¿Qué ha pasado últimamente que te hace sentir así?",
    },
    {
      keys: ["bully", "acoso", "insultan", "pegan", "amenazan", "humill"],
      reply:
        "Lo siento mucho. Nadie merece pasar por eso. Si te parece, cuéntame qué ocurrió y dónde, para pensar juntos en un paso seguro.",
    },
    {
      keys: ["vergüenza", "culpa"],
      reply:
        "Entiendo. A veces la vergüenza o la culpa aparecen incluso cuando no hemos hecho nada malo. ¿Qué te gustaría que alguien te dijera ahora mismo para sentirte un poco más acompañado/a?",
    },
  ];

  const hit = patterns.find((p) => p.keys.some((k) => t.includes(k)));
  if (hit) return hit.reply;

  // Por defecto
  return "Te estoy leyendo con atención. Gracias por confiar en mí. ¿Qué parte de lo que estás viviendo te gustaría contar primero?";
}

export default function Chat({ onBack }) {
  const firstBotMessage = useMemo(
    () => ({
      id: crypto.randomUUID(),
      role: "bot",
      text: "Hola, gracias por estar aquí. Puedes contarme lo que necesites, estoy para escucharte 💙",
    }),
    []
  );

  const [messages, setMessages] = useState([firstBotMessage]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    // autoscroll
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;

    const userMsg = { id: crypto.randomUUID(), role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // respuesta "bot" con pequeño delay
    setTimeout(() => {
      const botMsg = {
        id: crypto.randomUUID(),
        role: "bot",
        text: buildEmpathicReply(text),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 350);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="chatPage">
      {/* HEADER */}
      <header className="topBar">
        <div className="topBarLeft">
          <div className="topAvatar" aria-hidden="true">
            {/* icono circular */}
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
              En línea
            </div>
          </div>
        </div>

        <button className="menuBtn" type="button" aria-label="Menú">
          ☰
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
              {m.text}
              <div className="msgTime">20:20</div>
            </div>
          </div>
        ))}
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
          />
          <button
            className="sendBtn"
            type="button"
            onClick={send}
            aria-label="Enviar"
          >
            ➤
          </button>
        </div>
      </footer>
    </div>
  );
}
