import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import MessageThread from "../componentes/common/MessageThread";
import "../styles/Messages.css";
import "../styles/Home.css";

function Messages() {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("conversations"); // "conversations" o "users"
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" o "chat"

  useEffect(() => {
    // Get current user from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchConversations(user.id);
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, []);

  // Handle conversation selection from navigation state
  useEffect(() => {
    if (location.state?.conversationId && conversations.length > 0) {
      const conversation = conversations.find(
        (c) => c.id === location.state.conversationId
      );
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [location.state, conversations]);

  const fetchConversations = async (userId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/conversations/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar conversaciones");
      }

      const data = await response.json();
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar usuarios");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/conversation/${conversationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar mensajes");
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.id);
    setViewMode("chat"); // Cambiar a vista de chat
  };

  const handleBackToList = () => {
    setViewMode("list"); // Volver a la lista
    setSelectedConversation(null);
  };

  const handleStartChat = async (user) => {
    if (!currentUser) return;

    try {
      const token = localStorage.getItem("token");
      // Obtener o crear conversación
      const response = await fetch(
        `http://127.0.0.1:8000/api/messages/conversation-with/${currentUser.id}/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear conversación");
      }

      const data = await response.json();

      // Crear objeto de conversación para el estado local
      const conversation = {
        id: data.conversation_id,
        other_user: {
          id: user.id,
          username: user.username,
          photo_url: user.photo_url,
        },
        last_message: null,
        last_message_at: null,
      };

      setSelectedConversation(conversation);
      setMessages(data.messages || []);
      setViewMode("chat"); // Cambiar a vista de chat

      // Actualizar lista de conversaciones
      fetchConversations(currentUser.id);
    } catch (error) {
      console.error("Error starting chat:", error);
      alert("Error al iniciar la conversación. Por favor, intenta de nuevo.");
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !currentUser) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_id: currentUser.id,
          receiver_id: selectedConversation.other_user.id,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar mensaje");
      }

      const newMessage = await response.json();
      setMessages([...messages, newMessage]);

      // Refresh conversations to update last message
      fetchConversations(currentUser.id);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error al enviar el mensaje. Por favor, intenta de nuevo.");
    }
  };

  // Filtrar usuarios según búsqueda
  const filteredUsers = users.filter((user) => {
    if (user.id === currentUser?.id) return false; // No mostrar el usuario actual
    return user.username?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!currentUser) {
    return (
      <div className="homepage-container">
        <div className="navbarLeft-content">
          <Navbar navbarType={1} navbarPage={"messages"} />
        </div>
        <div className="main-layout-container">
          <main className="main-content">
            <div className="messages-error">
              <p>Debes iniciar sesión para ver tus mensajes</p>
            </div>
          </main>
        </div>
        <div className="navbarRight-content">
          <Navbar navbarType={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <div className="navbarLeft-content">
        <Navbar navbarType={1} navbarPage={"messages"} />
      </div>
      <div className="main-layout-container">
        <main className="main-content" style={{ padding: 0 }}>
          <div className="messages-whatsapp-container">
            {/* Vista de Lista (Conversaciones/Usuarios) */}
            {viewMode === "list" && (
              <div className="messages-list-view">
                <div className="conversation-list-header">
                  <h2>Mensajes</h2>
                </div>

                {/* Tabs */}
                <div className="messages-tabs">
                  <div
                    className={`messages-tab ${
                      activeTab === "conversations" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("conversations")}
                  >
                    Conversaciones
                  </div>
                  <div
                    className={`messages-tab ${
                      activeTab === "users" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("users")}
                  >
                    Usuarios
                  </div>
                </div>

                {/* Search bar for users tab */}
                {activeTab === "users" && (
                  <div className="user-search-container">
                    <input
                      type="text"
                      placeholder="Buscar usuarios..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="user-search-input"
                    />
                  </div>
                )}

                {/* Conversations Tab */}
                {activeTab === "conversations" && (
                  <div className="conversation-list-items">
                    {conversations.length === 0 ? (
                      <div className="no-conversations">
                        <p>No tienes conversaciones aún</p>
                        <p className="no-conversations-hint">
                          Ve a la pestaña "Usuarios" para empezar a chatear
                        </p>
                      </div>
                    ) : (
                      conversations.map((conversation) => {
                        const isUnread =
                          conversation.last_message &&
                          !conversation.last_message.is_read &&
                          conversation.last_message.sender_id !==
                            currentUser.id;

                        return (
                          <div
                            key={conversation.id}
                            className={`conversation-item ${
                              isUnread ? "unread" : ""
                            }`}
                            onClick={() =>
                              handleSelectConversation(conversation)
                            }
                          >
                            <div className="conversation-avatar">
                              {conversation.other_user.photo_url ? (
                                <img
                                  src={`http://127.0.0.1:8000${conversation.other_user.photo_url}`}
                                  alt={conversation.other_user.username}
                                />
                              ) : (
                                <div className="avatar-placeholder">
                                  {conversation.other_user.username
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="conversation-info">
                              <div className="conversation-header">
                                <span className="conversation-username">
                                  {conversation.other_user.username}
                                </span>
                                <span className="conversation-time">
                                  {conversation.last_message_at &&
                                    new Date(
                                      conversation.last_message_at
                                    ).toLocaleTimeString("es-ES", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                </span>
                              </div>
                              <div className="conversation-preview">
                                {conversation.last_message ? (
                                  <>
                                    {conversation.last_message.sender_id ===
                                      currentUser.id && (
                                      <span className="you-prefix">Tú: </span>
                                    )}
                                    {conversation.last_message.content.length >
                                    50
                                      ? conversation.last_message.content.substring(
                                          0,
                                          50
                                        ) + "..."
                                      : conversation.last_message.content}
                                  </>
                                ) : (
                                  <span className="no-messages">
                                    Sin mensajes
                                  </span>
                                )}
                              </div>
                            </div>
                            {isUnread && (
                              <div className="unread-indicator"></div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Users Tab */}
                {activeTab === "users" && (
                  <div className="conversation-list-items">
                    {filteredUsers.length === 0 ? (
                      <div className="no-conversations">
                        <p>No se encontraron usuarios</p>
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <div key={user.id} className="user-item">
                          <div className="conversation-avatar">
                            {user.photo_url ? (
                              <img
                                src={`http://127.0.0.1:8000${user.photo_url}`}
                                alt={user.username}
                              />
                            ) : (
                              <div className="avatar-placeholder">
                                {user.username?.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="user-info">
                            <div className="user-username">{user.username}</div>
                            {user.biography && (
                              <div className="user-bio">
                                {user.biography.length > 40
                                  ? user.biography.substring(0, 40) + "..."
                                  : user.biography}
                              </div>
                            )}
                          </div>
                          <button
                            className="start-chat-button"
                            onClick={() => handleStartChat(user)}
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
                            Chat
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Vista de Chat */}
            {viewMode === "chat" && selectedConversation && (
              <div className="messages-chat-view">
                {/* Header del chat con botón de volver */}
                <div className="chat-header">
                  <button className="back-button" onClick={handleBackToList}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="chat-header-avatar">
                    {selectedConversation.other_user.photo_url ? (
                      <img
                        src={`http://127.0.0.1:8000${selectedConversation.other_user.photo_url}`}
                        alt={selectedConversation.other_user.username}
                      />
                    ) : (
                      <div className="avatar-placeholder-small">
                        {selectedConversation.other_user.username
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="chat-header-info">
                    <h3>{selectedConversation.other_user.username}</h3>
                  </div>
                </div>

                {/* Thread de mensajes */}
                <MessageThread
                  conversation={selectedConversation}
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  currentUserId={currentUser.id}
                />
              </div>
            )}
          </div>
        </main>
      </div>
      <div className="navbarRight-content">
        <Navbar navbarType={2} />
      </div>
    </div>
  );
}

export default Messages;
