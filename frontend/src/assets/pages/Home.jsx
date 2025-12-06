import React, { useState, useEffect } from "react";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Modal from "../componentes/common/Modal";
import Publication from "../componentes/common/Publication";

function HomePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://127.0.0.1:8000/api/posts");

            if (!response.ok) {
                throw new Error("Error al cargar los posts");
            }

            const data = await response.json();

            // Ordenar por fecha de creación (más recientes primero)
            const sortedPosts = data.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB - dateA;
            });

            setPosts(sortedPosts);
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
                    {loading && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#666",
                            }}
                        >
                            Cargando posts...
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

                    {!loading && !error && posts.length === 0 && (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "40px",
                                fontSize: "16px",
                                color: "#666",
                            }}
                        >
                            No hay posts disponibles
                        </div>
                    )}

           {!loading &&
    !error &&
    posts.map((post) => (
        <Publication
            key={post.id}
            postId={post.id}
            userId={post.user?.id} // 👈 Añadir userId
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
            clickable={true}
        />
    ))}
                </main>
                <div className="spacer-right"></div>
            </div>
            <div className="navbarRight-content">
                <Navbar navbarType={2} onOpenModal={openModal} />
            </div>
            {isModalOpen && <Modal onClose={closeModal} />}
        </>
    );
}

export default HomePage;