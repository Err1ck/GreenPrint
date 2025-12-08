import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import FollowCard from "./FollowCard";

const FollowListModal = ({ isOpen, onClose, userId, type }) => {
    const [communities, setCommunities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && userId) {
            fetchFollowData();
        }
    }, [isOpen, userId, type]);

    const fetchFollowData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const headers = token ? { "Authorization": `Bearer ${token}` } : {};

            // Determinar qué endpoint usar según el tipo
            const endpoint = type === "followers"
                ? `http://127.0.0.1:8000/api/users/${userId}/followers`
                : `http://127.0.0.1:8000/api/users/${userId}/following`;

            console.log("Fetching from endpoint:", endpoint);

            const response = await fetch(endpoint, { headers });

            if (!response.ok) {
                throw new Error("Error al cargar los datos");
            }

            const data = await response.json();
            console.log("Response data:", data);

            // Separar comunidades y usuarios
            const communitiesList = [];
            const usersList = [];

            // Verificar si data es un array o un objeto con mensaje
            if (Array.isArray(data)) {
                data.forEach(item => {
                    console.log("Processing item:", item);
                    if (type === "followers") {
                        // Para seguidores, obtenemos el usuario que sigue
                        if (item.user) {
                            usersList.push(item.user);
                        }
                    } else {
                        // Para seguidos, obtenemos a quien sigue
                        // El backend devuelve 'followingUser' en camelCase
                        if (item.followingUser) {
                            usersList.push(item.followingUser);
                        }
                    }
                });
            } else if (data.message) {
                // Si el backend devuelve un mensaje (ej: "Este usuario no sigue a nadie")
                console.log("Backend returned message:", data.message);
                // No hacer nada, las listas quedan vacías
            }

            // Obtener comunidades seguidas si es "following"
            if (type === "following") {
                try {
                    const communitiesResponse = await fetch(
                        `http://127.0.0.1:8000/api/users/${userId}/communities`,
                        { headers }
                    );

                    if (communitiesResponse.ok) {
                        const communitiesData = await communitiesResponse.json();
                        console.log("Communities data:", communitiesData);

                        if (Array.isArray(communitiesData)) {
                            communitiesData.forEach(item => {
                                if (item.community) {
                                    communitiesList.push(item.community);
                                }
                            });
                        }
                    }
                } catch (commErr) {
                    console.error("Error fetching communities:", commErr);
                    // No lanzar error, solo continuar sin comunidades
                }
            }

            console.log("Final communities:", communitiesList);
            console.log("Final users:", usersList);

            setCommunities(communitiesList);
            setUsers(usersList);
            setLoading(false);
        } catch (err) {
            console.error("Error in fetchFollowData:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalCount = communities.length + users.length;
    const title = type === "followers" ? "Seguidores" : "Siguiendo";

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    width: "90%",
                    maxWidth: "600px",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #eff3f4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#0f1419",
                            margin: 0,
                        }}
                    >
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = "#f7f9f9")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = "transparent")
                        }
                    >
                        <X size={20} color="#0f1419" strokeWidth={2} />
                    </button>
                </div>

                {/* Content */}
                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "0",
                    }}
                >
                    {loading && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#536471",
                            }}
                        >
                            Cargando...
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#e74c3c",
                            }}
                        >
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && totalCount === 0 && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#536471",
                            }}
                        >
                            {type === "followers"
                                ? "Aún no tienes seguidores"
                                : "Aún no sigues a nadie"}
                        </div>
                    )}

                    {!loading && !error && totalCount > 0 && (
                        <>
                            {/* Comunidades Section */}
                            {communities.length > 0 && (
                                <>
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            backgroundColor: "#f7f9f9",
                                            borderBottom: "1px solid #eff3f4",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "700",
                                                color: "#0f1419",
                                                margin: 0,
                                            }}
                                        >
                                            Comunidades ({communities.length})
                                        </h3>
                                    </div>
                                    {communities.map((community) => (
                                        <FollowCard
                                            key={`community-${community.id}`}
                                            type="community"
                                            id={community.id}
                                            name={community.name}
                                            bio={community.biography}
                                            members={community.member_count || 0}
                                            followers={community.follower_count || 0}
                                            photoUrl={community.photo_url}
                                            maxBioLength={80}
                                        />
                                    ))}
                                </>
                            )}

                            {/* Usuarios Section */}
                            {users.length > 0 && (
                                <>
                                    <div
                                        style={{
                                            padding: "12px 16px",
                                            backgroundColor: "#f7f9f9",
                                            borderBottom: "1px solid #eff3f4",
                                            marginTop: communities.length > 0 ? "8px" : "0",
                                        }}
                                    >
                                        <h3
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "700",
                                                color: "#0f1419",
                                                margin: 0,
                                            }}
                                        >
                                            Usuarios ({users.length})
                                        </h3>
                                    </div>
                                    {users.map((user) => (
                                        <FollowCard
                                            key={`user-${user.id}`}
                                            type="user"
                                            id={user.id}
                                            name={user.username}
                                            bio={user.biography}
                                            photoUrl={user.photo_url}
                                            maxBioLength={80}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowListModal;
