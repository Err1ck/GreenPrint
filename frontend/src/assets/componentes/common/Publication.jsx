import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/MainSection.css";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";

const Publication = ({
    postId,
    userName,
    userId, // Nueva prop para el ID del usuario
    userProfileUrl,
    date,
    time,
    text,
    postImage = null,
    comments = 0,
    retweets = 0,
    like1 = 0,
    like2 = 0,
    clickable = true,
}) => {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(comments);
    const [retweetCount, setRetweetCount] = useState(retweets);
    const [like1Count, setLike1Count] = useState(like1);
    const [like2Count, setLike2Count] = useState(like2);

    const [isLike1Active, setIsLike1Active] = useState(false);
    const [isLike2Active, setIsLike2Active] = useState(false);
    const [isRetweetActive, setIsRetweetActive] = useState(false);

    // Hover states
    const [commentHover, setCommentHover] = useState(false);
    const [retweetHover, setRetweetHover] = useState(false);
    const [like1Hover, setLike1Hover] = useState(false);
    const [like2Hover, setLike2Hover] = useState(false);

    const handlePostClick = (e) => {
        // Solo navegar si clickable está activo
        if (!clickable) return;
        
        // Evitar navegación si se hace clic en los botones de interacción o en elementos de perfil
        if (e.target.closest('.action-group') || 
            e.target.closest('.nonaction-group') ||
            e.target.closest('.profile-clickable')) {
            return;
        }
        navigate(`/post/${postId}`);
    };

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if (userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const handleLike1 = (e) => {
        e.stopPropagation();
        if (isLike1Active) {
            setLike1Count(like1Count - 1);
        } else {
            setLike1Count(like1Count + 1);
        }
        setIsLike1Active(!isLike1Active);
    };

    const handleLike2 = (e) => {
        e.stopPropagation();
        if (isLike2Active) {
            setLike2Count(like2Count - 1);
        } else {
            setLike2Count(like2Count + 1);
        }
        setIsLike2Active(!isLike2Active);
    };

    const handleRetweet = (e) => {
        e.stopPropagation();
        if (isRetweetActive) {
            setRetweetCount(retweetCount - 1);
        } else {
            setRetweetCount(retweetCount + 1);
        }
        setIsRetweetActive(!isRetweetActive);
    };

    return (
        <section 
            className="main-section" 
            onClick={handlePostClick} 
            style={{ cursor: clickable ? 'pointer' : 'default' }}
        >
            <div className="section-body">
                {/* Columna izquierda: avatar */}
                <div 
                    className="section-avatar profile-clickable"
                    onClick={handleProfileClick}
                    style={{ cursor: userId ? 'pointer' : 'default' }}
                >
                    <LinkIcon
                        name="imagen2"
                        anchor={false}
                        classname="header-icon"
                    />
                </div>

                {/* Columna derecha: todo el contenido */}
                <div className="section-content">
                    <header className="section-header">
                        <div className="header-info">
                            <span 
                                className="info-username profile-clickable"
                                onClick={handleProfileClick}
                                style={{ 
                                    cursor: userId ? 'pointer' : 'default',
                                    transition: 'color 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    if (userId) e.target.style.color = '#1d9bf0';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '';
                                }}
                            >
                                {userName}
                            </span>
                            <span className="info-separator">|</span>
                            <span className="info-date">{date}</span>
                            <span className="info-separator">|</span>
                            <span className="info-time">{time}</span>
                        </div>
                    </header>

                    <div className="section-textWrapper">
                        <p className="textWrapper-text">{text}</p>
                    </div>

                    {postImage && (
                        <div className="section-imageWrapper">
                            <img
                                src={postImage}
                                alt="post"
                                className="imageWrapper-image"
                            />
                        </div>
                    )}

                    <footer className="section-footer">
                        <div className="footer-container">
                            <div className="container-left">
                                {/* Botón Comentarios */}
                                <div
                                    className="nonaction-group"
                                    onMouseEnter={() => setCommentHover(true)}
                                    onMouseLeave={() => setCommentHover(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "8px",
                                        borderRadius: "9999px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        backgroundColor: commentHover ? "rgba(29, 155, 240, 0.1)" : "transparent"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px"
                                    }}>
                                        <SvgComponente name="icon15" />
                                    </div>
                                    <span style={{
                                        fontSize: "13px",
                                        color: commentHover ? "#1d9bf0" : "#536471",
                                        fontWeight: "400",
                                        transition: "color 0.2s ease",
                                        minWidth: "20px"
                                    }}>
                                        {commentCount}
                                    </span>
                                </div>

                                {/* Botón Retweet */}
                                <div
                                    className="action-group"
                                    onClick={handleRetweet}
                                    onMouseEnter={() => setRetweetHover(true)}
                                    onMouseLeave={() => setRetweetHover(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "8px",
                                        borderRadius: "9999px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        backgroundColor: retweetHover || isRetweetActive ? "rgba(0, 186, 124, 0.1)" : "transparent"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px"
                                    }}>
                                        <SvgComponente name="icon21" />
                                    </div>
                                    <span style={{
                                        fontSize: "13px",
                                        color: (retweetHover || isRetweetActive) ? "#00ba7c" : "#536471",
                                        fontWeight: isRetweetActive ? "700" : "400",
                                        transition: "color 0.2s ease",
                                        minWidth: "20px"
                                    }}>
                                        {retweetCount}
                                    </span>
                                </div>
                            </div>

                            <div className="container-right">
                                {/* Botón Like 1 */}
                                <div
                                    className="action-group"
                                    onClick={handleLike1}
                                    onMouseEnter={() => setLike1Hover(true)}
                                    onMouseLeave={() => setLike1Hover(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "8px",
                                        borderRadius: "9999px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        backgroundColor: like1Hover || isLike1Active ? "rgba(249, 24, 128, 0.1)" : "transparent"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px"
                                    }}>
                                        <SvgComponente name={isLike1Active ? "icon18" : "icon17"} />
                                    </div>
                                    <span style={{
                                        fontSize: "13px",
                                        color: (like1Hover || isLike1Active) ? "#f91880" : "#536471",
                                        fontWeight: isLike1Active ? "700" : "400",
                                        transition: "color 0.2s ease",
                                        minWidth: "20px"
                                    }}>
                                        {like1Count}
                                    </span>
                                </div>

                                {/* Botón Like 2 */}
                                <div
                                    className="action-group"
                                    onClick={handleLike2}
                                    onMouseEnter={() => setLike2Hover(true)}
                                    onMouseLeave={() => setLike2Hover(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "8px",
                                        borderRadius: "9999px",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        backgroundColor: like2Hover || isLike2Active ? "rgba(29, 155, 240, 0.1)" : "transparent"
                                    }}
                                >
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "20px",
                                        height: "20px"
                                    }}>
                                        <SvgComponente name={isLike2Active ? "icon20" : "icon19"} />
                                    </div>
                                    <span style={{
                                        fontSize: "13px",
                                        color: (like2Hover || isLike2Active) ? "#1d9bf0" : "#536471",
                                        fontWeight: isLike2Active ? "700" : "400",
                                        transition: "color 0.2s ease",
                                        minWidth: "20px"
                                    }}>
                                        {like2Count}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </section>
    );
};

export default Publication;