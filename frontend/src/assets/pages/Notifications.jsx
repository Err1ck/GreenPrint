import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import Notification from "../componentes/common/Notification";
import "../styles/Notifications.css";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      navigate("/login");
      return;
    }

    fetchNotifications();
  }, [navigate]);

  const fetchNotifications = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userStr || !token) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(userStr);
      const response = await fetch(
        `http://127.0.0.1:8000/api/notifications?user_id=${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al cargar las notificaciones");
      }

      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/notifications/${notificationId}/mark-read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId
              ? { ...notif, is_read: true }
              : notif
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userStr || !token) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        `http://127.0.0.1:8000/api/notifications/mark-all-read?user_id=${user.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, is_read: true }))
        );
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <Navbar navbarType={1} navbarPage="none" />
        <main className="notifications-main">
          <div className="notifications-container">
            <div className="loading">Cargando notificaciones...</div>
          </div>
        </main>
        <Navbar navbarType={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <Navbar navbarType={1} navbarPage="none" />
        <main className="notifications-main">
          <div className="notifications-container">
            <div className="error">Error: {error}</div>
          </div>
        </main>
        <Navbar navbarType={3} />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <Navbar navbarType={1} navbarPage="none" />
      <main className="notifications-main">
        <div className="notifications-container">
          <div className="notifications-header">
            <h1>Notificaciones</h1>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="notifications-empty">
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <Notification
                  key={notification.id}
                  notificationId={notification.id}
                  type={notification.type}
                  message={notification.message}
                  actorUsername={notification.actor?.username}
                  actorPhotoUrl={notification.actor?.photo_url}
                  actorId={notification.actor?.id}
                  postId={notification.post?.id}
                  communityId={notification.community?.id}
                  communityName={notification.community?.name}
                  createdAt={notification.created_at}
                  isRead={notification.is_read}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Navbar navbarType={3} />
    </div>
  );
};

export default Notifications;
