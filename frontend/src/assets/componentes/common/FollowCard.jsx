import React, { useState } from "react";

const FollowCard = ({
    type = "community", // "community" o "user"
    name,
    username, // Solo para usuarios
    bio,
    members = 0, // Solo para comunidades
    followers = 0,
    photoUrl,
    maxBioLength = 100,
}) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(followers);
    const [isHovered, setIsHovered] = useState(false);

    // Truncar biografía si excede el límite
    const truncatedBio =
        bio && bio.length > maxBioLength
            ? bio.substring(0, maxBioLength) + "..."
            : bio || "Sin descripción";

    const handleFollowClick = (e) => {
        e.stopPropagation();
        if (isFollowing) {
            setFollowerCount(followerCount - 1);
        } else {
            setFollowerCount(followerCount + 1);
        }
        setIsFollowing(!isFollowing);
    };

    return (
        <div
            style={{
                backgroundColor: isHovered ? "#f7f9f9" : "#fff",
                borderBottom: "1px solid #eff3f4",
                padding: "12px 16px",
                margin: 0,
                transition: "background-color 0.2s ease",
                cursor: "pointer",
                fontFamily: "Arial, sans-serif"
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
                    marginBottom: "12px"
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
                        overflow: "hidden"
                    }}
                >
                    {photoUrl && (
                        <img
                            src={photoUrl}
                            alt={name}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
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
                        border: isFollowing ? "1px solid #ccc" : "1px solid #1da1f2",
                        backgroundColor: isFollowing ? "#fff" : "#1da1f2",
                        color: isFollowing ? "#000" : "#fff",
                        fontWeight: "bold",
                        fontSize: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                >
                    {isFollowing ? "Siguiendo" : "Seguir"}
                </button>
            </div>

            {/* Contenido debajo */}
            <div>
                {/* Nombre */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px"
                }}>
                    <h3
                        style={{
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "bold"
                        }}
                    >
                        {name}
                    </h3>
                    {/* Badge de comunidad */}
                    {type === "community" && (
                        <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "12px",
                            fontWeight: "600",
                            color: "#1d9bf0",
                            backgroundColor: "rgba(29, 155, 240, 0.1)",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            letterSpacing: "0.3px"
                        }}>
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
                            marginBottom: "8px"
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
                        color: "#666"
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
                        lineHeight: "1.4"
                    }}
                >
                    {truncatedBio}
                </p>
            </div>
        </div>
    );
};

export default FollowCard;