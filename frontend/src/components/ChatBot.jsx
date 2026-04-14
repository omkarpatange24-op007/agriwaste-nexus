import React, { useState } from 'react';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi 👋 How can I help you?", from: "bot" }
  ]);

  function handleOption(option) {
    let reply = "";

    if (option === "forgot") {
      reply = "👉 Click on 'Forgot Password' to reset your password.";
    } else if (option === "login") {
      reply = "❌ Check your email & password or try demo login.";
    } else if (option === "contact") {
      reply = "📧 Contact us at support@agriwaste.com or 📞 call us at on @91+ 8208135967";
    }

    setMessages(prev => [
      ...prev,
      { text: option, from: "user" },
      { text: reply, from: "bot" }
    ]);
  }

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "#2C5F2D",
          color: "white",
          borderRadius: "50%",
          width: "55px",
          height: "55px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "24px",
          zIndex: 999
        }}
      >
              <img
                  src="/chatbot.png"
                  alt="chatbot"
                  style={{ width: "60%", height: "60%", objectFit: "contain" }}
              />
      </div>

      {/* Chat Window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "300px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            padding: "10px",
            zIndex: 999
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
            Chat Support 🤖
          </div>

          <div style={{ maxHeight: "200px", overflowY: "auto", fontSize: "14px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ margin: "5px 0", textAlign: m.from === "bot" ? "left" : "right" }}>
                <span style={{
                  background: m.from === "bot" ? "#eee" : "#2C5F2D",
                  color: m.from === "bot" ? "#000" : "#fff",
                  padding: "6px 10px",
                  borderRadius: "10px",
                  display: "inline-block"
                }}>
                  {m.text}
                </span>
              </div>
            ))}
          </div>

          {/* Menu Options */}
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <button onClick={() => handleOption("forgot")}>🔑 Forgot Password</button>
            <button onClick={() => handleOption("login")}>❌ Login Issue</button>
            <button onClick={() => handleOption("contact")}>📧 Contact Support</button>
          </div>
        </div>
      )}
    </>
  );
}