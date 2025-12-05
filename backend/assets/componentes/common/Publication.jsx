import React, { useState } from "react";
import "../../styles/MainSection.css";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import Button from "../ui/Button";

const Publication = ({
    userName,
    userProfileUrl,
    date,
    time,
    text,
    postImage = null,
    comments = 0,
    retweets = 0,
    like1 = 0,
    like2 = 0,
}) => {
    const [commentCount, setCommentCount] = useState(comments);
    const [retweetCount, setRetweetCount] = useState(retweets);
    const [like1Count, setLike1Count] = useState(like1);
    const [like2Count, setLike2Count] = useState(like2);

    return (
        <section className="main-section">
            <div className="section-body">
                {/* Columna izquierda: avatar */}
                <div className="section-avatar">
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
                            <span className="info-username">{userName}</span>
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
                                <div className="nonaction-group">
                                    <SvgComponente name="icon15" />
                                    <span className="nonaction-count">
                                        {commentCount}
                                    </span>
                                </div>
                                <div className="action-group">
                                    <SvgComponente name="icon21" />
                                    <span className="action-count">
                                        {retweetCount}
                                    </span>
                                </div>
                            </div>
                            <div className="container-right">
                                <div className="action-group">
                                    <SvgComponente name="icon17" />
                                    <span className="action-count">
                                        {like1Count}
                                    </span>
                                </div>
                                <div className="action-group">
                                    <SvgComponente name="icon19" />
                                    <span className="action-count">
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
