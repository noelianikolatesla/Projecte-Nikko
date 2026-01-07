import { Bot, User } from "lucide-react";
import { motion } from "motion/react";

export function ChatBubble({ message, isBot, severity = "normal", timestamp }) {
  const getSeverityStyles = () => {
    if (!isBot) return "";
    
    switch (severity) {
      case "severe":
        return "bg-red-50 border border-red-200 text-red-900";
      case "moderate":
        return "bg-amber-50 border border-amber-200 text-amber-900";
      default:
        return "bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"} mb-4`}
    >
      {isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-sm">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`flex flex-col max-w-[75%] ${isBot ? "items-start" : "items-end"}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isBot
              ? getSeverityStyles()
              : "bg-gradient-to-r from-green-400 to-blue-400 text-white"
          }`}
        >
          <p className="whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-gray-400 mt-1 px-2">
            {timestamp}
          </span>
        )}
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </motion.div>
  );
}
