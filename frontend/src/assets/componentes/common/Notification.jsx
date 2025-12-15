import React from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, TreeDeciduous, Repeat2, MessageCircle } from "lucide-react";
import "../../styles/Notification.css";
import defaultAvatar from "../../img/user.png";

const Notification = ({
  notificationId,
  type,
  message,
  actorUsername,
  actorPhotoUrl,
  actorId,
  postId,
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
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (!isRead && onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
    if (postId) {
      navigate(`/post/${postId}`);
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
      </div>

      {!isRead && <div className="notification-unread-dot"></div>}
    </div>
  );
};

export default Notification;
