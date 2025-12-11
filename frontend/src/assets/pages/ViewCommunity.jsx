import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Publication from "../componentes/common/Publication";
import FollowCommunity from "../componentes/common/FollowCommunity";
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
      });

    const fetchCommunityData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

      console.log("Checking if following community:", communityId);

      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${currentUser.id}/followed-communities`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Communities data:", data);
        console.log("Is array?", Array.isArray(data));

        if (Array.isArray(data)) {
          const isFollowingCommunity = data.some((item) => {
            console.log(
              "Checking item:",
              item,
              "community id:",
              item.community?.id,
              "target:",
              parseInt(communityId)
            );
            return item.community?.id === parseInt(communityId);
          });
          console.log("Is following community?", isFollowingCommunity);
          setIsFollowing(isFollowingCommunity);
        } else {
          console.log("Data is not an array, setting to false");
          setIsFollowing(false);
        }
      } else {
        console.log("Response not OK:", response.status);
      }
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Obtener datos de la comunidad
      const communityResponse = await fetch(
        `http://127.0.0.1:8000/api/communities/${communityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!communityResponse.ok) throw new Error("Error al cargar comunidad");

      const communityData = await communityResponse.json();
      setCommunity(communityData);

      // Obtener posts de la comunidad
      const postsResponse = await fetch(
        `http://127.0.0.1:8000/api/posts/community/${communityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      const response = await fetch(
        `http://127.0.0.1:8000/api/posts/community/${communityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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


    if (loading) {
        return (
            <div className="homepage-container">
                <div className="navbarLeft-content">
                    <Navbar navbarType={1} />
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
        if (communityResponse.ok) {
          const communityData = await communityResponse.json();
          setCommunity(communityData);
        }
      } else {
        const data = await response.json();
        console.error("Error:", data);
        alert(data.error || "Error al seguir/dejar de seguir");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error al conectar con el servidor");
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
              }}
            >
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
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                color: "#e74c3c",
                fontSize: "16px",
              }}
            >
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
                
                .community-banner {
                    width: 100%;
                    height: 200px;
                    background: linear-gradient(135deg, #00ba7c 0%, #00ba7c 100%);
                    object-fit: cover;
                }
                
                .community-content {
                    padding: 0 16px;
                    background: #fff;
                }
                
                .community-avatar-container {
                    margin-top: -75px;
                    margin-bottom: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                
                .community-avatar {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    border: 4px solid #fff;
                    background: linear-gradient(135deg, #00ba7c 0%, #00ba7c 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    color: white;
                    font-weight: bold;
                    object-fit: cover;
                }
                
                .follow-button {
                    padding: 8px 24px;
                    border-radius: 9999px;
                    font-weight: 700;
                    font-size: 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #cfd9de;
                }
                
                .follow-button.following {
                    background: transparent;
                    color: #0f1419;
                }
                
                .follow-button.not-following {
                    background: #00ba7c;
                    color: #fff;
                    border: 1px solid #00ba7c;
                }
                
                .follow-button:hover {
                    opacity: 0.9;
                }

                .community-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #00ba7c;
                    background-color: rgba(0, 186, 124, 0.1);
                    padding: 6px 14px;
                    border-radius: 12px;
                    letter-spacing: 0.5px;
                }
            `}</style>

      <div className="navbarLeft-content">
        <Navbar navbarType={1} navbarPage={"community"}/>
      </div>

      <div className="main-layout-container">
        <main className="main-content" style={{ padding: 0 }}>
          {/* Header */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #eff3f4",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              zIndex: 10,
            }}
          >
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
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f7f9f9")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              ←
            </button>
            <div>
              <h2
                style={{
                  color: "#0f1419",
                  fontSize: "20px",
                  fontWeight: "700",
                  margin: 0,
                }}
              >
                {community?.name || "Comunidad"}
              </h2>
              <p
                style={{
                  color: "#536471",
                  fontSize: "13px",
                  margin: 0,
                }}
              >
                {posts.length} posts
              </p>
            </div>
          </div>

          {/* Banner */}
          {community?.banner_url ? (
            <img
              src={community.banner_url}
              alt="Banner de comunidad"
              className="community-banner"
            />
          ) : (
            <div className="community-banner"></div>
          )}

          {/* Community Info */}
          <div className="community-content">
            <div className="community-avatar-container">
              {community?.photo_url ? (
                <img
                  src={community.photo_url}
                  alt={community.name}
                  className="community-avatar"
                />
              ) : (
                <div className="community-avatar">
                  {community?.name?.charAt(0).toUpperCase() || "C"}
                </div>
              )}
              <button
                onClick={handleFollow}
                className={`follow-button ${
                  isFollowing ? "following" : "not-following"
                }`}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </button>
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
                            ←
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
                    {community?.banner_url ? (
                        <img
                            src={community.banner_url}
                            alt="Banner de comunidad"
                            className="community-banner"
                        />
                    ) : (
                        <div className="community-banner"></div>
                    )}

                    {/* Community Info */}
                    <div className="community-content">
                        <div className="community-avatar-container">
                            {community?.photo_url ? (
                                <img
                                    src={community.photo_url}
                                    alt={community.name}
                                    className="community-avatar"
                                />
                            ) : (
                                <div className="community-avatar">
                                    {community?.name?.charAt(0).toUpperCase() || "C"}
                                </div>
                            )}
                            <FollowCommunity
                                communityId={parseInt(communityId)}
                                onFollowChange={() => fetchCommunityData()}
                                style={{ marginTop: "72px" }}
                            />
                        </div>

                        <div style={{ marginBottom: "12px" }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "8px"
                            }}>
                                <h2 style={{
                                    color: "#0f1419",
                                    fontSize: "20px",
                                    fontWeight: "700",
                                    margin: 0
                                }}>
                                    {community?.name || "Comunidad"}
                                </h2>
                                <span className="community-badge">
                                    🌳 COMUNIDAD
                                </span>
                            </div>
                            <p style={{
                                color: "#536471",
                                fontSize: "15px",
                                margin: 0
                            }}>
                                @{community?.name?.toLowerCase().replace(/\s+/g, '') || "comunidad"}
                            </p>
                        </div>

                        {community?.biography && (
                            <p style={{
                                color: "#0f1419",
                                fontSize: "15px",
                                marginBottom: "12px",
                                lineHeight: "1.5"
                            }}>
                                {community.biography}
                            </p>
                        )}

                        <div style={{
                            display: "flex",
                            gap: "20px",
                            marginBottom: "16px",
                            paddingBottom: "16px",
                            borderBottom: "1px solid #eff3f4"
                        }}>
                            <div>
                                <span style={{ color: "#0f1419", fontWeight: "700" }}>
                                    {community?.follower_count || 0}
                                </span>
                                <span style={{ color: "#536471", marginLeft: "4px" }}>
                                    Seguidores
                                </span>
                            </div>
                            <div>
                                <span style={{ color: "#0f1419", fontWeight: "700" }}>
                                    {community?.member_count || 0}
                                </span>
                                <span style={{ color: "#536471", marginLeft: "4px" }}>
                                    Miembros
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

            {community?.biography && (
              <p
                style={{
                  color: "#0f1419",
                  fontSize: "15px",
                  marginBottom: "12px",
                  lineHeight: "1.5",
                }}
              >
                {community.biography}
              </p>
            )}

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "16px",
                paddingBottom: "16px",
                borderBottom: "1px solid #eff3f4",
              }}
            >
              <div>
                <span style={{ color: "#0f1419", fontWeight: "700" }}>
                  {community?.follower_count || 0}
                </span>
                <span style={{ color: "#536471", marginLeft: "4px" }}>
                  Seguidores
                </span>
              </div>
              <div>
                <span style={{ color: "#0f1419", fontWeight: "700" }}>
                  {community?.member_count || 0}
                </span>
                <span style={{ color: "#536471", marginLeft: "4px" }}>
                  Miembros
                </span>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div>
            {posts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#536471",
                  backgroundColor: "#fff",
                }}
              >
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
                    />
                  );
                }
              })
            )}

            {loadingPosts && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "20px",
                  backgroundColor: "#fff",
                }}
              >
                <div className="spinner"></div>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="navbarRight-content">
        <Navbar navbarType={2} />
      </div>
    </div>
  );
}

export default ViewCommunity;
