import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPhoneAlt, FaClipboard } from "react-icons/fa";  // Para íconos de teléfono y copiar

import "../styles/info.css";  // Asegúrate de tener un archivo de estilos adecuado

export default function Info() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/chat"); // Redirige a la ruta '/chat'
  };

  return (
    <div className="infoPage">
      {/* HEADER */}
      <header className="infoTopBar">
        <button className="infoBackBtn" onClick={goBack}>
          ←
        </button>
        <div className="infoTopBarTitle">
          <h1>Recursos de Ayuda</h1>
          <p className="infoSubTitle">Contactos y consejos útiles</p>
        </div>
      </header>

      {/* CONTENIDO DESPLAZABLE */}
      <div className="infoContent" style={{ flexGrow: 1, overflowY: "auto" }}>
        {/* ADVERTENCIA DE PELIGRO */}
        <section className="infoDangerAlert">
          <p>¿Estás en peligro? <span>Si estás en una situación de riesgo inmediato, contacta a servicios de emergencia o a un adulto de confianza ahora mismo.</span></p>
        </section>

        {/* LÍNEAS DE AYUDA */}
        <section className="infoHelpLines">
          <h2>Líneas de Ayuda</h2>

          <div className="infoHelpLine">
            <h3>Línea Nacional contra el Bullying</h3>
            <p>Atención 24/7 para situaciones de acoso escolar</p>
            <div className="infoContactInfo">
              <span>900 20 20 10</span>
              <button className="infoIconBtn">
                <FaPhoneAlt />
              </button>
              <button className="infoIconBtn">
                <FaClipboard />
              </button>
            </div>
          </div>

          <div className="infoHelpLine">
            <h3>Teléfono ANAR</h3>
            <p>Ayuda a niños y adolescentes en riesgo</p>
            <div className="infoContactInfo">
              <span>900 20 20 10</span>
              <button className="infoIconBtn">
                <FaPhoneAlt />
              </button>
              <button className="infoIconBtn">
                <FaClipboard />
              </button>
            </div>
          </div>

          <div className="infoHelpLine">
            <h3>Emergencias</h3>
            <p>Para situaciones de peligro inmediato</p>
            <div className="infoContactInfo">
              <span>112</span>
              <button className="infoIconBtn">
                <FaPhoneAlt />
              </button>
              <button className="infoIconBtn">
                <FaClipboard />
              </button>
            </div>
          </div>
        </section>

        {/* CONSEJOS SOBRE BULLOING */}
        <section className="infoBullyingAdvice">
          <h2>¿Qué hacer si sufro bullying?</h2>
          <ul>
            <li>Habla con un adulto de confianza (padres, profesores, orientador)</li>
            <li>No respondas con violencia a la agresión</li>
            <li>Guarda evidencias (mensajes, capturas de pantalla)</li>
            <li>No estás solo/a, buscar ayuda es valiente, no debilidad</li>
          </ul>
        </section>

        {/* CÓMO AYUDAR A UN COMPAÑERO */}
        <section className="infoHelpCompanion">
          <h2>¿Cómo ayudar a un compañero?</h2>
          <ul>
            <li>No participes ni apoyes el acoso</li>
            <li>Acompaña a la víctima y hazle saber que no está sola</li>
            <li>Reporta la situación a un adulto responsable</li>
            <li>Sé un ejemplo de respeto y empatía</li>
          </ul>
        </section>

        {/* RECURSOS ONLINE */}
        <section className="infoOnlineResources">
          <h2>Recursos Online</h2>
          <div className="infoResourceLink">
            <a href="https://www.acosoescolar.info" target="_blank" rel="noopener noreferrer">
              Portal contra el Acoso Escolar
            </a>
          </div>
          <div className="infoResourceLink">
            <a href="https://www.fundacionanar.org" target="_blank" rel="noopener noreferrer">
              Fundación ANAR
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
