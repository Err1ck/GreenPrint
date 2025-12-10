import React from "react";
import "../../styles/Messages.css";

function MessageInput({ onSendMessage, disabled }) {
    const [message, setMessage] = React.useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="message-input-container">
            <form onSubmit={handleSubmit} className="message-input-form">
                <textarea
                    className="message-input-textarea"
                    placeholder={disabled ? "Selecciona una conversación..." : "Escribe un mensaje..."}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={disabled}
                    rows="1"
                />
                <button
                    type="submit"
                    className="message-send-button"
                    disabled={!message.trim() || disabled}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </form>
        </div>
    );
}

export default MessageInput;
