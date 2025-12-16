import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const FollowUser = ({
    userId,
    initialIsFollowing = false,
    onFollowChange,
    style = {},
    className = ""
}) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // Check if current user is following this user
    useEffect(() => {
        checkIfFollowing();
    }, [userId]);

    const checkIfFollowing = async () => {
        try {
            const currentUserStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!currentUserStr || !token) return;

            const currentUser = JSON.parse(currentUserStr);

            // Don't check if viewing own profile
            if (currentUser.id === parseInt(userId)) return;

            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${currentUser.id}/following`,
                {
                    headers: { "Authorization": `Bearer ${token}` }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    const isFollowingUser = data.some(
                        follow => follow.followingUser?.id === parseInt(userId)
                    );
                    setIsFollowing(isFollowingUser);
                } else {
                    setIsFollowing(false);
                }
            }
        } catch (err) {
            console.error("Error checking follow status:", err);
        }
    };

    const handleFollowClick = async (e) => {
        e.stopPropagation();

        if (isLoading) return;

        try {
            const currentUserStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!currentUserStr || !token) {
                toast.error("Debes iniciar sesión para seguir usuarios");
                return;
            }

            const currentUser = JSON.parse(currentUserStr);

            setIsLoading(true);

            const endpoint = isFollowing
                ? `http://127.0.0.1:8000/api/users/${currentUser.id}/unfollow`
                : `http://127.0.0.1:8000/api/users/${currentUser.id}/follow`;

            const method = isFollowing ? 'DELETE' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    following_user_id: parseInt(userId)
                })
            });

            const data = await response.json();

            if (response.ok) {
                setIsFollowing(!isFollowing);
                // Call callback if provided
                if (onFollowChange) {
                    onFollowChange(!isFollowing);
                }
            } else if (response.status === 409) {
                // Conflict: already following or not following
                console.log("Conflicto detectado, sincronizando estado...");
                await checkIfFollowing();
                if (onFollowChange) {
                    onFollowChange();
                }
            } else {
                console.error("Error:", data);
                toast.error(data.error || "Error al seguir/dejar de seguir");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    // Don't render if viewing own profile
    const currentUserStr = localStorage.getItem('user');
    if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        if (currentUser.id === parseInt(userId)) {
            return null;
        }
    }

    return (
        <button
            onClick={handleFollowClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            className={className}
            style={{
                padding: "8px 24px",
                borderRadius: "9999px",
                fontSize: "15px",
                fontWeight: "700",
                border: isFollowing ? "1px solid #cfd9de" : "1px solid #0f1419",
                backgroundColor: isFollowing
                    ? (isHovered ? "#fee" : "transparent")
                    : (isHovered ? "#272c30" : "#0f1419"),
                color: isFollowing
                    ? (isHovered ? "#f4212e" : "#0f1419")
                    : "#ffffff",
                cursor: isLoading ? "wait" : "pointer",
                transition: "all 0.2s",
                opacity: isLoading ? 0.7 : 1,
                ...(isFollowing && isHovered && {
                    borderColor: "#f4212e"
                }),
                ...style
            }}
        >
            {isLoading
                ? "..."
                : (isFollowing
                    ? (isHovered ? "Dejar de seguir" : "Siguiendo")
                    : "Seguir"
                )
            }
        </button>
    );
};

export default FollowUser;
