import React, { useState } from "react";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import Button from "../ui/Button";

const MainSection = ({
    userName,
    userProfileUrl,
    avatarSrc,
    date,
    time,
    initialText = "",
    postImage = null,
    initialComments = 0,
    initialRetweets = 0,
    initialLike1 = 0,
    initialLike2 = 0,
}) => {
    const [text, setText] = useState(initialText);
    const [comments, setComments] = useState(initialComments);
    const [retweets, setRetweets] = useState(initialRetweets);
    const [like1, setLike1] = useState(initialLike1);
    const [like2, setLike2] = useState(initialLike2);

    return (
        <section className="main-section">
            {/* CABECERA */}
            <header className="main-header">
                <LinkIcon
                    src={avatarSrc}
                    to={userProfileUrl}
                    label={userName}
                />

                <div className="post-info">
                    <span className="post-username">{userName}</span>
                    <span className="separator">|</span>
                    <span>{date}</span>
                    <span className="separator">|</span>
                    <span>{time}</span>
                </div>
            </header>

            {/* INPUT TEXTO */}
            <div className="input-wrapper">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="post-input"
                    placeholder="Escribe tu post..."
                />
            </div>

            {/* IMAGEN DEL POST (OPCIONAL) */}
            {postImage && (
                <div className="post-image-wrapper">
                    <img src={postImage} alt="post" className="post-image" />
                </div>
            )}

            {/* ACCIONES */}
            <footer className="post-footer">
                <Button
                    classButton="button-action"
                    onClick={() => setComments((prev) => prev + 1)}
                >
                    <SvgComponente type="comment" />
                    <span className="action-count">{comments}</span>
                </Button>

                <Button
                    classButton="button-action"
                    onClick={() => setRetweets((prev) => prev + 1)}
                >
                    <SvgComponente type="retweet" />
                    <span className="action-count">{retweets}</span>
                </Button>

                <Button
                    classButton="button-action"
                    onClick={() => setLike1((prev) => prev + 1)}
                >
                    <SvgComponente type="like1" />
                    <span className="action-count">{like1}</span>
                </Button>

                <Button
                    classButton="button-action"
                    onClick={() => setLike2((prev) => prev + 1)}
                >
                    <SvgComponente type="like2" />
                    <span className="action-count">{like2}</span>
                </Button>
            </footer>
        </section>
    );
};

export default MainSection;
