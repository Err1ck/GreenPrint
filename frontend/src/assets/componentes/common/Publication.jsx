import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Repeat2, Leaf, TreeDeciduous, Bookmark } from "lucide-react";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import "../../styles/MainSection.css";
import defaultAvatar from "../../img/user.png";

const Publication = ({
    postId,
    userName,
    userId,
    communityId,
    communityName,
    communityPhotoUrl,
    userProfileUrl,
    date,
    time,
    text,
    postImage = null,
    postType = 'user',
    comments = 0,
    retweets = 0,
    like1 = 0,
    like2 = 0,
    clickable = true,
    // Nuevas props para estado inicial de interacciones
    initialHasLikedLeaf = false,
    initialHasLikedTree = false,
    initialHasReposted = false,
    initialIsSaved = false,
}) => {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(comments);
    const [retweetCount, setRetweetCount] = useState(retweets);
    const [like1Count, setLike1Count] = useState(like1);
    const [like2Count, setLike2Count] = useState(like2);

    const [isLike1Active, setIsLike1Active] = useState(initialHasLikedLeaf);
    const [isLike2Active, setIsLike2Active] = useState(initialHasLikedTree);
    const [isRetweetActive, setIsRetweetActive] = useState(initialHasReposted);
    const [isSaved, setIsSaved] = useState(initialIsSaved);

    const [commentHover, setCommentHover] = useState(false);
    const [retweetHover, setRetweetHover] = useState(false);
    const [like1Hover, setLike1Hover] = useState(false);
    const [like2Hover, setLike2Hover] = useState(false);
    const [saveHover, setSaveHover] = useState(false);
    const [profileHover, setProfileHover] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    // Función helper para obtener el usuario actual
    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!userStr || !token) return null;
        return { user: JSON.parse(userStr), token };
    };

    // ✨ OPTIMIZACIÓN: Eliminado useEffect que hacía peticiones individuales
    // Ahora las interacciones vienen directamente desde las props iniciales
    // (initialHasLikedLeaf, initialHasLikedTree, initialHasReposted)
    // que se obtienen en una sola petición optimizada desde Home.jsx


    // Handler para Like Leaf (like1)
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
                ? `http://127.0.0.1:8000/api/posts/${postId}/unlike-leaf`
                : `http://127.0.0.1:8000/api/posts/${postId}/like-leaf`;

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
                // Actualizar con el contador del servidor
                setLike1Count(data.leaf_count);
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

    // Handler para Like Tree (like2) - solo para posts de comunidad
    const handleLike2 = async (e) => {
        e.stopPropagation();

        if (postType !== 'community') return;

        const auth = getCurrentUser();
        if (!auth) {
            alert("Debes iniciar sesión para dar like");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const endpoint = isLike2Active
                ? `http://127.0.0.1:8000/api/posts/${postId}/unlike-tree`
                : `http://127.0.0.1:8000/api/posts/${postId}/like-tree`;

            const method = isLike2Active ? 'DELETE' : 'POST';

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
                // Actualizar con el contador del servidor
                setLike2Count(data.tree_count);
                setIsLike2Active(!isLike2Active);
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

    // Handler para Retweet
    const handleRetweet = async (e) => {
        e.stopPropagation();

        const auth = getCurrentUser();
        if (!auth) {
            alert("Debes iniciar sesión para hacer repost");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const endpoint = isRetweetActive
                ? `http://127.0.0.1:8000/api/posts/${postId}/unrepost`
                : `http://127.0.0.1:8000/api/posts/${postId}/repost`;

            const method = isRetweetActive ? 'DELETE' : 'POST';

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
                // Actualizar con el contador del servidor
                setRetweetCount(data.repost_count);
                setIsRetweetActive(!isRetweetActive);
            } else {
                console.error("Error:", data.error);
                if (data.error && !data.error.includes("Ya has hecho repost")) {
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

    // Handler para guardar/desguardar post
    const handleSave = async (e) => {
        e.stopPropagation();

        const auth = getCurrentUser();
        if (!auth) {
            alert("Debes iniciar sesión para guardar posts");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            const endpoint = isSaved
                ? `http://127.0.0.1:8000/api/users/${auth.user.id}/unsave-post`
                : `http://127.0.0.1:8000/api/users/${auth.user.id}/save-post`;

            const method = isSaved ? 'DELETE' : 'POST';

            const response = await fetch(endpoint, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    post_id: postId
                })
            });

            if (response.ok) {
                setIsSaved(!isSaved);
            } else {
                const data = await response.json();
                console.error("Error:", data.error);
                if (data.error && !data.error.includes("Ya has guardado") && !data.error.includes("No has guardado")) {
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

    const handlePostClick = (e) => {
        if (!clickable) return;

        if (e.target.closest('.action-group') ||
            e.target.closest('.nonaction-group') ||
            e.target.closest('.profile-clickable')) {
            return;
        }
        navigate(`/post/${postId}`);
    };

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if (postType === 'community' && communityId) {
            navigate(`/community/${communityId}`);
        } else if (postType === 'user' && userId) {
            navigate(`/profile/${userId}`);
        }
    };

    const displayName = postType === 'community' ? communityName : userName;
    const displayPhoto = postType === 'community' ? communityPhotoUrl : userProfileUrl;

    return (
        <section
            className="main-section"
            onClick={handlePostClick}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
        >
            <div className="section-body">
                {/* Avatar */}
                <div
                    className="section-avatar profile-clickable"
                    onClick={handleProfileClick}
                    style={{ cursor: (postType === 'community' ? communityId : userId) ? 'pointer' : 'default' }}
                >
                    <img
                        src={displayPhoto || defaultAvatar}
                        alt={displayName}
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
                        <div className="header-info" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                    className="info-username profile-clickable"
                                    onClick={handleProfileClick}
                                    onMouseEnter={() => setProfileHover(true)}
                                    onMouseLeave={() => setProfileHover(false)}
                                    style={{
                                        color: profileHover ? '#1d9bf0' : '#0f1419',
                                        cursor: (postType === 'community' ? communityId : userId) ? 'pointer' : 'default',
                                        transition: 'color 0.2s'
                                    }}
                                >
                                    {displayName}
                                </span>
                                <span className="info-separator">|</span>
                                <span className="info-date">{date}</span>
                                <span className="info-separator">|</span>
                                <span className="info-time">{time}</span>
                            </div>

                            {postType === 'community' && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#1d9bf0',
                                    backgroundColor: 'rgba(29, 155, 240, 0.1)',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    letterSpacing: '0.5px'
                                }}>
                                    COMUNIDAD
                                </span>
                            )}
                        </div>
                    </header>

                    {/* Text */}
                    <div className="section-textWrapper">
                        <p className="textWrapper-text">{text}</p>
                    </div>

                    {/* Image */}
                    {postImage && (
                        <div className="section-imageWrapper">
                            <img
                                src={postImage}
                                alt="post"
                                className="imageWrapper-image"
                            />
                        </div>
                    )}

                    {/* Footer Actions */}
                    <footer className="section-footer">
                        <div className="footer-container">
                            {/* Left side */}
                            <div className="container-left">
                                {/* Comments */}
                                <div
                                    className="nonaction-group"
                                    onMouseEnter={() => setCommentHover(true)}
                                    onMouseLeave={() => setCommentHover(false)}
                                    style={{
                                        backgroundColor: commentHover ? 'rgba(29, 155, 240, 0.1)' : 'transparent'
                                    }}
                                >
                                    <MessageCircle
                                        size={18}
                                        color={commentHover ? '#1d9bf0' : '#536471'}
                                        strokeWidth={1.5}
                                    />
                                    <span
                                        className="nonaction-count"
                                        style={{ color: commentHover ? '#1d9bf0' : '#536471' }}
                                    >
                                        {commentCount}
                                    </span>
                                </div>

                                {/* Retweet */}
                                <div
                                    className="action-group"
                                    onClick={handleRetweet}
                                    onMouseEnter={() => setRetweetHover(true)}
                                    onMouseLeave={() => setRetweetHover(false)}
                                    style={{
                                        backgroundColor: retweetHover || isRetweetActive ? 'rgba(0, 186, 124, 0.1)' : 'transparent',
                                        cursor: isLoading ? 'wait' : 'pointer'
                                    }}
                                >
                                    <Repeat2
                                        size={18}
                                        color={(retweetHover || isRetweetActive) ? '#00ba7c' : '#536471'}
                                        strokeWidth={1.5}
                                    />
                                    <span
                                        className="action-count"
                                        style={{
                                            color: (retweetHover || isRetweetActive) ? '#00ba7c' : '#536471',
                                            fontWeight: isRetweetActive ? '700' : '400'
                                        }}
                                    >
                                        {retweetCount}
                                    </span>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="container-right">
                                {/* Leaf Like */}
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
                                    <Leaf
                                        size={18}
                                        color={(like1Hover || isLike1Active) ? '#f91880' : '#536471'}
                                        strokeWidth={1.5}
                                    />
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

                                {/* Tree Like (only for community posts) */}
                                {postType === 'community' && (
                                    <div
                                        className="action-group"
                                        onClick={handleLike2}
                                        onMouseEnter={() => setLike2Hover(true)}
                                        onMouseLeave={() => setLike2Hover(false)}
                                        style={{
                                            backgroundColor: like2Hover || isLike2Active ? 'rgba(29, 155, 240, 0.1)' : 'transparent',
                                            cursor: isLoading ? 'wait' : 'pointer'
                                        }}
                                    >
                                        <TreeDeciduous
                                            size={18}
                                            color={(like2Hover || isLike2Active) ? '#1d9bf0' : '#536471'}
                                            strokeWidth={1.5}
                                        />
                                        <span
                                            className="action-count"
                                            style={{
                                                color: (like2Hover || isLike2Active) ? '#1d9bf0' : '#536471',
                                                fontWeight: isLike2Active ? '700' : '400'
                                            }}
                                        >
                                            {like2Count}
                                        </span>
                                    </div>
                                )}

                                {/* Save/Bookmark */}
                                <div
                                    className="action-group"
                                    onClick={handleSave}
                                    onMouseEnter={() => setSaveHover(true)}
                                    onMouseLeave={() => setSaveHover(false)}
                                    style={{
                                        backgroundColor: saveHover || isSaved ? 'rgba(255, 165, 0, 0.1)' : 'transparent',
                                        cursor: isLoading ? 'wait' : 'pointer'
                                    }}
                                >
                                    <Bookmark
                                        size={18}
                                        color={(saveHover || isSaved) ? '#ffa500' : '#536471'}
                                        strokeWidth={1.5}
                                        fill={isSaved ? '#ffa500' : 'none'}
                                    />
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