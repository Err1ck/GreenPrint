import React, { useState, useEffect } from "react";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import "../styles/app.css";
import Modal from "../componentes/common/Modal";
import Publication from "../componentes/common/Publication";
import { formatDate, formatTime } from "../utils/dateUtils";

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

      // Obtener usuario autenticado del localStorage
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Construir URL con user_id si está autenticado
      let url = "http://127.0.0.1:8000/api/posts";
      if (userStr && token) {
        const user = JSON.parse(userStr);
        url += `?user_id=${user.id}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al cargar los posts");
      }

      const data = await response.json();

      // Ordenar por fecha de creación (más recientes primero)
      const sortedPosts = data.sort((a, b) => {
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
        <Navbar navbarType={1} navbarPage={"home"}/>
      </div>
      <div className="main-layout-container">
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
                initialIsSaved={post.user_interactions?.has_saved || false}
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

export default HomePage;
