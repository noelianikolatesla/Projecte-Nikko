import React from "react";
import Card from "./components/Card";

export default function App() {
  const page = {
    height: "100vh",  
    width: "100vw",  
    display: "flex",  
    alignItems: "center",  
    justifyContent: "center", 
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    background:
      "radial-gradient(100vw 100vh at 50% 22%, rgba(47,111,237,.20), transparent 62%)," +
      "radial-gradient(100vw 100vh at 50% 78%, rgba(124,58,237,.14), transparent 62%)," +
      "linear-gradient(180deg, #f3f6ff, #f7f2ff)",
    margin: 0,  
    overflow: "hidden",  
    boxSizing: "border-box",
  };

  return (
    <>
      <div style={page}>
        <div style={{ textAlign: "center" }}>
          <Card />
        </div>
      </div>
    </>
  );
}
