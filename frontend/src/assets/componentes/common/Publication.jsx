import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";

const Publication = ({
    postId,
    userName,
    userId,
    communityId,
    communityName,
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
}) => {
    const navigate = useNavigate();
    const [commentCount, setCommentCount] = useState(comments);
    const [retweetCount, setRetweetCount] = useState(retweets);
    const [like1Count, setLike1Count] = useState(like1);
    const [like2Count, setLike2Count] = useState(like2);

    const [isLike1Active, setIsLike1Active] = useState(false);
    const [isLike2Active, setIsLike2Active] = useState(false);
    const [isRetweetActive, setIsRetweetActive] = useState(false);

    const [commentHover, setCommentHover] = useState(false);
    const [retweetHover, setRetweetHover] = useState(false);
    const [like1Hover, setLike1Hover] = useState(false);
    const [like2Hover, setLike2Hover] = useState(false);
    const [profileHover, setProfileHover] = useState(false);

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

    const displayName = postType === 'community' ? communityName : userName;

    return (
        <section 
            onClick={handlePostClick} 
            style={{ 
                backgroundColor: '#fff',
                borderBottom: '1px solid #eff3f4',
                padding: '12px 16px',
                margin: 0,
                transition: 'background-color 0.2s ease',
                cursor: clickable ? 'pointer' : 'default',
                fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7f9f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
            <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
            }}>
                {/* Avatar */}
                <div 
                    className="profile-clickable"
                    onClick={handleProfileClick}
                    style={{ 
                        cursor: (postType === 'community' ? communityId : userId) ? 'pointer' : 'default',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'flex-start',
                        paddingTop: '2px'
                    }}
                >
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        overflow: 'hidden'
                    }}>
                        <LinkIcon
                            name="imagen2"
                            anchor={false}
                            classname="header-icon"
                        />
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0
                }}>
                    {/* Header */}
                    <header style={{ marginBottom: '2px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '15px',
                            flexWrap: 'wrap'
                        }}>
                            <span 
                                className="profile-clickable"
                                onClick={handleProfileClick}
                                onMouseEnter={() => setProfileHover(true)}
                                onMouseLeave={() => setProfileHover(false)}
                                style={{ 
                                    fontWeight: 700,
                                    color: profileHover ? '#1d9bf0' : '#0f1419',
                                    fontSize: '15px',
                                    cursor: (postType === 'community' ? communityId : userId) ? 'pointer' : 'default',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {displayName}
                            </span>
                            <span style={{
                                color: '#536471',
                                padding: '0 2px'
                            }}>|</span>
                            <span style={{
                                color: '#536471',
                                fontSize: '15px',
                                fontWeight: 400
                            }}>{date}</span>
                            <span style={{
                                color: '#536471',
                                padding: '0 2px'
                            }}>|</span>
                            <span style={{
                                color: '#536471',
                                fontSize: '15px',
                                fontWeight: 400
                            }}>{time}</span>
                        </div>
                    </header>

                    {/* Text */}
                    <div style={{ margin: '0 0 12px' }}>
                        <p style={{
                            margin: 0,
                            fontSize: '15px',
                            color: '#0f1419',
                            lineHeight: '20px',
                            wordWrap: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}>{text}</p>
                    </div>

                    {/* Image */}
                    {postImage && (
                        <div style={{
                            margin: '12px 0',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            border: '1px solid #eff3f4'
                        }}>
                            <img
                                src={postImage}
                                alt="post"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block'
                                }}
                            />
                        </div>
                    )}

                    {/* Footer Actions */}
                    <footer style={{ marginTop: '12px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            {/* Left side */}
                            <div style={{
                                display: 'flex',
                                gap: '4px'
                            }}>
                                {/* Comments */}
                                <div
                                    className="nonaction-group"
                                    onMouseEnter={() => setCommentHover(true)}
                                    onMouseLeave={() => setCommentHover(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '8px',
                                        borderRadius: '9999px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: commentHover ? 'rgba(29, 155, 240, 0.1)' : 'transparent'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '20px',
                                        height: '20px'
                                    }}>
                                        <SvgComponente name="icon15" />
                                    </div>
                                    <span style={{
                                        fontSize: '13px',
                                        color: commentHover ? '#1d9bf0' : '#536471',
                                        fontWeight: '400',
                                        transition: 'color 0.2s ease',
                                        minWidth: '20px'
                                    }}>
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
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '8px',
                                        borderRadius: '9999px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: retweetHover || isRetweetActive ? 'rgba(0, 186, 124, 0.1)' : 'transparent'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '20px',
                                        height: '20px'
                                    }}>
                                        <SvgComponente name="icon21" />
                                    </div>
                                    <span style={{
                                        fontSize: '13px',
                                        color: (retweetHover || isRetweetActive) ? '#00ba7c' : '#536471',
                                        fontWeight: isRetweetActive ? '700' : '400',
                                        transition: 'color 0.2s ease',
                                        minWidth: '20px'
                                    }}>
                                        {retweetCount}
                                    </span>
                                </div>
                            </div>

                            {/* Right side */}
                            <div style={{
                                display: 'flex',
                                gap: '4px'
                            }}>
                                {/* Leaf Like (always visible) */}
                                <div
                                    className="action-group"
                                    onClick={handleLike1}
                                    onMouseEnter={() => setLike1Hover(true)}
                                    onMouseLeave={() => setLike1Hover(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '8px',
                                        borderRadius: '9999px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        backgroundColor: like1Hover || isLike1Active ? 'rgba(249, 24, 128, 0.1)' : 'transparent'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '20px',
                                        height: '20px'
                                    }}>
                                        <SvgComponente name={isLike1Active ? 'icon18' : 'icon17'} />
                                    </div>
                                    <span style={{
                                        fontSize: '13px',
                                        color: (like1Hover || isLike1Active) ? '#f91880' : '#536471',
                                        fontWeight: isLike1Active ? '700' : '400',
                                        transition: 'color 0.2s ease',
                                        minWidth: '20px'
                                    }}>
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px',
                                            borderRadius: '9999px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            backgroundColor: like2Hover || isLike2Active ? 'rgba(29, 155, 240, 0.1)' : 'transparent'
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '20px',
                                            height: '20px'
                                        }}>
                                            <SvgComponente name={isLike2Active ? 'icon20' : 'icon19'} />
                                        </div>
                                        <span style={{
                                            fontSize: '13px',
                                            color: (like2Hover || isLike2Active) ? '#1d9bf0' : '#536471',
                                            fontWeight: isLike2Active ? '700' : '400',
                                            transition: 'color 0.2s ease',
                                            minWidth: '20px'
                                        }}>
                                            {like2Count}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </section>
    );
};

export default Publication;