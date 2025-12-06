import React, { useState, useEffect } from "react";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Modal from "../componentes/common/Modal";
import FollowCard from "../componentes/common/FollowCard";
import Pagination from "../componentes/common/Pagination";

function CommunityPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const communitiesPerPage = 10;

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://127.0.0.1:8000/api/communities");
            
            if (!response.ok) {
                throw new Error("Error al cargar las comunidades");
            }

            const data = await response.json();
            
            // Ordenar por número de seguidores (de más a menos)
            const sortedCommunities = data.sort((a, b) => 
                b.follower_count - a.follower_count
            );
            
            setCommunities(sortedCommunities);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Calcular las comunidades a mostrar en la página actual
    const indexOfLastCommunity = currentPage * communitiesPerPage;
    const indexOfFirstCommunity = indexOfLastCommunity - communitiesPerPage;
    const currentCommunities = communities.slice(
        indexOfFirstCommunity,
        indexOfLastCommunity
    );

    // Calcular el número total de páginas
    const totalPages = Math.ceil(communities.length / communitiesPerPage);

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

    return (
        <>
            <div className="navbarLeft-content">
                <Navbar navbarType={1} />
            </div>
            <div className="main-layout-container">
                <div className="spacer-left"></div>
                <main className="main-content">
                    {loading && (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            fontSize: "16px",
                            color: "#666"
                        }}>
                            Cargando comunidades...
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

                    {!loading && !error && currentCommunities.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            fontSize: "16px",
                            color: "#666"
                        }}>
                            No hay comunidades disponibles
                        </div>
                    )}

                    {!loading && !error && currentCommunities.map((community) => (
                        <FollowCard
                            key={community.id}
                            type="community"
                            name={community.name}
                            bio={community.biography}
                            members={community.member_count}
                            followers={community.follower_count}
                            photoUrl={community.photo_url}
                            maxBioLength={100}
                        />
                    ))}

                    {/* Paginación */}
                    {!loading && !error && communities.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageClick}
                            onPrevious={handlePrevPage}
                            onNext={handleNextPage}
                        />
                    )}
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

export default CommunityPage;