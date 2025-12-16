import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

function StartConversationButton({ userId, username, className = "" }) {
    const navigate = useNavigate();

    const handleStartConversation = async (e) => {
        e.stopPropagation(); // Evitar que se active el click del contenedor padre

        try {
            const userStr = localStorage.getItem("user");
            if (!userStr) {
                toast.error("Debes iniciar sesión para enviar mensajes");
                navigate("/login");
                return;
            }

            const currentUser = JSON.parse(userStr);

            if (currentUser.id === userId) {
                toast.error("No puedes enviarte mensajes a ti mismo");
                return;
            }

            // Obtener o crear conversación
            const response = await fetch(
                `http://127.0.0.1:8000/api/messages/conversation-with/${currentUser.id}/${userId}`
            );

            if (!response.ok) {
                throw new Error("Error al crear conversación");
            }

            const data = await response.json();

            // Navegar a la página de mensajes con la conversación seleccionada
            navigate("/messages", { state: { conversationId: data.conversation_id } });
        } catch (error) {
            console.error("Error starting conversation:", error);
            toast.error("Error al iniciar la conversación. Por favor, intenta de nuevo.");
        }
    };

    return (
        <button
            onClick={handleStartConversation}
            className={`start-conversation-button ${className}`}
            style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = "white";
            }}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Mensaje
        </button>
    );
}

export default StartConversationButton;
