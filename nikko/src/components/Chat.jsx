import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/chat.css";  

function buildEmpathicReply(userText) {
    const t = (userText || "").trim().toLowerCase();

    // Respuestas simples y empáticas (sin juicios / sin minimizar)
    const patterns = [
        { keys: ["miedo", "asust", "panic", "ansiedad"], reply: "Siento que estés pasando por eso. Tener miedo puede ser muy duro. ¿Quieres contarme qué es lo que más te preocupa ahora mismo?" },
        { keys: ["triste", "llorar", "solo", "sola", "vacío", "vacia"], reply: "Gracias por abrirte. Lo que sientes importa. ¿Qué ha pasado últimamente que te hace sentir así?" },
        { keys: ["bully", "acoso", "insultan", "pegan", "amenazan", "humill"], reply: "Lo siento mucho. Nadie merece pasar por eso. Si te parece, cuéntame qué ocurrió y dónde, para pensar juntos en un paso seguro." },
        { keys: ["vergüenza", "culpa"], reply: "Entiendo. A veces la vergüenza o la culpa aparecen incluso cuando no hemos hecho nada malo. ¿Qué te gustaría que alguien te dijera ahora mismo para sentirte un poco más acompañado/a?" },
    ];

    const hit = patterns.find(p => p.keys.some(k => t.includes(k)));
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
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    function send() {
        const text = input.trim();
        if (!text) return;

        const userMsg = { id: crypto.randomUUID(), role: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        // respuesta "bot" con pequeño delay
        setTimeout(() => {
            const botMsg = {
                id: crypto.randomUUID(),
                role: "bot",
                text: buildEmpathicReply(text),
            };
            setMessages(prev => [...prev, botMsg]);
        }, 350);
    }

    function onKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    return (
        <div className="chatWrap">
            <div className="chatCard" role="region" aria-label="Chat de apoyo">
                <div className="chatHeader">
                    <div className="chatHeaderLeft">
                        <div className="chatBadge" aria-hidden="true">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
                                    stroke="white"
                                    strokeWidth="1.8"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="chatTitle">Chat de apoyo</div>
                            <div className="chatSubtitle">Espacio seguro y sin juicio</div>
                        </div>
                    </div>

                    <button className="chatBackBtn" type="button" onClick={onBack}>
                        Volver
                    </button>
                </div>

                <div className="chatList" ref={listRef}>
                    {messages.map((m) => (
                        <div key={m.id} className={`msgRow ${m.role === "user" ? "right" : "left"}`}>
                            <div className={`msgBubble ${m.role}`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chatComposer">
                    <textarea
                        className="chatInput"
                        placeholder="Escribe aquí lo que sientes... estoy contigo 💙"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={onKeyDown}
                        rows={1}
                    />
                    <button className="chatSendBtn" type="button" onClick={send}>
                        Enviar
                    </button>
                </div>

                <div className="chatFooter">
                    Si estás en peligro inmediato, contacta a un adulto de confianza o llama a emergencias.
                </div>
            </div>
        </div>
    );
}
