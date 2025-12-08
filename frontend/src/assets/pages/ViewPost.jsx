import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Publication from "../componentes/common/Publication";
import Reply from "../componentes/common/Reply";
import ReplyInput from "../componentes/common/ReplyInput";

function ViewPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replies, setReplies] = useState([]);
    const [repliesLoading, setRepliesLoading] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchReplies();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (!token) {
                navigate("/login");
                return;
            }

            // Construir URL con user_id si está autenticado
            let url = `http://127.0.0.1:8000/api/posts/${id}`;
            if (userStr) {
                const user = JSON.parse(userStr);
                url += `?user_id=${user.id}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cargar el post");
            }

            const data = await response.json();
            setPost(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchReplies = async () => {
        try {
            setRepliesLoading(true);

            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            let url = `http://127.0.0.1:8000/api/posts/${id}/replies`;
            if (userStr) {
                const user = JSON.parse(userStr);
                url += `?user_id=${user.id}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setReplies(data);
            }
        } catch (err) {
            console.error("Error fetching replies:", err);
        } finally {
            setRepliesLoading(false);
        }
    };

    const handleReplySubmitted = () => {
        fetchReplies();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const months = [
            "ene", "feb", "mar", "abr", "may", "jun",
            "jul", "ago", "sep", "oct", "nov", "dic"
        ];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    return (
        <div className="homepage-container">
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>

            <div className="main-layout-container">
                <main className="main-content">
                    {/* Botón de volver */}
                    <div style={{
                        padding: "16px",
                        borderBottom: "1px solid #eff3f4",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        backgroundColor: "#fff",
                        position: "sticky",
                        top: 0,
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
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#f7f9f9";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                            }}
                        >
                            ←
                        </button>
                        <h2 style={{
                            color: "#0f1419",
                            fontSize: "20px",
                            fontWeight: "700",
                            margin: 0
                        }}>
                            Post
                        </h2>
                    </div>

                    {loading && (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            fontSize: "16px",
                            color: "#666",
                        }}>
                            Cargando post...
                        </div>
                    )}

                    {error && (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            fontSize: "16px",
                            color: "#e74c3c",
                        }}>
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && post && (
                        //   <Publication
                        //     key={post.id}
                        //     postId={post.id}
                        //     userId={post.user?.id}
                        //     userName={post.user?.username || "Usuario"}
                        //     userProfileUrl={`/perfil/${post.user?.username}`}
                        //     communityId={post.community?.id}
                        //     communityName={post.community?.name}
                        //     communityPhotoUrl={post.community?.photo_url} // ✨ Nueva prop
                        //     date={formatDate(post.created_at)}
                        //     time={formatTime(post.created_at)}
                        //     text={post.content}
                        //     postImage={post.image}
                        //     postType={post.postType} // Asegúrate de que esto viene del backend
                        //     comments={0}
                        //     retweets={0}
                        //     like1={0}
                        //     like2={0}
                        //     clickable={false}  
                        //   />
                        <Publication
                            key={post.id}
                            postId={post.id}
                            userId={post.user?.id}
                            userName={post.user?.username || "Usuario"}
                            userProfileUrl={post.user?.photo_url}
                            communityId={post.community?.id}
                            communityName={post.community?.name}
                            communityPhotoUrl={post.community?.photo_url}
                            date={formatDate(post.created_at)}
                            time={formatTime(post.created_at)}
                            text={post.content}
                            postImage={post.image}
                            postType={post.postType}
                            comments={0}
                            retweets={post.reposts}
                            like1={post.leaf}
                            like2={post.tree}
                            clickable={true}
                            // Pasar datos de interacciones del usuario si existen
                            initialHasLikedLeaf={post.user_interactions?.has_liked_leaf || false}
                            initialHasLikedTree={post.user_interactions?.has_liked_tree || false}
                            initialHasReposted={post.user_interactions?.has_reposted || false}
                        />
                    )}

                    {!loading && !error && !post && (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            fontSize: "16px",
                            color: "#666",
                        }}>
                            Post no encontrado
                        </div>
                    )}

                    {/* Reply Input */}
                    {!loading && !error && post && (
                        <ReplyInput postId={id} onReplySubmitted={handleReplySubmitted} />
                    )}

                    {/* Replies Section */}
                    {!loading && !error && post && (
                        <div style={{
                            borderTop: "1px solid #eff3f4",
                            paddingTop: "16px"
                        }}>
                            <h3 style={{
                                padding: "0 16px",
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#0f1419",
                                marginBottom: "12px"
                            }}>
                                Respuestas
                            </h3>

                            {repliesLoading && (
                                <div style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    fontSize: "14px",
                                    color: "#666",
                                }}>
                                    Cargando respuestas...
                                </div>
                            )}

                            {!repliesLoading && replies.length === 0 && (
                                <div style={{
                                    textAlign: "center",
                                    padding: "20px",
                                    fontSize: "14px",
                                    color: "#666",
                                }}>
                                    No hay respuestas aún. ¡Sé el primero en responder!
                                </div>
                            )}

                            {!repliesLoading && replies.map((reply) => (
                                <Reply
                                    key={reply.id}
                                    replyId={reply.id}
                                    userId={reply.user?.id}
                                    userName={reply.user?.username || "Usuario"}
                                    userProfileUrl={reply.user?.photo_url}
                                    date={formatDate(reply.created_at)}
                                    time={formatTime(reply.created_at)}
                                    text={reply.content}
                                    replyImage={reply.image}
                                    like1={reply.leaf}
                                    initialHasLikedLeaf={reply.user_interactions?.has_liked_leaf || false}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            <div className="navbarRight-content">
                <Navbar navbarType={2} />
            </div>
        </div>
    );
}

export default ViewPost;