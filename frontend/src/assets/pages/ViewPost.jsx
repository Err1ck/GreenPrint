import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Publication from "../componentes/common/Publication";

function ViewPost() {
    const { id } = useParams(); // Obtener el ID del post desde la URL
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            
            // Obtener el token del localStorage
            const token = localStorage.getItem("token");
            
            if (!token) {
                // Si no hay token, redirigir al login
                navigate("/login");
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                // Token inválido o expirado
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

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const months = [
            "ene", "feb", "mar", "abr", "may", "jun",
            "jul", "ago", "sep", "oct", "nov", "dic"
        ];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    // Función para formatear la hora
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    return (
        <>
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            <div className="main-layout-container">
                <div className="spacer-left"></div>
                <main className="main-content">
                    {/* Botón de volver */}
                    <div style={{
                        padding: "16px",
                        borderBottom: "1px solid #2f3336",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
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
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "rgba(231, 233, 234, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                            }}
                        >
                            ←
                        </button>
                        <h2 style={{
                            color: "#e7e9ea",
                            fontSize: "20px",
                            fontWeight: "700",
                            margin: 0
                        }}>
                            Post
                        </h2>
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
                            Cargando post...
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
                            Error: {error}
                        </div>
                    )}

                    {!loading && !error && post && (
                        <Publication
                            key={post.id}
                            postId={post.id}
                            userName={post.user?.username || "Usuario"}
                            userProfileUrl={`/perfil/${post.user?.username}`}
                            date={formatDate(post.created_at)}
                            time={formatTime(post.created_at)}
                            text={post.content}
                            postImage={post.image}
                            comments={0}
                            retweets={0}
                            like1={0}
                            like2={0}
                            clickable={false}  
                        />
                    )}

                    {!loading && !error && !post && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#666",
                            }}
                        >
                            Post no encontrado
                        </div>
                    )}
                </main>
                <div className="spacer-right"></div>
            </div>
            <div className="navbarRight-content">
                <Navbar navbarType={2} />
            </div>
        </>
    );
}

export default ViewPost;