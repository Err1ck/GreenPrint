import React from "react";

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    onPrevious,
    onNext
}) => {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                padding: "30px 0",
                marginTop: "20px"
            }}
        >
            <button
                onClick={onPrevious}
                disabled={currentPage === 1}
                style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                    color: currentPage === 1 ? "#999" : "#333",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontWeight: "500"
                }}
            >
                Anterior
            </button>

            <div
                style={{
                    display: "flex",
                    gap: "5px"
                }}
            >
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Mostrar solo algunas páginas alrededor de la actual
                    if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                        return (
                            <button
                                key={pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    backgroundColor: currentPage === pageNumber ? "#1da1f2" : "#fff",
                                    color: currentPage === pageNumber ? "#fff" : "#333",
                                    cursor: "pointer",
                                    fontWeight: currentPage === pageNumber ? "bold" : "normal",
                                    minWidth: "40px"
                                }}
                            >
                                {pageNumber}
                            </button>
                        );
                    } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                    ) {
                        return <span key={pageNumber} style={{ padding: "8px 4px" }}>...</span>;
                    }
                    return null;
                })}
            </div>

            <button
                onClick={onNext}
                disabled={currentPage === totalPages}
                style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: currentPage === totalPages ? "#f5f5f5" : "#fff",
                    color: currentPage === totalPages ? "#999" : "#333",
                    cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                    fontWeight: "500"
                }}
            >
                Siguiente
            </button>

            <span
                style={{
                    marginLeft: "15px",
                    color: "#666",
                    fontSize: "14px"
                }}
            >
                Página {currentPage} de {totalPages}
            </span>
        </div>
    );
};

export default Pagination;