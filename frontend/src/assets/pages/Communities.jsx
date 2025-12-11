import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Modal from "../componentes/common/Modal";
import FollowCard from "../componentes/common/FollowCard";
import Pagination from "../componentes/common/Pagination";

function CommunityPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [followedCommunities, setFollowedCommunities] = useState(new Set());
  const communitiesPerPage = 10;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchCommunities();
    checkFollowedCommunities();
  }, []);

  const checkFollowedCommunities = async () => {
    try {
      const currentUserStr = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!currentUserStr || !token) return;

      const currentUser = JSON.parse(currentUserStr);

      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${currentUser.id}/followed-communities`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (Array.isArray(data)) {
          const followedIds = new Set(
            data
              .map((item) => item.community?.id)
              .filter((id) => id !== undefined)
          );
          setFollowedCommunities(followedIds);
        }
      }
    } catch (err) {
      console.error("Error checking follow status:", err);
    }
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/communities", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar las comunidades");
      }

      const data = await response.json();

      // Ordenar por número de seguidores (de más a menos)
      const sortedCommunities = data.sort(
        (a, b) => (b.follower_count || 0) - (a.follower_count || 0)
      );

      setCommunities(sortedCommunities);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Filtrar comunidades según la búsqueda
  const filteredCommunities = communities.filter(
    (community) =>
      community.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.biography?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calcular las comunidades a mostrar en la página actual
  const indexOfLastCommunity = currentPage * communitiesPerPage;
  const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
  const currentCommunities = filteredCommunities.slice(
    indexOfFirstCommunity,
    indexOfLastCommunity
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredCommunities.length / communitiesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleCommunityClick = (communityId) => {
    navigate(`/community/${communityId}`);
  };

  // Resetear a página 1 cuando cambia la búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  return (
    <div className="homepage-container">
      <div className="navbarLeft-content">
        <Navbar navbarType={1} navbarPage={"community"} />
      </div>
      <div className="main-layout-container">
        <main className="main-content" style={{ padding: 0 }}>
          {/* Header con título y buscador */}
          <div
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "var(--color-bg)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid var(--color-bg-secondary)",
              zIndex: 10,
            }}
          >
            {/* Título */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-bg-secondary)",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                  margin: 0,
                }}
              >
                Comunidades
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#536471",
                  margin: "4px 0 0 0",
                }}
              >
                {filteredCommunities.length}{" "}
                {filteredCommunities.length === 1 ? "comunidad" : "comunidades"}
              </p>
            </div>

            {/* Barra de búsqueda */}
            <div style={{ padding: "12px 16px" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                }}
              >
                <input
                  type="text"
                  placeholder="Buscar comunidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px 12px 48px",
                    borderRadius: "9999px",
                    border: "1px solid #eff3f4",
                    backgroundColor: "var(--color-bg)",
                    fontSize: "15px",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = "var(--color-bg)";
                    e.target.style.borderColor = "#00ba7c";
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = "var(--color-bg)";
                    e.target.style.borderColor = "var(--color-text-primary)";
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
                    transform: "translateY(-50%)",
                  }}
                >
                  <path d="M10.25 3.75c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5c1.795 0 3.419-.726 4.596-1.904 1.178-1.177 1.904-2.801 1.904-4.596 0-3.59-2.91-6.5-6.5-6.5zm-8.5 6.5c0-4.694 3.806-8.5 8.5-8.5s8.5 3.806 8.5 8.5c0 1.986-.682 3.815-1.824 5.262l4.781 4.781-1.414 1.414-4.781-4.781c-1.447 1.142-3.276 1.824-5.262 1.824-4.694 0-8.5-3.806-8.5-8.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div>
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  fontSize: "16px",
                  color: "#666",
                }}
              >
                Cargando comunidades...
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

            {!loading && !error && currentCommunities.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  fontSize: "16px",
                  color: "#666",
                }}
              >
                {searchQuery
                  ? "No se encontraron comunidades"
                  : "No hay comunidades disponibles"}
              </div>
            )}

            {!loading &&
              !error &&
              currentCommunities.map((community) => (
                <div
                  key={community.id}
                  onClick={() => handleCommunityClick(community.id)}
                >
                  <FollowCard
                    type="community"
                    id={community.id}
                    name={community.name}
                    bio={community.biography}
                    members={community.member_count || 0}
                    followers={community.follower_count || 0}
                    photoUrl={community.photo_url}
                    maxBioLength={100}
                    initialIsFollowing={followedCommunities.has(community.id)}
                  />
                </div>
              ))}

            {/* Paginación */}
            {!loading &&
              !error &&
              filteredCommunities.length > communitiesPerPage && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageClick}
                  onPrevious={handlePrevPage}
                  onNext={handleNextPage}
                />
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

export default CommunityPage;
