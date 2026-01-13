import React from "react";
import "../styles/button.css";  
import IconLock from "./IconLock";
import IconHeart from "./IconHeart";
import IconShield from "./IconShield";
import FeatureCard from "./FeatureCard";
import Footer from "./Footer";

export default function Card() {
  const badge = {
    width: 90,
    height: 90,
    borderRadius: 999,
    margin: "2px auto 18px",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(140% 140% at 30% 20%, #b2c6ff 0%, #8aa7ff 35%, #7c3aed 100%)",
    boxShadow: "0 12px 26px rgba(124,58,237,.22)",
  };

  return (
    <div
      style={{
        width: "min(400px, 92vw)",
        height: "min(580px, 92vh)",
        background: "#fff",
        borderRadius: 22,
        boxShadow: "0 18px 40px rgba(18, 40, 90, .14)",
        padding: "34px 34px 26px",
        textAlign: "center",
        position: "relative",
      }}
    >
      {/* Aquí añadimos IconShield en lugar del icono de Lock */}
      <div style={badge}>
        <IconShield size={45} color="white" /> {/* Usa IconShield aquí */}
      </div>

      <h1
        style={{
          margin: "0 0 20px", // Más espacio debajo del título
          fontSize: 25,
          letterSpacing: ".2px",
          color: "#1c388e",
          fontWeight: 500,
        }}
      >
        No estás solo/a
      </h1>
      <p
        style={{
          margin: "0 auto 30px",  // Más espacio debajo del párrafo
          maxWidth: 420,
          fontSize: 16.5,
          lineHeight: 1.5,
          color: "#4a5464",
        }}
      >
        Estoy aquí para escucharte. Este es un espacio seguro donde puedes
        compartir lo que sientes sin miedo ni juicio.
      </p>

      <div
        style={{
          margin: "14px 0 30px",  // Más separación entre los FeatureCards
          display: "flex",
          flexDirection: "column",
          gap: 20,  // Aumenta el gap para los FeatureCards
        }}
      >
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

      {/* Botón dentro de la Card */}
      <button className="cta" type="button">
        Empezar conversación
      </button>

      {/* Footer dentro de la Card */}
      <Footer />
    </div>
  );
}
