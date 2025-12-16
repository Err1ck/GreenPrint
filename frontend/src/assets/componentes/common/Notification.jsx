import React from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, TreeDeciduous, Repeat2, MessageCircle } from "lucide-react";
import "../../styles/Notification.css";
import defaultAvatar from "../../img/user.png";
import { toast } from "react-toastify";

const Notification = ({
  notificationId,
  type,
  message,
  actorUsername,
  actorPhotoUrl,
  actorId,
  postId,
  communityId,
  communityName,
  createdAt,
  isRead,
  onMarkAsRead,
}) => {
  const navigate = useNavigate();

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Ahora";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    return `${Math.floor(seconds / 604800)}sem`;
  };

  const getIcon = () => {
    switch (type) {
      case "like_leaf":
        return <Leaf size={20} color="#f91880" fill="#f91880" />;
      case "like_tree":
        return <TreeDeciduous size={20} color="#1d9bf0" fill="#1d9bf0" />;
      case "repost":
        return <Repeat2 size={20} color="#00ba7c" />;
      case "reply":
        return <MessageCircle size={20} color="#1d9bf0" />;
      case "membership_request":
      case "membership_accepted":
      case "membership_rejected":
        return <span style={{ fontSize: "20px" }}>🌳</span>;
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
    if (type === "membership_request" || type === "membership_accepted" || type === "membership_rejected") {
      if (communityId) {
        navigate(`/community/${communityId}`);
      }
    } else if (postId) {
      navigate(`/post/${postId}`);
    }
  };

  const handleAcceptMember = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/communities/${communityId}/accept-member/${actorId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.ok) {
        toast.success("Miembro aceptado exitosamente");
        onMarkAsRead(notificationId);
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al aceptar miembro");
      }
    } catch (error) {
      console.error("Error accepting member:", error);
      toast.error("Error al aceptar miembro");
    }
  };

  const handleRejectMember = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://127.0.0.1:8000/api/communities/${communityId}/reject-member/${actorId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.ok) {
        toast.success("Solicitud rechazada");
        onMarkAsRead(notificationId);
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Error al rechazar solicitud");
      }
    } catch (error) {
      console.error("Error rejecting member:", error);
      toast.error("Error al rechazar solicitud");
    }
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (actorId) {
      navigate(`/profile/${actorId}`);
    }
  };

  return (
    <div
      className={`notification-item ${!isRead ? "unread" : ""}`}
      onClick={handleClick}
    >
      <div className="notification-icon">{getIcon()}</div>

      <div
        className="notification-avatar"
        onClick={handleProfileClick}
        style={{ cursor: "pointer" }}
      >
        <img
          src={
            actorPhotoUrl
              ? actorPhotoUrl.startsWith("http")
                ? actorPhotoUrl
                : `http://127.0.0.1:8000${actorPhotoUrl}`
              : defaultAvatar
          }
          alt={actorUsername}
        />
      </div>

      <div className="notification-content">
        <p className="notification-message">
          <span
            className="notification-username"
            onClick={handleProfileClick}
            style={{ cursor: "pointer" }}
          >
            {actorUsername}
          </span>{" "}
          {message.replace(actorUsername, "").trim()}
        </p>
        <span className="notification-time">{getTimeAgo(createdAt)}</span>

        {type === "membership_request" && !isRead && (
          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <button
              onClick={handleAcceptMember}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                border: "none",
                backgroundColor: "#00ba7c",
                color: "#ffffff",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Aceptar
            </button>
            <button
              onClick={handleRejectMember}
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600",
                border: "1px solid #ccc",
                backgroundColor: "#ffffff",
                color: "#666",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              Rechazar
            </button>
          </div>
        )}
      </div>

      {!isRead && <div className="notification-unread-dot"></div>}
    </div>
  );
};

export default Notification;
