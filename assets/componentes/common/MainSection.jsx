import React, { useState } from "react";
import "../common/MainSection.css";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import Button from "../ui/Button";

const MainSection = ({
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
            {/* CABECERA */}
            <header className="main-header">
                <LinkIcon
                    name={"imagen2"}
                    anchor={false}
                    classname={"sectionIcon"}
                    
                />

                <div className="post-info">
                    <span className="post-username">{userName}</span>
                    <span className="separator">|</span>
                    <span>{date}</span>
                    <span className="separator">|</span>
                    <span>{time}</span>
                </div>
            </header>

            {/* TEXTO DEL POST */}
            <div className="post-text-wrapper">
                <p className="post-text">{text}</p>
            </div>

            {/* IMAGEN DEL POST (OPCIONAL) */}
            {postImage && (
                <div className="post-image-wrapper">
                    <img src={postImage} alt="post" className="post-image" />
                </div>
            )}

            {/* ACCIONES */}
            <footer className="post-footer">
                <div className="container-botones">
                <div className="comentario-retweet">
                {/* Comentarios */}
                <div className="action-group">
                    <Button
                        classButton="button-action"
                    >
                        <SvgComponente name="icon8" />
                    </Button>
                    <span className="action-count">{commentCount}</span>
                </div>

                {/* Retweets */}
                <div className="action-group">
                    <Button
                        classButton="button-action"
                        onClick={() => setRetweetCount((prev) => prev + 1)}
                    >
                        <SvgComponente name="icon11" />
                    </Button>
                    <span className="action-count">{retweetCount}</span>
                </div>
                </div>

                {/* Like 1 */}
                <div className="like1-like2">
                <div className="action-group">
                    <Button
                        classButton="button-action"
                        onClick={() => setLike1Count((prev) => prev + 1)}
                    >
                        <SvgComponente name="icon9" />
                    </Button>
                    <span className="action-count">{like1Count}</span>
                </div>

                {/* Like 2 */}
                <div className="action-group">
                    <Button
                        classButton="button-action"
                        onClick={() => setLike2Count((prev) => prev + 1)}
                    >
                        <SvgComponente name="icon10" />
                    </Button>
                    <span className="action-count">{like2Count}</span>
                </div>
                </div>
                </div>
            </footer>
        </section>
    );
};

export default MainSection;
