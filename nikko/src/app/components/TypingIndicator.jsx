import { Bot } from "lucide-react";
import { motion } from "motion/react";

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex gap-3 justify-start mb-4"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center shadow-sm">
        <Bot className="w-5 h-5 text-white" />
      </div>

      <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-blue-100 to-purple-100 shadow-sm">
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
