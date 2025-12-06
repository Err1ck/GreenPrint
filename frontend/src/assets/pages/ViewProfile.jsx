import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Publication from "../componentes/common/Publication";

function ViewProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    
    const observer = useRef();
    const lastPostRef = useCallback(node => {
        if (loadingPosts) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loadingPosts, hasMore]);

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    useEffect(() => {
        if (page > 1) {
            fetchMorePosts();
        }
    }, [page]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            if (!token) {
                navigate("/login");
                return;
            }

            // Obtener datos del usuario
            const userResponse = await fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!userResponse.ok) throw new Error("Error al cargar usuario");
            
            const userData = await userResponse.json();
            setUser(userData);

            // Obtener posts del usuario
            const postsResponse = await fetch(`http://127.0.0.1:8000/api/posts/user/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!postsResponse.ok) throw new Error("Error al cargar posts");
            
            const postsData = await postsResponse.json();
            
            // Simular paginación (tomar primeros 10 posts)
            const initialPosts = postsData.slice(0, 10);
            setPosts(initialPosts);
            setHasMore(postsData.length > 10);
            
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchMorePosts = async () => {
        try {
            setLoadingPosts(true);
            const token = localStorage.getItem("token");
            
            const response = await fetch(`http://127.0.0.1:8000/api/posts/user/${userId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Error al cargar más posts");
            
            const allPosts = await response.json();
            const start = page * 10;
            const end = start + 10;
            const newPosts = allPosts.slice(start, end);
            
            setPosts(prev => [...prev, ...newPosts]);
            setHasMore(end < allPosts.length);
            setLoadingPosts(false);
        } catch (err) {
            console.error(err);
            setLoadingPosts(false);
        }
    };

    const handleFollow = async () => {
        // Implementar lógica de seguir/dejar de seguir
        setIsFollowing(!isFollowing);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#000"
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#000",
                color: "#e74c3c",
                fontSize: "16px"
            }}>
                Error: {error}
            </div>
        );
    }

    return (
        <>
            <style>{`
                .spinner {
                    border: 3px solid rgba(29, 155, 240, 0.3);
                    border-top: 3px solid #1d9bf0;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .profile-banner {
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    position: relative;
                }
                
                .profile-content {
                    padding: 0 16px;
                    position: relative;
                }
                
                .profile-avatar-container {
                    margin-top: -75px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                
                .profile-avatar {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    border: 4px solid #000;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    color: white;
                    font-weight: bold;
                }
                
                .follow-button {
                    padding: 8px 24px;
                    border-radius: 9999px;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #536471;
                }
                
                .follow-button.following {
                    background: transparent;
                    color: #e7e9ea;
                }
                
                .follow-button.not-following {
                    background: #eff3f4;
                    color: #0f1419;
                    border: none;
                }
                
                .follow-button:hover {
                    opacity: 0.9;
                }
            `}</style>

            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            
            <div className="main-layout-container">
                <div className="spacer-left"></div>
                
                <main className="main-content" style={{ padding: 0 }}>
                    {/* Header con botón de volver */}
                    <div style={{
                        padding: "16px",
                        borderBottom: "1px solid #2f3336",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.65)",
                        backdropFilter: "blur(12px)",
                        zIndex: 10
                    }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#e7e9ea",
                                cursor: "pointer",
                                fontSize: "20px",
                                padding: "8px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                transition: "background-color 0.2s"
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(231, 233, 234, 0.1)"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                            ←
                        </button>
                        <div>
                            <h2 style={{
                                color: "#e7e9ea",
                                fontSize: "20px",
                                fontWeight: "700",
                                margin: 0
                            }}>
                                {user?.username || "Usuario"}
                            </h2>
                            <p style={{
                                color: "#71767b",
                                fontSize: "13px",
                                margin: 0
                            }}>
                                {posts.length} posts
                            </p>
                        </div>
                    </div>

                    {/* Banner */}
                    <div className="profile-banner"></div>

                    {/* Info del perfil */}
                    <div className="profile-content">
                        <div className="profile-avatar-container">
                            <div className="profile-avatar">
                                {user?.username?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <button
                                onClick={handleFollow}
                                className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}
                            >
                                {isFollowing ? "Siguiendo" : "Seguir"}
                            </button>
                        </div>

                        {/* Nombre y username */}
                        <div style={{ marginBottom: "12px" }}>
                            <h2 style={{
                                color: "#e7e9ea",
                                fontSize: "20px",
                                fontWeight: "700",
                                margin: 0
                            }}>
                                {user?.username || "Usuario"}
                            </h2>
                            <p style={{
                                color: "#71767b",
                                fontSize: "15px",
                                margin: 0
                            }}>
                                @{user?.username || "usuario"}
                            </p>
                        </div>

                        {/* Biografía */}
                        {user?.biography && (
                            <p style={{
                                color: "#e7e9ea",
                                fontSize: "15px",
                                marginBottom: "12px"
                            }}>
                                {user.biography}
                            </p>
                        )}

                        {/* Stats */}
                        <div style={{
                            display: "flex",
                            gap: "20px",
                            marginBottom: "16px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid #2f3336"
                        }}>
                            <div>
                                <span style={{ color: "#e7e9ea", fontWeight: "700" }}>
                                    {user?.follower_count || 0}
                                </span>
                                <span style={{ color: "#71767b", marginLeft: "4px" }}>
                                    Seguidores
                                </span>
                            </div>
                            <div>
                                <span style={{ color: "#e7e9ea", fontWeight: "700" }}>
                                    {user?.leaf_coins_user || 0}
                                </span>
                                <span style={{ color: "#71767b", marginLeft: "4px" }}>
                                    🍃 Leaf Coins
                                </span>
                            </div>
                            <div>
                                <span style={{ color: "#e7e9ea", fontWeight: "700" }}>
                                    {user?.tree_coins_community || 0}
                                </span>
                                <span style={{ color: "#71767b", marginLeft: "4px" }}>
                                    🌳 Tree Coins
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Posts */}
                    <div>
                        {posts.length === 0 ? (
                            <div style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#71767b"
                            }}>
                                Este usuario aún no tiene posts
                            </div>
                        ) : (
                            posts.map((post, index) => {
                                if (posts.length === index + 1) {
                                    return (
                                        <div ref={lastPostRef} key={post.id}>
                                            <Publication
                                                postId={post.id}
                                                userName={post.user?.username || "Usuario"}
                                                userId={post.user?.id}
                                                date={formatDate(post.created_at)}
                                                time={formatTime(post.created_at)}
                                                text={post.content}
                                                postImage={post.image}
                                                comments={0}
                                                retweets={0}
                                                like1={0}
                                                like2={0}
                                                clickable={true}
                                            />
                                        </div>
                                    );
                                } else {
                                    return (
                                        <Publication
                                            key={post.id}
                                            postId={post.id}
                                            userName={post.user?.username || "Usuario"}
                                            userId={post.user?.id}
                                            date={formatDate(post.created_at)}
                                            time={formatTime(post.created_at)}
                                            text={post.content}
                                            postImage={post.image}
                                            comments={0}
                                            retweets={0}
                                            like1={0}
                                            like2={0}
                                            clickable={true}
                                        />
                                    );
                                }
                            })
                        )}
                        
                        {loadingPosts && (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "20px"
                            }}>
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                </main>
                
                <div className="spacer-right"></div>
            </div>
            
            <div className="navbarRight-content">
                <Navbar navbarType={2} />
            </div>
        </>
    );
}

export default ViewProfile;