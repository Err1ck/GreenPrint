import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import FollowCard from "./FollowCard";

const ShowFollowersMembers = ({ isOpen, onClose, entityId, type, show }) => {
    const [communities, setCommunities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [adminIds, setAdminIds] = useState([]);

    useEffect(() => {
        if (isOpen && entityId) {
            fetchData();
        }
    }, [isOpen, entityId, type, show]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("token");
            const headers = token ? { "Authorization": `Bearer ${token}` } : {};

            let endpoint = "";
            let communitiesList = [];
            let usersList = [];
            let adminIdsList = [];

            if (type === "user") {
                // User followers/following logic
                if (show === "followers") {
                    endpoint = `http://127.0.0.1:8000/api/users/${entityId}/followers`;
                } else if (show === "following") {
                    endpoint = `http://127.0.0.1:8000/api/users/${entityId}/following`;
                }

                const response = await fetch(endpoint, { headers });
                if (!response.ok) throw new Error("Error al cargar los datos");

                const data = await response.json();

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (show === "followers") {
                            if (item.user) usersList.push(item.user);
                        } else {
                            if (item.followingUser) usersList.push(item.followingUser);
                        }
                    });
                }

                // Fetch followed communities if showing following
                if (show === "following") {
                    try {
                        const communitiesResponse = await fetch(
                            `http://127.0.0.1:8000/api/users/${entityId}/communities`,
                            { headers }
                        );

                        if (communitiesResponse.ok) {
                            const communitiesData = await communitiesResponse.json();
                            if (Array.isArray(communitiesData)) {
                                communitiesData.forEach(item => {
                                    if (item.community) communitiesList.push(item.community);
                                });
                            }
                        }
                    } catch (err) {
                        console.error("Error fetching communities:", err);
                    }
                }
            } else if (type === "community") {
                // Community followers/members logic
                if (show === "followers") {
                    endpoint = `http://127.0.0.1:8000/api/communities/${entityId}/followers`;
                } else if (show === "members") {
                    endpoint = `http://127.0.0.1:8000/api/communities/${entityId}/members`;
                }

                const response = await fetch(endpoint, { headers });
                if (!response.ok) throw new Error("Error al cargar los datos");

                const data = await response.json();

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        if (item.user) usersList.push(item.user);
                    });
                }

                // Fetch community admin IDs if showing members
                if (show === "members") {
                    try {
                        const communityResponse = await fetch(
                            `http://127.0.0.1:8000/api/communities/${entityId}`,
                            { headers }
                        );

                        if (communityResponse.ok) {
                            const communityData = await communityResponse.json();
                            adminIdsList = communityData.admin_ids || [];
                        }
                    } catch (err) {
                        console.error("Error fetching community data:", err);
                    }
                }
            }

            setCommunities(communitiesList);
            setUsers(usersList);
            setAdminIds(adminIdsList);
            setLoading(false);
        } catch (err) {
            console.error("Error in fetchData:", err);
            setError(err.message);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const totalCount = communities.length + users.length;

    let title = "";
    if (type === "user") {
        title = show === "followers" ? "Seguidores" : "Siguiendo";
    } else if (type === "community") {
        title = show === "followers" ? "Seguidores" : "Miembros";
    }

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
                            {type === "user" && show === "followers" && "Aún no tienes seguidores"}
                            {type === "user" && show === "following" && "Aún no sigues a nadie"}
                            {type === "community" && show === "followers" && "Esta comunidad aún no tiene seguidores"}
                            {type === "community" && show === "members" && "Esta comunidad aún no tiene miembros"}
                        </div>
                    )}

                    {!loading && !error && totalCount > 0 && (
                        <>
                            {/* Comunidades Section (only for user following) */}
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
                                            initialIsFollowing={show === "following"}
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
                                        <div key={`user-${user.id}`} style={{ position: "relative" }}>
                                            <FollowCard
                                                type="user"
                                                id={user.id}
                                                name={user.username}
                                                bio={user.biography}
                                                photoUrl={user.photo_url}
                                                maxBioLength={80}
                                                initialIsFollowing={type === "user" && show === "following"}
                                            />
                                            {/* Admin Badge for community members */}
                                            {type === "community" && show === "members" && adminIds.includes(user.id) && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "16px",
                                                        right: "16px",
                                                        padding: "4px 12px",
                                                        backgroundColor: "#00ba7c",
                                                        color: "#ffffff",
                                                        fontSize: "12px",
                                                        fontWeight: "700",
                                                        borderRadius: "12px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px"
                                                    }}
                                                >
                                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                                    </svg>
                                                    Administrador
                                                </div>
                                            )}
                                        </div>
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

export default ShowFollowersMembers;
