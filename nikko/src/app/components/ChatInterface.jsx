import { useState, useRef, useEffect } from "react";
import { Send, LifeBuoy, AlertTriangle, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ChatBubble } from "./ChatBubble";
import { TypingIndicator } from "./TypingIndicator";
import { analyzeSeverity, getBotResponse } from "../utils/chatLogic";

export function ChatInterface({ onShowResources }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hola, me alegro de que estés aquí. Soy tu asistente de apoyo y estoy para escucharte. ¿Hay algo que te gustaría compartir conmigo?",
      isBot: true,
      severity: "normal",
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSeverity, setCurrentSeverity] = useState("normal");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Analyze severity
    const severity = analyzeSeverity(inputMessage);
    setCurrentSeverity(severity);

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage, severity);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        isBot: true,
        severity,
        timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSeverityBanner = () => {
    if (currentSeverity === "severe") {
      return (
        <div className="bg-red-100 border-b border-red-200 px-4 py-3">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm">
              Detecto que la situación puede ser grave. Te recomiendo buscar ayuda inmediata.
            </p>
          </div>
        </div>
      );
    }
    if (currentSeverity === "moderate") {
      return (
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-3">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm">
              Esta situación necesita atención. Considera hablar con un adulto de confianza.
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
              <LifeBuoy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">Asistente de Apoyo</h2>
              <p className="text-sm text-green-600">● En línea</p>
            </div>
          </div>
          <Button
            onClick={onShowResources}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Severity Banner */}
      {getSeverityBanner()}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.text}
              isBot={message.isBot}
              severity={message.severity}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2 items-end">
            <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe tu mensaje aquí..."
                className="min-h-[44px] max-h-32 bg-transparent border-none resize-none focus:outline-none focus:ring-0 p-0"
                rows={1}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 flex-shrink-0"
              size="icon"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Recuerda que este chat es confidencial y estás en un espacio seguro
          </p>
        </div>
      </div>
    </div>
  );
}
