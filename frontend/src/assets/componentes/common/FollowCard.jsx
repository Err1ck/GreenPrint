import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FollowUser from "./FollowUser";
import FollowCommunity from "./FollowCommunity";

const FollowCard = ({
  type = "community", // "community" o "user"
  id, // ID del usuario o comunidad
  name,
  username, // Solo para usuarios
  bio,
  members = 0, // Solo para comunidades
  followers = 0,
  photoUrl,
  maxBioLength = 100,
  initialIsFollowing = false, // Estado inicial de seguimiento
  onFollowChange, // Callback opcional cuando cambia el estado de seguimiento
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [followerCount, setFollowerCount] = useState(followers);

  // Truncar biografía si excede el límite
  const truncatedBio =
    bio && bio.length > maxBioLength
      ? bio.substring(0, maxBioLength) + "..."
      : bio || "Sin descripción";

  const handleCardClick = () => {
    if (!id) return;
    if (type === "community") {
      navigate(`/community/${id}`);
    } else {
      navigate(`/profile/${id}`);
    }
  };

  const handleFollowChange = () => {
    // Actualizar el contador de seguidores localmente
    setFollowerCount((prev) => prev + (initialIsFollowing ? -1 : 1));

    // Llamar al callback si existe
    if (onFollowChange) {
      onFollowChange();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: isHovered
          ? "var(--color-bg-secondary)"
          : "var(--color-bg)",
        borderBottom: "1px solid var(--color-bg-secondary)",
        padding: "12px 16px",
        margin: 0,
        transition: "background-color 0.2s ease",
        cursor: "pointer",
        fontFamily: "Arial, sans-serif",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header: Avatar y botón seguir */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "12px",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: type === "community" ? "12px" : "50%",
            backgroundColor: "#e0e0e0",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {photoUrl && (
            <img
              src={photoUrl.startsWith('http') ? photoUrl : `http://127.0.0.1:8000${photoUrl}`}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* Botón seguir - Usar componente apropiado según el tipo */}
        <div onClick={(e) => e.stopPropagation()}>
          {type === "community" ? (
            <FollowCommunity
              communityId={id}
              initialIsFollowing={initialIsFollowing}
              onFollowChange={handleFollowChange}
              style={{
                padding: "6px 16px",
                fontSize: "14px",
                minWidth: "90px",
              }}
            />
          ) : (
            <FollowUser
              userId={id}
              initialIsFollowing={initialIsFollowing}
              onFollowChange={handleFollowChange}
              style={{
                padding: "6px 16px",
                fontSize: "14px",
                minWidth: "90px",
              }}
            />
          )}
        </div>
      </div>

      {/* Información */}
      <div style={{ marginBottom: "8px" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: "15px",
            color: "var(--color-text-primary)",
            marginBottom: "2px",
          }}
        >
          {name}
        </div>
        {username && (
          <div style={{ fontSize: "14px", color: "#657786" }}>@{username}</div>
        )}
      </div>

      {/* Biografía */}
      <div
        style={{
          fontSize: "14px",
          color: "var(--color-text-primary)",
          marginBottom: "8px",
          lineHeight: "1.4",
        }}
      >
        {truncatedBio}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
        <div>
          <span style={{ fontWeight: "bold", color: "var(--color-text-primary)" }}>
            {followerCount}
          </span>{" "}
          <span style={{ color: "#657786" }}>Seguidores</span>
        </div>
        {type === "community" && (
          <div>
            <span style={{ fontWeight: "bold", color: "var(--color-text-primary)" }}>
              {members}
            </span>{" "}
            <span style={{ color: "#657786" }}>Miembros</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowCard;
