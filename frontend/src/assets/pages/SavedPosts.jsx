import React, { useState, useEffect } from "react";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import "../styles/app.css";
import Modal from "../componentes/common/Modal";
import Publication from "../componentes/common/Publication";
import { formatDate, formatTime } from "../utils/dateUtils";

function SavedPosts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    const fetchSavedPosts = async () => {
        try {
            setLoading(true);

            // Obtener usuario autenticado del localStorage
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userStr || !token) {
                setError("Debes iniciar sesión para ver tus posts guardados");
                setLoading(false);
                return;
            }

            const user = JSON.parse(userStr);

            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/saved-posts`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Error al cargar los posts guardados");
            }

            const data = await response.json();

            // Extraer los posts de los objetos SavedPosts
            const savedPosts = data.map(savedPost => savedPost.post);

            // Ordenar por fecha de guardado (más recientes primero)
            const sortedPosts = savedPosts.sort((a, b) => {
                const dateA = new Date(a.createdAt);
                const dateB = new Date(b.createdAt);
                return dateB - dateA;
            });

            setPosts(sortedPosts);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="homepage-container">
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            <div className="main-layout-container">
                <main className="main-content" style={{ padding: 0 }}>
                    {/* Header */}
                    <div style={{
                        position: "sticky",
                        top: 0,
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                        backdropFilter: "blur(12px)",
                        borderBottom: "1px solid #eff3f4",
                        padding: "12px 16px",
                        zIndex: 10
                    }}>
                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#0f1419",
                            margin: 0
                        }}>
                            Posts Guardados
                        </h2>
                        <p style={{
                            fontSize: "13px",
                            color: "#536471",
                            margin: "4px 0 0 0"
                        }}>
                            {posts.length} {posts.length === 1 ? 'post guardado' : 'posts guardados'}
                        </p>
                    </div>

                    {loading && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#666",
                            }}
                        >
                            Cargando posts guardados...
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#e74c3c",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "60px 40px",
                                fontSize: "16px",
                                color: "#536471",
                            }}
                        >
                            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📌</div>
                            <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: "700", color: "#0f1419" }}>
                                No tienes posts guardados
                            </h3>
                            <p style={{ margin: 0, fontSize: "15px" }}>
                                Guarda posts para verlos más tarde haciendo clic en el icono de marcador
                            </p>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        posts.map((post) => (
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
                                // Pasar datos de interacciones del usuario si existen
                                initialHasLikedLeaf={post.user_interactions?.has_liked_leaf || false}
                                initialHasLikedTree={post.user_interactions?.has_liked_tree || false}
                                initialHasReposted={post.user_interactions?.has_reposted || false}
                                initialIsSaved={true} // Todos los posts en esta página están guardados
                            />
                        ))}
                </main>
            </div>
            <div className="navbarRight-content">
                <Navbar navbarType={2} onOpenModal={openModal} />
            </div>
            {isModalOpen && <Modal onClose={closeModal} />}
        </div>
    );
}

export default SavedPosts;
