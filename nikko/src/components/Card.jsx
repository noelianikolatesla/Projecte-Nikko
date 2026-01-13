import React from "react";
import "../styles/button.css";
import IconLock from "./IconLock";
import IconHeart from "./IconHeart";
import IconShield from "./IconShield";
import FeatureCard from "./FeatureCard";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

export default function Card() {
  const navigate = useNavigate();

  const badge = {
    width: 90,
    height: 90,
    borderRadius: 999,
    margin: "0 auto 16px",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(140% 140% at 30% 20%, #b2c6ff 0%, #8aa7ff 35%, #7c3aed 100%)",
    boxShadow: "0 12px 26px rgba(124,58,237,.22)",
  };

  return (
    <div
      style={{
        width: "min(420px, 92vw)",         
        background: "#fff",
        borderRadius: 28,                  
        padding: "34px 30px 24px",         
        boxShadow: "0 18px 45px rgba(35, 50, 90, 0.18)", 
        textAlign: "center",
      }}
    >
      <div style={badge}>
        <IconShield size={45} color="white" />
      </div>

      <h1
        style={{
          margin: "6px 0 10px",
          fontSize: 25,
          fontWeight: 500,
          color: "#2a3a78",
          letterSpacing: "-0.2px",
        }}
      >
        No estás solo/a
      </h1>

      <p
        style={{
          margin: "0 auto 22px",
          maxWidth: 420,
          fontSize: 15.5,
          lineHeight: 1.55,
          color: "#55628a",
        }}
      >
        Estoy aquí para escucharte. Este es un espacio seguro donde puedes
        compartir lo que sientes sin miedo ni juicio.
      </p>

      <div style={{ display: "grid", gap: 14, margin: "0 auto 18px" }}>
        <FeatureCard
          tone="blue"
          title="Confidencial"
          subtitle="Tus conversaciones son privadas y seguras"
          icon={<IconLock />}
        />
        <FeatureCard
          tone="purple"
          title="Apoyo empático"
          subtitle="Te acompaño con comprensión y sin juzgarte"
          icon={<IconHeart />}
        />
      </div>

      <button className="cta" type="button" onClick={() => navigate("/chat")}>
        Empezar conversación
      </button>

      <div style={{ marginTop: 18 }}>
        <Footer />
      </div>
    </div>
  );
}
