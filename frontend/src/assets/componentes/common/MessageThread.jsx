import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import "../../styles/Messages.css";

function MessageThread({ conversation, messages, onSendMessage, currentUserId }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
    };

    const formatMessageDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return "Hoy";
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Ayer";
        } else {
            return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
        }
    };

    const groupMessagesByDate = (messages) => {
        const groups = {};
        messages.forEach((message) => {
            const date = formatMessageDate(message.createdAt);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };

    if (!conversation) {
        return (
            <div className="message-thread-empty">
                <div className="empty-state">
                    <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>Selecciona una conversación</h3>
                    <p>Elige una conversación de la lista o busca un usuario para empezar a chatear</p>
                </div>
            </div>
        );
    }

    const messageGroups = groupMessagesByDate(messages);

    return (
        <div className="message-thread">
            {/* Área de mensajes - sin header duplicado */}
            <div className="message-thread-messages">
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <div key={date}>
                        <div className="message-date-divider">
                            <span>{date}</span>
                        </div>
                        {dateMessages.map((message) => {
                            const isSent = message.sender.id === currentUserId;
                            return (
                                <div
                                    key={message.id}
                                    className={`message-bubble-container ${isSent ? "sent" : "received"}`}
                                >
                                    <div className={`message-bubble ${isSent ? "sent" : "received"}`}>
                                        <div className="message-content">{message.content}</div>
                                        <div className="message-time">{formatMessageTime(message.createdAt)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input de mensajes */}
            <MessageInput onSendMessage={onSendMessage} disabled={false} />
        </div>
    );
}

export default MessageThread;
