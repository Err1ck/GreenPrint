import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import Publication from "../componentes/common/Publication";
import { formatDate, formatTime } from "../utils/dateUtils";

function ViewProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Error al cargar el usuario");
      }
      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);

      // Obtener usuario autenticado del localStorage
      const userStr = localStorage.getItem('user');

      // Construir URL con current_user_id si está autenticado
      let url = `http://127.0.0.1:8000/api/posts/user/${userId}`;
      if (userStr) {
        const currentUser = JSON.parse(userStr);
        url += `?current_user_id=${currentUser.id}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Error al cargar los posts");
      }

      const data = await response.json();

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

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    // Aquí irá la lógica para seguir/dejar de seguir
  };

  if (error) {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh" }}>
          <Navbar navbarType={1} />
        </div>
        <div style={{ flex: 1, minHeight: "100vh" }}>
          <div style={{ textAlign: "center", padding: "40px", color: "#e74c3c" }}>
            Error: {error}
          </div>
        </div>
        <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh" }}>
          <Navbar navbarType={2} />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh" }}>
          <Navbar navbarType={1} />
        </div>
        <div style={{ flex: 1, minHeight: "100vh" }}>
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            Cargando perfil...
          </div>
        </div>
        <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh" }}>
          <Navbar navbarType={2} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", width: "100%" }}>
      {/* Navbar Left */}
      <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 100 }}>
        <Navbar navbarType={1} />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, minHeight: "100vh" }}>
        <main style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
          {/* Header with back button */}
          <div style={{
            position: "sticky",
            top: 0,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #eff3f4",
            padding: "12px 16px",
            zIndex: 10
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <button
                onClick={() => window.history.back()}
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
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#f7f9f9"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#0f1419">
                  <path d="M7.414 13l5.043 5.04-1.414 1.42L3.586 12l7.457-7.46 1.414 1.42L7.414 11H21v2H7.414z" />
                </svg>
              </button>
              <div>
                <h2 style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#0f1419",
                  margin: 0
                }}>
                  {user.username}
                </h2>
                <p style={{
                  fontSize: "13px",
                  color: "#536471",
                  margin: 0
                }}>
                  {posts.length} posts
                </p>
              </div>
            </div>
          </div>

          {/* Banner */}
          <div style={{
            width: "100%",
            height: "200px",
            backgroundColor: user.banner_url ? "transparent" : "#cfd9de",
            backgroundImage: user.banner_url ? `url(${user.banner_url})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} />

          {/* Profile Info Section */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid #eff3f4" }}>
            {/* Avatar and Follow Button */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "-68px",
              marginBottom: "12px"
            }}>
              {/* Avatar */}
              <div style={{
                width: "134px",
                height: "134px",
                borderRadius: "50%",
                border: "4px solid #ffffff",
                backgroundColor: "#cfd9de",
                backgroundImage: user.photo_url ? `url(${user.photo_url})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }} />

              {/* Follow Button */}
              <button
                onClick={handleFollowClick}
                style={{
                  marginTop: "72px",
                  padding: "8px 24px",
                  borderRadius: "9999px",
                  fontSize: "15px",
                  fontWeight: "700",
                  border: isFollowing ? "1px solid #cfd9de" : "1px solid #0f1419",
                  backgroundColor: isFollowing ? "transparent" : "#0f1419",
                  color: isFollowing ? "#0f1419" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (isFollowing) {
                    e.target.style.backgroundColor = "#fee";
                    e.target.style.borderColor = "#f4212e";
                    e.target.style.color = "#f4212e";
                    e.target.textContent = "Dejar de seguir";
                  } else {
                    e.target.style.backgroundColor = "#272c30";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isFollowing) {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.borderColor = "#cfd9de";
                    e.target.style.color = "#0f1419";
                    e.target.textContent = "Siguiendo";
                  } else {
                    e.target.style.backgroundColor = "#0f1419";
                  }
                }}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </button>
            </div>

            {/* Username */}
            <div style={{ marginBottom: "12px" }}>
              <h1 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#0f1419",
                margin: 0,
                marginBottom: "2px"
              }}>
                {user.username}
              </h1>
            </div>

            {/* Biography */}
            {user.biography && (
              <div style={{ marginBottom: "12px" }}>
                <p style={{
                  fontSize: "15px",
                  color: "#0f1419",
                  margin: 0,
                  lineHeight: "20px",
                  whiteSpace: "pre-wrap"
                }}>
                  {user.biography}
                </p>
              </div>
            )}

            {/* Coins Section */}
            <div style={{
              display: "flex",
              gap: "24px",
              marginTop: "12px"
            }}>
              {/* Leaf Coins */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                backgroundColor: "#ecfce7",
                borderRadius: "16px"
              }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#00ba7c">
                  <path d="M12 2C8.69 2 6 4.69 6 8c0 1.89.88 3.57 2.25 4.66C6.94 13.82 6 15.79 6 18c0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.21-.94-4.18-2.25-5.34C17.12 11.57 18 9.89 18 8c0-3.31-2.69-6-6-6z" />
                </svg>
                <div>
                  <p style={{
                    fontSize: "13px",
                    color: "#536471",
                    margin: 0,
                    lineHeight: "1"
                  }}>
                    Leaf Coins
                  </p>
                  <p style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#00ba7c",
                    margin: 0,
                    lineHeight: "1.3"
                  }}>
                    {user.leaf_coins_user || 0}
                  </p>
                </div>
              </div>

              {/* Tree Coins */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                backgroundColor: "#e8f5fd",
                borderRadius: "16px"
              }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="#1d9bf0">
                  <path d="M12 2L9 8H4l5 4-2 6 5-3 5 3-2-6 5-4h-5z" />
                </svg>
                <div>
                  <p style={{
                    fontSize: "13px",
                    color: "#536471",
                    margin: 0,
                    lineHeight: "1"
                  }}>
                    Tree Coins
                  </p>
                  <p style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#1d9bf0",
                    margin: 0,
                    lineHeight: "1.3"
                  }}>
                    {user.tree_coins_community || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Followers Count */}
            <div style={{
              display: "flex",
              gap: "20px",
              marginTop: "12px"
            }}>
              <div>
                <span style={{ fontWeight: "700", color: "#0f1419" }}>
                  {user.follower_count || 0}
                </span>
                <span style={{ color: "#536471", marginLeft: "4px", fontSize: "15px" }}>
                  Seguidores
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: "flex",
            borderBottom: "1px solid #eff3f4",
            position: "sticky",
            top: "53px",
            backgroundColor: "#ffffff",
            zIndex: 9
          }}>
            {/* <div style={{
              flex: 1,
              padding: "16px",
              textAlign: "center",
              cursor: "pointer",
              position: "relative",
              fontWeight: "700",
              fontSize: "15px",
              color: "#0f1419",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#f7f9f9"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            >
              Posts
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "4px",
                backgroundColor: "#1d9bf0",
                borderRadius: "9999px"
              }} />
            </div> */}
          </div>

          {/* Posts List */}
          <div>
            {loading && (
              <div style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "16px",
                color: "#666"
              }}>
                Cargando posts...
              </div>
            )}

            {!loading && posts.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "16px",
                color: "#666"
              }}>
                Este usuario aún no ha publicado nada
              </div>
            )}

            {!loading && posts.map((post) => (
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
              />
            ))}
          </div>
        </main>
      </div>

      {/* Navbar Right */}
      <div style={{ flex: 1, position: "sticky", top: 0, height: "100vh", flexShrink: 0, zIndex: 100 }}>
        <Navbar navbarType={2} />
      </div>
    </div>
  );
}

export default ViewProfile;