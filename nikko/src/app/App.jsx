import { useState } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { ChatInterface } from "./components/ChatInterface";
import { ResourcesScreen } from "./components/ResourcesScreen";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("welcome");

  return (
    <>
      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={() => setCurrentScreen("chat")} />
      )}
      
      {currentScreen === "chat" && (
        <ChatInterface onShowResources={() => setCurrentScreen("resources")} />
      )}
      
      {currentScreen === "resources" && (
        <ResourcesScreen onBack={() => setCurrentScreen("chat")} />
      )}

      <Toaster />
    </>
  );
}
