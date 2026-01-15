import React from "react";

function FeatureCard({ tone, title, subtitle, icon }) {
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,.04)",
    textAlign: "left",
  };

  const variants = {
    blue: {
      background: "linear-gradient(180deg, #f2f7ff, #eef5ff)",
      borderColor: "rgba(47,111,237,.10)",
      titleColor: "#2f6fed",  
    },
    purple: {
      background: "linear-gradient(180deg, #f8f3ff, #f4efff)",
      borderColor: "rgba(124,58,237,.10)",
      titleColor: "#7c3aed",  
    },
  };

  return (
    <div style={{ ...base, ...variants[tone] }}>
      <div
        style={{
          width: 45,
          height: 40,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: "rgba(255,255,255,.7)",
          boxShadow: "0 8px 18px rgba(20,30,70,.06)",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontWeight: 400,
            fontSize: 17,
            marginBottom: 2,
            color: variants[tone].titleColor,  
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 12.8, color: "rgba(90,107,134,.95)" }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default FeatureCard;
