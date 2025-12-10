import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import LinkIcon from "../ui/LinkIcon";

function TrendingTopics() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/hashtags/trending",
        {
          headers: headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTrending(data);
      }
    } catch (error) {
      console.error("Error fetching trending:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHashtagClick = (tag) => {
    navigate(`/search?q=${encodeURIComponent("#" + tag)}`);
  };

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: "var(--color-bg)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px",
        }}
      >
        <p style={{ color: "#536471", fontSize: "15px" }}>
          Cargando tendencias...
        </p>
      </div>
    );
  }

  if (trending.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: "var(--color-bg)",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: "16px",
        width: "10rem",
      }}
    >
      {/* Header */}
      {/* <div
        style={{
          padding: "12px 16px",
          borderBottom: "var(--size-border) solid var(--color-bg-secondary)",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "800",
            color: "var(--color-text-primary)",
            margin: 0,
          }}
        >
          Tendencias
        </h2>
      </div> */}
      <div className="seccion-trend">
        <LinkIcon
          name={"tendencias"}
          anchor={false}
          classname={"navicon"}
          text={"Tendencias"}
        />
      </div>

      {/* Trending Items */}
      {trending.map((item, index) => (
        <div
          key={item.id}
          onClick={() => handleHashtagClick(item.tag)}
          style={{
            padding: "12px 16px",
            borderBottom:
              index < trending.length - 1
                ? "var(--size-border) solid var(--color-bg-secondary)"
                : "none",
            cursor: "pointer",
            transition: "background-color 0.2s",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-bg-secondary)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <div style={{ flex: 1 }}>
            {/* Category */}
            <div
              style={{
                fontSize: "13px",
                color: "#536471",
                marginBottom: "2px",
              }}
            >
              Es tendencia
            </div>

            {/* Hashtag */}
            <div
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
                marginBottom: "2px",
              }}
            >
              #{item.tag}
            </div>

            {/* Post count */}
            <div
              style={{
                fontSize: "13px",
                color: "#536471",
              }}
            >
              {item.count} {item.count === 1 ? "publicación" : "publicaciones"}
            </div>
          </div>

          {/* More button */}
          {/* <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Aquí podrías agregar un menú de opciones
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "4px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#e8f5fd"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                        <MoreHorizontal size={18} color="#536471" />
                    </button> */}
        </div>
      ))}

      {/* Show more link */}
      {/* <div
                onClick={() => navigate('/search')}
                style={{
                    padding: "16px",
                    cursor: "pointer",
                    transition: "background-color 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
                <span style={{
                    fontSize: "15px",
                    color: "#1d9bf0",
                    fontWeight: "400"
                }}>
                    Mostrar más
                </span>
            </div> */}
    </div>
  );
}

export default TrendingTopics;
