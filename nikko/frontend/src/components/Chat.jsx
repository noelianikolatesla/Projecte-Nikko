import React, { useEffect, useMemo, useRef, useState } from "react";  // Asegúrate de incluir useRef
import { useNavigate } from "react-router-dom";  // Importar useNavigate
import { FaBars } from "react-icons/fa";  // Importar el ícono de hamburguesa de react-icons
import { FiSend } from 'react-icons/fi'; // Importar el ícono de enviar
import { cilVolumeHigh, cilMic, cilMediaStop  } from "@coreui/icons"; // Importar Iconos
import CIcon from "@coreui/icons-react"; // Importar CIcon 
import ReactMarkdown from "react-markdown";
import perfilChat from "../assets/perfil_chat.png";
import profilePic from "../assets/perfil_nikko.jpeg";
import profilePic2 from "../assets/perfil_user.jpeg";
import LoadingAnimation from "../js/LoadingAnimation";



import "../styles/chat.css";

export default function Chat() {
  const navigate = useNavigate(); // Inicializar el hook navigate

  const sessionIdRef = useRef(crypto.randomUUID());

  const firstBotMessage = useMemo(
    () => ({
      id: crypto.randomUUID(),
      role: "bot",
      text: "Hola, me alegro de que estés aquí. Soy Nikko y estoy para escucharte. ¿Hay algo que te gustaría compartir conmigo?",
      timestamp: Date.now(),
    }),
    []
  );

  // variables de grabación
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);


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
          timestamp: Date.now(),
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
    // 🔊 FUNCIÓN SPEAK (TU IMPLEMENTACIÓN)
  async function speak(text) {
    try {
      console.log("🔊 Solicitando audio para:", text);

      const res = await fetch("http://localhost:3001/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error("Error en la API de TTS");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio(url);

      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = (e) => console.error("❌ Error audio", e);

      await audio.play();
    } catch (e) {
      console.error("❌ Error reproduciendo voz", e);
    }
  }

  //funcion para empezar a grabar audio
  async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const mediaRecorder = new MediaRecorder(stream);
  audioChunksRef.current = [];

  mediaRecorder.ondataavailable = (e) => {
    audioChunksRef.current.push(e.data);
  };

  mediaRecorder.onstop = sendAudio;

  mediaRecorder.start();
  mediaRecorderRef.current = mediaRecorder;
  setRecording(true);
}

//funcion para parar la grabacion
function stopRecording() {
  mediaRecorderRef.current.stop();
  setRecording(false);
}

//funcion para enviar el audio grabado al backend
async function sendAudio() {
  const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
console.log("🎧 Audio enviado:", audioBlob);

  const formData = new FormData();
  formData.append("audio", audioBlob);

  const res = await fetch("http://localhost:3001/api/stt", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("📩 Respuesta STT:", data);


  // 👉 usamos el texto como si el usuario lo hubiera escrito
  setInput(data.text);
  send();
}


  // Función para manejar la navegación
  const goBack = () => {
    navigate("/info"); // Cambia la ruta a '/info'
  };



  return (
    <div className="chatPage">
      {/* HEADER */}
      <header className="topBar">
        <div className="topBarLeft">
          <div className="topAvatar" aria-hidden="true">
            <img src={perfilChat} alt="Perfil" className="topAvatarImg" />
          </div>

          <div className="topBarText">
            <div className="topTitle">Nikko</div>
            <div className="topStatus">
              <span className="statusDot" />
              {isLoading ? "Escribiendo..." : "En línea"}
            </div>
          </div>
        </div>

        {/* BOTÓN DE HAMBURGUESA */}
        <button className="menuBtn" type="button" onClick={goBack}>
          <FaBars size={20} />
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
              <div className="msgMiniIcon">
                <img src={profilePic} alt="Nikko" className="miniAvatar" />
              </div>
            )}

            <div className={`msgBubble ${m.role}`}>
              {m.role === "bot" && (
                <button
                  className="speakBtn"
                  onClick={() => speak(m.text)}
                  title="Escuchar respuesta"
                  aria-label="Escuchar respuesta"
                >
                  <CIcon icon={cilVolumeHigh} />
                </button>
              )}
          
              {m.role === "bot" ? (
                <ReactMarkdown>{m.text}</ReactMarkdown>
              ) : (
                m.text
              )}
              <div className="msgTime">
                {new Intl.DateTimeFormat("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(m.timestamp))}
              </div>
            </div>
            
            {m.role === "user" && (
              <div className="msgMiniIcon">
                <img src={profilePic2} alt="User" className="miniAvatar" />
              </div>
              
            )}

          </div>
        ))}

        {isLoading && (
          <div className="msgRow left">
            <div className="msgMiniIcon">
              <img src={profilePic} alt="Nikko" className="miniAvatar" />
            </div>

            <div className="msgBubble bot">
              <LoadingAnimation />
            </div>
          </div>
        )}
      </main>

      {/* INPUT */}
      <footer className="composerBar">
        <div className="composerInner">
          <div className="inputWrapper">
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
              className={`micBtn ${recording ? "recording" : ""}`}
              onClick={recording ? stopRecording : startRecording}
              type="button"
              aria-label="Grabar audio"
            >
              {recording ? <CIcon icon={cilMediaStop} /> : <CIcon icon={cilMic} />}
            </button>
          </div>
          
          <button
            className="sendBtn"
            type="button"
            onClick={send}
            disabled={isLoading}
            aria-label="Enviar"
          >
            <FiSend />
          </button>
          
        </div>
      </footer>
    </div>
  );
}
