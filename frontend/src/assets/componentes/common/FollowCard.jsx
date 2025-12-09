import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
}) => {
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followerCount, setFollowerCount] = useState(followers);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Actualizar isFollowing cuando cambie initialIsFollowing
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  // Truncar biografía si excede el límite
  const truncatedBio =
    bio && bio.length > maxBioLength
      ? bio.substring(0, maxBioLength) + "..."
      : bio || "Sin descripción";

  const handleFollowClick = async (e) => {
    e.stopPropagation();

    if (isLoading) return;

    try {
      setIsLoading(true);
      const currentUserStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!currentUserStr || !token) {
        alert("Debes iniciar sesión para seguir");
        return;
      }

      const currentUser = JSON.parse(currentUserStr);

      let endpoint, method, body;

      if (type === "community") {
        // Seguir/dejar de seguir comunidad
        endpoint = isFollowing
          ? `http://127.0.0.1:8000/api/users/${currentUser.id}/unfollow-community`
          : `http://127.0.0.1:8000/api/users/${currentUser.id}/follow-community`;
        method = isFollowing ? "DELETE" : "POST";
        body = { community_id: id };
      } else {
        // Seguir/dejar de seguir usuario
        endpoint = isFollowing
          ? `http://127.0.0.1:8000/api/users/${currentUser.id}/unfollow`
          : `http://127.0.0.1:8000/api/users/${currentUser.id}/follow`;
        method = isFollowing ? "DELETE" : "POST";
        body = { following_user_id: id };
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);
        setFollowerCount(followerCount + (newFollowingState ? 1 : -1));
      } else if (response.status === 409) {
        // Conflicto: ya sigue o ya no sigue - invertir el estado actual
        const newFollowingState = !isFollowing;
        setIsFollowing(newFollowingState);
        setFollowerCount(followerCount + (newFollowingState ? 1 : -1));
      } else {
        const data = await response.json();
        console.error("Error:", data);
        alert(data.error || "Error al seguir/dejar de seguir");
      }
    } catch (err) {
      console.error("Error al seguir/dejar de seguir:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    if (!id) return;
    if (type === "community") {
      navigate(`/community/${id}`);
    } else {
      navigate(`/profile/${id}`);
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
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {photoUrl && (
            <img
              src={photoUrl}
              alt={name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          )}
        </div>

        {/* Botón seguir */}
        <button
          onClick={handleFollowClick}
          style={{
            padding: "6px 16px",
            borderRadius: "20px",
            border: isFollowing
              ? "1px solid #ccc"
              : type === "community"
              ? "1px solid #00ba7c"
              : "1px solid #1da1f2",
            backgroundColor: isFollowing
              ? "#fff"
              : type === "community"
              ? "#00ba7c"
              : "#1da1f2",
            color: isFollowing ? "#000" : "#fff",
            fontWeight: "bold",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {isLoading ? "..." : isFollowing ? "Siguiendo" : "Seguir"}
        </button>
      </div>

      {/* Contenido debajo */}
      <div>
        {/* Nombre */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {name}
          </h3>
          {/* Badge de comunidad */}
          {type === "community" && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: "600",
                color: "#00ba7c",
                backgroundColor: "rgba(0, 186, 124, 0.1)",
                padding: "2px 8px",
                borderRadius: "8px",
                letterSpacing: "0.3px",
              }}
            >
              🌳 COMUNIDAD
            </span>
          )}
        </div>

        {/* Username (solo para usuarios) */}
        {type === "user" && username && (
          <div
            style={{
              fontSize: "14px",
              color: "#536471",
              marginBottom: "8px",
            }}
          >
            @{username}
          </div>
        )}

        {/* Estadísticas */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <span>
            <strong>{followerCount}</strong> seguidores
          </span>
          {type === "community" && (
            <>
              <span>•</span>
              <span>
                <strong>{members}</strong> miembros
              </span>
            </>
          )}
        </div>

        {/* Biografía */}
        <p
          style={{
            margin: "0",
            fontSize: "14px",
            color: "#333",
            lineHeight: "1.4",
          }}
        >
          {truncatedBio}
        </p>
      </div>
    </div>
  );
};

export default FollowCard;
