import React, { useState, useEffect } from "react";
import Navbar from "../componentes/common/Navbar";
import "../styles/Home.css";
import Modal from "../componentes/common/Modal";
import FollowCard from "../componentes/common/FollowCard";
import Pagination from "../componentes/common/Pagination";

function SuggestedUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://127.0.0.1:8000/api/users");
            
            if (!response.ok) {
                throw new Error("Error al cargar los usuarios");
            }

            const data = await response.json();
            
            // Ordenar por número de seguidores (de más a menos)
            const sortedUsers = data.sort((a, b) => 
                b.follower_count - a.follower_count
            );
            
            setUsers(sortedUsers);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    // Calcular los usuarios a mostrar en la página actual
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(
        indexOfFirstUser,
        indexOfLastUser
    );

    // Calcular el número total de páginas
    const totalPages = Math.ceil(users.length / usersPerPage);

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
                            Cargando usuarios...
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

                    {!loading && !error && currentUsers.length === 0 && (
                        <div style={{
                            textAlign: "center",
                            padding: "40px",
                            fontSize: "16px",
                            color: "#666"
                        }}>
                            No hay usuarios disponibles
                        </div>
                    )}

                    {!loading && !error && currentUsers.map((user) => (
                        <FollowCard
                            key={user.id}
                            type="user"
                            name={user.username}
                            username={user.username}
                            bio={user.biography}
                            followers={user.follower_count}
                            photoUrl={user.photo_url}
                            maxBioLength={100}
                        />
                    ))}

                    {/* Paginación */}
                    {!loading && !error && users.length > 0 && (
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
                <Navbar navbarType={2} />
            </div>
        </>
    );
}

export default SuggestedUsersPage;
