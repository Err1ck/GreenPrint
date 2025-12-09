import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import Publication from "../componentes/common/Publication";
import FollowCard from "../componentes/common/FollowCard";
import Modal from "../componentes/common/Modal";
import { formatDate, formatTime } from "../utils/dateUtils";
import "../styles/Home.css";
import "../styles/app.css";

function Search() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("users"); // "users" o "posts"
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Leer el parámetro 'q' de la URL al cargar el componente
    useEffect(() => {
        const query = searchParams.get('q');
        if (query) {
            setSearchQuery(query);
            // Si es un hashtag, cambiar a la pestaña de posts
            if (query.startsWith('#')) {
                setActiveTab('posts');
            }
        }
    }, [searchParams]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            // Fetch users
            const usersResponse = await fetch("http://127.0.0.1:8000/api/users", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (usersResponse.ok) {
                const usersData = await usersResponse.json();
                setUsers(usersData);
            }

            // Fetch communities
            const communitiesResponse = await fetch("http://127.0.0.1:8000/api/communities", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (communitiesResponse.ok) {
                const communitiesData = await communitiesResponse.json();
                setCommunities(communitiesData);
            }

            // Fetch posts
            let postsUrl = "http://127.0.0.1:8000/api/posts";
            if (userStr) {
                const user = JSON.parse(userStr);
                postsUrl += `?user_id=${user.id}`;
            }
            const postsResponse = await fetch(postsUrl);
            if (postsResponse.ok) {
                const postsData = await postsResponse.json();
                setPosts(postsData);
            }

            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Filtrar usuarios y comunidades según la búsqueda
    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCommunities = communities.filter(community =>
        community.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filtrar posts según la búsqueda
    const filteredPosts = posts.filter(post =>
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const handleCommunityClick = (communityId) => {
        navigate(`/community/${communityId}`);
    };

    return (
        <div className="homepage-container">
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            <div className="main-layout-container">
                <main className="main-content" style={{ padding: 0 }}>
                    {/* Header con barra de búsqueda */}
                    <div style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(12px)",
                        borderBottom: "1px solid #eff3f4",
                        zIndex: 10
                    }}>
                        {/* Barra de búsqueda */}
                        <div style={{ padding: "12px 16px" }}>
                            <div style={{
                                position: "relative",
                                width: "100%"
                            }}>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 48px",
                                        borderRadius: "9999px",
                                        border: "1px solid #eff3f4",
                                        backgroundColor: "#f7f9f9",
                                        fontSize: "15px",
                                        outline: "none",
                                        transition: "all 0.2s"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.backgroundColor = "#fff";
                                        e.target.style.borderColor = "#00ba7c";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.backgroundColor = "#f7f9f9";
                                        e.target.style.borderColor = "#eff3f4";
                                    }}
                                />
                                <svg
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="#536471"
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)"
                                    }}
                                >
                                    <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
                                </svg>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div style={{
                            display: "flex",
                            borderBottom: "1px solid #eff3f4"
                        }}>
                            <div
                                onClick={() => setActiveTab("users")}
                                style={{
                                    flex: 1,
                                    padding: "16px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    fontWeight: activeTab === "users" ? "700" : "500",
                                    fontSize: "15px",
                                    color: activeTab === "users" ? "#0f1419" : "#536471",
                                    transition: "background-color 0.2s",
                                    backgroundColor: "transparent"
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#f7f9f9"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                            >
                                Usuarios
                                {activeTab === "users" && (
                                    <div style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: "4px",
                                        backgroundColor: "#00ba7c",
                                        borderRadius: "9999px"
                                    }} />
                                )}
                            </div>
                            <div
                                onClick={() => setActiveTab("posts")}
                                style={{
                                    flex: 1,
                                    padding: "16px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    position: "relative",
                                    fontWeight: activeTab === "posts" ? "700" : "500",
                                    fontSize: "15px",
                                    color: activeTab === "posts" ? "#0f1419" : "#536471",
                                    transition: "background-color 0.2s",
                                    backgroundColor: "transparent"
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = "#f7f9f9"}
                                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                            >
                                Posts
                                {activeTab === "posts" && (
                                    <div style={{
                                        position: "absolute",
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        height: "4px",
                                        backgroundColor: "#00ba7c",
                                        borderRadius: "9999px"
                                    }} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div>
                        {loading && (
                            <div style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#666"
                            }}>
                                Cargando...
                            </div>
                        )}

                        {error && (
                            <div style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#e74c3c"
                            }}>
                                Error: {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <>
                                {/* Tab de Usuarios */}
                                {activeTab === "users" && (
                                    <div>
                                        {filteredUsers.length === 0 && filteredCommunities.length === 0 && (
                                            <div style={{
                                                textAlign: "center",
                                                padding: "40px",
                                                fontSize: "16px",
                                                color: "#666"
                                            }}>
                                                {searchQuery ? "No se encontraron resultados" : "No hay usuarios o comunidades disponibles"}
                                            </div>
                                        )}

                                        {/* Usuarios */}
                                        {filteredUsers.map(user => (
                                            <div key={`user-${user.id}`} onClick={() => handleUserClick(user.id)}>
                                                <FollowCard
                                                    type="user"
                                                    name={user.username}
                                                    username={user.username}
                                                    bio={user.biography}
                                                    followers={user.follower_count || 0}
                                                    photoUrl={user.photo_url}
                                                />
                                            </div>
                                        ))}

                                        {/* Comunidades */}
                                        {filteredCommunities.map(community => (
                                            <div key={`community-${community.id}`} onClick={() => handleCommunityClick(community.id)}>
                                                <FollowCard
                                                    type="community"
                                                    name={community.name}
                                                    bio={community.biography}
                                                    followers={community.follower_count || 0}
                                                    members={community.member_count || 0}
                                                    photoUrl={community.photo_url}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Tab de Posts */}
                                {activeTab === "posts" && (
                                    <div>
                                        {filteredPosts.length === 0 && (
                                            <div style={{
                                                textAlign: "center",
                                                padding: "40px",
                                                fontSize: "16px",
                                                color: "#666"
                                            }}>
                                                {searchQuery ? "No se encontraron posts" : "No hay posts disponibles"}
                                            </div>
                                        )}

                                        {filteredPosts.map(post => (
                                            <Publication
                                                key={post.id}
                                                postId={post.id}
                                                userId={post.user?.id}
                                                userName={post.user?.username || "Usuario"}
                                                userProfileUrl={post.user?.photo_url}
                                                communityId={post.community?.id}
                                                communityName={post.community?.name}
                                                communityPhotoUrl={post.community?.photo_url}
                                                date={formatDate(post.createdAt)}
                                                time={formatTime(post.createdAt)}
                                                text={post.content}
                                                postImage={post.image}
                                                postType={post.postType}
                                                comments={post.replies || 0}
                                                retweets={post.reposts}
                                                like1={post.leaf}
                                                like2={post.tree}
                                                clickable={true}
                                                initialHasLikedLeaf={post.user_interactions?.has_liked_leaf || false}
                                                initialHasLikedTree={post.user_interactions?.has_liked_tree || false}
                                                initialHasReposted={post.user_interactions?.has_reposted || false}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
            <div className="navbarRight-content">
                <Navbar navbarType={2} onOpenModal={openModal} />
            </div>
            {isModalOpen && <Modal onClose={closeModal} />}
        </div>
    );
}

export default Search;
