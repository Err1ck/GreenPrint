import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Publication from "../componentes/common/Publication";
import FollowCommunity from "../componentes/common/FollowCommunity";
import EditCommunityModal from "../componentes/common/EditCommunityModal";
import { formatDate, formatTime } from "../utils/dateUtils";

function ViewCommunity() {
    const { communityId } = useParams();
    const navigate = useNavigate();

    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
        fetchCommunityData();
    }, [communityId]);

    useEffect(() => {
        if (page > 1) {
            fetchMorePosts();
        }
    }, [page]);

    const fetchCommunityData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            // Obtener datos de la comunidad
            const communityResponse = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!communityResponse.ok) throw new Error("Error al cargar comunidad");

            const communityData = await communityResponse.json();
            setCommunity(communityData);

            // Check if current user is admin
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const currentUser = JSON.parse(userStr);
                const adminIds = communityData.admin_ids || [];
                setIsAdmin(adminIds.includes(currentUser.id));
            }

            // Obtener posts de la comunidad
            const postsResponse = await fetch(`http://127.0.0.1:8000/api/posts/community/${communityId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!postsResponse.ok) throw new Error("Error al cargar posts");

            const postsData = await postsResponse.json();

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

            const response = await fetch(`http://127.0.0.1:8000/api/posts/community/${communityId}`, {
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

    const updateFollowerCount = async () => {
        try {
            const token = localStorage.getItem("token");

            // Solo actualizar datos de la comunidad, no los posts
            const communityResponse = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (communityResponse.ok) {
                const communityData = await communityResponse.json();
                setCommunity(communityData);
            }
        } catch (err) {
            console.error("Error updating follower count:", err);
        }
    };


    if (loading) {
        return (
            <div className="homepage-container">
                <div className="navbarLeft-content">
                    <Navbar navbarType={1} navbarPage={"community"} />
                </div>
                <div className="main-layout-container">
                    <main className="main-content">
                        <div style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "400px"
                        }}>
                            <div className="spinner"></div>
                        </div>
                    </main>
                </div>
                <div className="navbarRight-content">
                    <Navbar navbarType={2} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="homepage-container">
                <div className="navbarLeft-content">
                    <Navbar navbarType={1} navbarPage={"community"} />
                </div>
                <div className="main-layout-container">
                    <main className="main-content">
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#e74c3c",
                            fontSize: "16px"
                        }}>
                            Error: {error}
                        </div>
                    </main>
                </div>
                <div className="navbarRight-content">
                    <Navbar navbarType={2} />
                </div>
            </div>
        );
    }

    return (
        <div className="homepage-container">
            <style>{`
                .spinner {
                    border: 3px solid rgba(0, 186, 124, 0.3);
                    border-top: 3px solid #00ba7c;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 0.8s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>

            <div className="navbarLeft-content">
                <Navbar navbarType={1} navbarPage={"community"} />
            </div>

            <div className="main-layout-container">
                <main className="main-content" style={{ padding: 0 }}>
                    {/* Header */}
                    <div style={{
                        padding: "16px",
                        borderBottom: "1px solid #eff3f4",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#fff",
                        zIndex: 10
                    }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#0f1419",
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
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#f7f9f9"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                fill="var(--color-text-primary)"
                            >
                                <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
                            </svg>
                        </button>
                        <div>
                            <h2 style={{
                                color: "#0f1419",
                                fontSize: "20px",
                                fontWeight: "700",
                                margin: 0
                            }}>
                                {community?.name || "Comunidad"}
                            </h2>
                            <p style={{
                                color: "#536471",
                                fontSize: "13px",
                                margin: 0
                            }}>
                                {posts.length} posts
                            </p>
                        </div>
                    </div>

                    {/* Banner */}
                    <div
                        style={{
                            width: "100%",
                            height: "200px",
                            backgroundColor: community?.banner_url ? "transparent" : "#cfd9de",
                            backgroundImage: community?.banner_url ? `url(${community.banner_url.startsWith('http') ? community.banner_url : `http://127.0.0.1:8000${community.banner_url}`})` : "none",
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    />

                    {/* Community Info Section */}
                    <div
                        style={{
                            padding: "12px 16px",
                            borderBottom: "var(--size-border) solid var(--color-bg-secondary)"
                        }}
                    >
                        {/* Avatar and Follow Button */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginTop: "-68px",
                                marginBottom: "12px"
                            }}
                        >
                            {/* Square Avatar with Rounded Corners */}
                            <div
                                style={{
                                    width: "134px",
                                    height: "134px",
                                    borderRadius: "20px",
                                    border: "4px solid #ffffff",
                                    backgroundColor: "#cfd9de",
                                    backgroundImage: community?.photo_url ? `url(${community.photo_url.startsWith('http') ? community.photo_url : `http://127.0.0.1:8000${community.photo_url}`})` : "none",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "48px",
                                    fontWeight: "700",
                                    color: "#ffffff"
                                }}
                            >
                                {!community?.photo_url && (community?.name?.charAt(0).toUpperCase() || "C")}
                            </div>

                            {/* Admin Edit Button or Follow Button */}
                            {isAdmin ? (
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    style={{
                                        marginTop: "72px",
                                        padding: "8px 24px",
                                        borderRadius: "9999px",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        border: "1px solid #00ba7c",
                                        backgroundColor: "#00ba7c",
                                        color: "#ffffff",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#009966"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "#00ba7c"}
                                >
                                    Editar Comunidad
                                </button>
                            ) : (
                                <FollowCommunity
                                    communityId={parseInt(communityId)}
                                    onFollowChange={() => updateFollowerCount()}
                                    style={{ marginTop: "72px" }}
                                />
                            )}
                        </div>

                        {/* Community Name and Badge */}
                        <div style={{ marginBottom: "12px" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "2px"
                            }}>
                                <h1
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "700",
                                        color: "var(--color-text-primary)",
                                        margin: 0
                                    }}
                                >
                                    {community?.name || "Comunidad"}
                                </h1>
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
                                        letterSpacing: "0.3px"
                                    }}
                                >
                                    🌳 COMUNIDAD
                                </span>
                            </div>
                        </div>

                        {/* Biography */}
                        {community?.biography && (
                            <div style={{ marginBottom: "12px" }}>
                                <p
                                    style={{
                                        fontSize: "15px",
                                        color: "var(--color-text-primary)",
                                        margin: 0,
                                        lineHeight: "20px",
                                        whiteSpace: "pre-wrap"
                                    }}
                                >
                                    {community.biography}
                                </p>
                            </div>
                        )}

                        {/* Stats Section (Followers and Members) */}
                        <div
                            style={{
                                display: "flex",
                                gap: "24px",
                                marginTop: "12px"
                            }}
                        >
                            {/* Followers */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "8px 16px",
                                    backgroundColor: "#ecfce7",
                                    borderRadius: "16px"
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="#00ba7c">
                                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                                </svg>
                                <div>
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            color: "#536471",
                                            margin: 0,
                                            lineHeight: "1"
                                        }}
                                    >
                                        Seguidores
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "17px",
                                            fontWeight: "700",
                                            color: "#00ba7c",
                                            margin: 0,
                                            lineHeight: "1.3"
                                        }}
                                    >
                                        {community?.follower_count || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Members */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "8px 16px",
                                    backgroundColor: "#e8f5fd",
                                    borderRadius: "16px"
                                }}
                            >
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="#00ba7c">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                </svg>
                                <div>
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            color: "#536471",
                                            margin: 0,
                                            lineHeight: "1"
                                        }}
                                    >
                                        Miembros
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "17px",
                                            fontWeight: "700",
                                            color: "#00ba7c",
                                            margin: 0,
                                            lineHeight: "1.3"
                                        }}
                                    >
                                        {community?.member_count || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Section */}
                    <div>
                        {posts.length === 0 ? (
                            <div style={{
                                textAlign: "center",
                                padding: "40px",
                                color: "#536471",
                                backgroundColor: "#fff"
                            }}>
                                Esta comunidad aún no tiene posts
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
                                                communityId={community?.id}
                                                communityName={community?.name}
                                                communityPhotoUrl={community?.photo_url}
                                                date={formatDate(post.createdAt)}
                                                time={formatTime(post.createdAt)}
                                                text={post.content}
                                                postImage={post.image}
                                                postType={post.postType}
                                                comments={0}
                                                retweets={0}
                                                like1={0}
                                                like2={0}
                                                clickable={true}
                                                initialHasLikedLeaf={post.user_interactions?.has_liked_leaf || false}
                                                initialHasLikedTree={post.user_interactions?.has_liked_tree || false}
                                                initialHasReposted={post.user_interactions?.has_reposted || false}
                                                initialIsSaved={post.user_interactions?.has_saved || false}
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
                                            communityId={community?.id}
                                            communityName={community?.name}
                                            communityPhotoUrl={community?.photo_url}
                                            date={formatDate(post.createdAt)}
                                            time={formatTime(post.createdAt)}
                                            text={post.content}
                                            postImage={post.image}
                                            postType={post.postType}
                                            comments={0}
                                            retweets={0}
                                            like1={0}
                                            like2={0}
                                            clickable={true}
                                            initialHasLikedLeaf={post.user_interactions?.has_liked_leaf || false}
                                            initialHasLikedTree={post.user_interactions?.has_liked_tree || false}
                                            initialHasReposted={post.user_interactions?.has_reposted || false}
                                            initialIsSaved={post.user_interactions?.has_saved || false}
                                        />
                                    );
                                }
                            })
                        )}

                        {loadingPosts && (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "20px",
                                backgroundColor: "#fff"
                            }}>
                                <div className="spinner"></div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <div className="navbarRight-content">
                <Navbar navbarType={2} />
            </div>

            {/* Edit Community Modal */}
            <EditCommunityModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                communityId={communityId}
            />
        </div>
    );
}

export default ViewCommunity;
