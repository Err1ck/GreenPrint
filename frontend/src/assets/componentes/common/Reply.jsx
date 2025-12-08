import React, { useState } from "react";
import SvgComponente from "../ui/Svg";
import "../../styles/MainSection.css";
import defaultAvatar from "../../img/user.png";

const Reply = ({
    replyId,
    userName,
    userId,
    userProfileUrl,
    date,
    time,
    text,
    replyImage = null,
    like1 = 0,
    initialHasLikedLeaf = false,
}) => {
    const [like1Count, setLike1Count] = useState(like1);
    const [isLike1Active, setIsLike1Active] = useState(initialHasLikedLeaf);
    const [like1Hover, setLike1Hover] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!userStr || !token) return null;
        return { user: JSON.parse(userStr), token };
    };

    const handleLike1 = async (e) => {
        e.stopPropagation();

        const auth = getCurrentUser();
        if (!auth) {
            alert("Debes iniciar sesión para dar like");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const endpoint = isLike1Active
                ? `http://127.0.0.1:8000/api/replies/${replyId}/unlike-leaf`
                : `http://127.0.0.1:8000/api/replies/${replyId}/like-leaf`;

            const method = isLike1Active ? 'DELETE' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    user: auth.user.id
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Update count from server response
                if (data.leaf_count !== undefined) {
                    setLike1Count(data.leaf_count);
                }
                setIsLike1Active(!isLike1Active);
            } else {
                console.error("Error:", data.error);
                if (data.error && !data.error.includes("Ya has dado like")) {
                    alert(data.error);
                }
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error al conectar con el servidor");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="main-section" style={{ cursor: 'default' }}>
            <div className="section-body">
                {/* Avatar */}
                <div className="section-avatar">
                    <img
                        src={userProfileUrl || defaultAvatar}
                        alt={userName}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="section-content">
                    {/* Header */}
                    <header className="section-header">
                        <div className="header-info">
                            <span className="info-username">{userName}</span>
                            <span className="info-separator">|</span>
                            <span className="info-date">{date}</span>
                            <span className="info-separator">|</span>
                            <span className="info-time">{time}</span>
                        </div>
                    </header>

                    {/* Text */}
                    <div className="section-textWrapper">
                        <p className="textWrapper-text">{text}</p>
                    </div>

                    {/* Image */}
                    {replyImage && (
                        <div className="section-imageWrapper">
                            <img
                                src={replyImage}
                                alt="reply"
                                className="imageWrapper-image"
                            />
                        </div>
                    )}

                    {/* Footer Actions - Only Like */}
                    <footer className="section-footer">
                        <div className="footer-container">
                            <div className="container-left">
                                {/* Like Leaf */}
                                <div
                                    className="action-group"
                                    onClick={handleLike1}
                                    onMouseEnter={() => setLike1Hover(true)}
                                    onMouseLeave={() => setLike1Hover(false)}
                                    style={{
                                        backgroundColor: like1Hover || isLike1Active ? 'rgba(249, 24, 128, 0.1)' : 'transparent',
                                        cursor: isLoading ? 'wait' : 'pointer'
                                    }}
                                >
                                    <SvgComponente name={isLike1Active ? 'icon18' : 'icon17'} />
                                    <span
                                        className="action-count"
                                        style={{
                                            color: (like1Hover || isLike1Active) ? '#f91880' : '#536471',
                                            fontWeight: isLike1Active ? '700' : '400'
                                        }}
                                    >
                                        {like1Count}
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

export default Reply;
