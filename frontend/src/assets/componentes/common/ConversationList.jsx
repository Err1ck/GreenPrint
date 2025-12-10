import React from "react";
import "../../styles/Messages.css";

function ConversationList({ conversations, selectedConversationId, onSelectConversation, currentUserId }) {
    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
        } else if (diffInHours < 48) {
            return "Ayer";
        } else {
            return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
        }
    };

    const truncateMessage = (text, maxLength = 50) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="conversation-list">
            <div className="conversation-list-header">
                <h2>Mensajes</h2>
            </div>
            <div className="conversation-list-items">
                {conversations.length === 0 ? (
                    <div className="no-conversations">
                        <p>No tienes conversaciones aún</p>
                        <p className="no-conversations-hint">Busca usuarios para empezar a chatear</p>
                    </div>
                ) : (
                    conversations.map((conversation) => {
                        const isUnread =
                            conversation.last_message &&
                            !conversation.last_message.is_read &&
                            conversation.last_message.sender_id !== currentUserId;

                        return (
                            <div
                                key={conversation.id}
                                className={`conversation-item ${selectedConversationId === conversation.id ? "selected" : ""
                                    } ${isUnread ? "unread" : ""}`}
                                onClick={() => onSelectConversation(conversation)}
                            >
                                <div className="conversation-avatar">
                                    {conversation.other_user.photo_url ? (
                                        <img
                                            src={`http://127.0.0.1:8000${conversation.other_user.photo_url}`}
                                            alt={conversation.other_user.username}
                                        />
                                    ) : (
                                        <div className="avatar-placeholder">
                                            {conversation.other_user.username?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="conversation-info">
                                    <div className="conversation-header">
                                        <span className="conversation-username">
                                            {conversation.other_user.username}
                                        </span>
                                        <span className="conversation-time">
                                            {formatTime(conversation.last_message_at)}
                                        </span>
                                    </div>
                                    <div className="conversation-preview">
                                        {conversation.last_message ? (
                                            <>
                                                {conversation.last_message.sender_id === currentUserId && (
                                                    <span className="you-prefix">Tú: </span>
                                                )}
                                                {truncateMessage(conversation.last_message.content)}
                                            </>
                                        ) : (
                                            <span className="no-messages">Sin mensajes</span>
                                        )}
                                    </div>
                                </div>
                                {isUnread && <div className="unread-indicator"></div>}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default ConversationList;
