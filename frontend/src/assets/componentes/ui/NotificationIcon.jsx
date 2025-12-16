import React from "react";
import { Bell } from "lucide-react";
import "./../../styles/Navbar.css";

const NotificationIcon = ({ unreadCount, onClick }) => {
  return (
    <div className="link-icon" onClick={onClick}>
      <Bell size={26} strokeWidth={1.5} />
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      <span className="navicon">Notificaciones</span>
    </div>
  );
};

export default NotificationIcon;
