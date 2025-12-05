import React, { useState, useRef } from "react";
import Button from "../ui/Button";
import LinkIcon from "../ui/LinkIcon";
import "../../styles/Modal.css";

function Modal({ children, onClose }) {
    const [postText, setPostText] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);
    const maxChars = 280;

    // Emojis populares organizados por categorías
    const emojiCategories = {
        Expresiones: [
            "😀",
            "😃",
            "😄",
            "😁",
            "😅",
            "😂",
            "🤣",
            "😊",
            "😇",
            "🙂",
            "😉",
            "😌",
            "😍",
            "🥰",
            "😘",
            "😗",
            "😙",
            "😚",
            "😋",
            "😛",
            "😝",
            "😜",
            "🤪",
            "🤨",
            "🧐",
            "🤓",
        ],
        Gestos: [
            "👍",
            "👎",
            "👌",
            "✌️",
            "🤞",
            "🤟",
            "🤘",
            "🤙",
            "👈",
            "👉",
            "👆",
            "👇",
            "☝️",
            "👏",
            "🙌",
            "🤲",
            "🤝",
            "🙏",
            "💪",
        ],
        Corazones: [
            "❤️",
            "🧡",
            "💛",
            "💚",
            "💙",
            "💜",
            "🖤",
            "🤍",
            "🤎",
            "💔",
            "❣️",
            "💕",
            "💞",
            "💓",
            "💗",
            "💖",
            "💘",
            "💝",
        ],
        Naturaleza: [
            "🌱",
            "🌿",
            "🍀",
            "🌾",
            "🌳",
            "🌲",
            "🌴",
            "🌵",
            "🌷",
            "🌹",
            "🌺",
            "🌸",
            "🌼",
            "🌻",
            "🌞",
            "🌝",
            "🌛",
            "⭐",
            "✨",
            "⚡",
            "🔥",
            "💧",
        ],
        Animales: [
            "🐶",
            "🐱",
            "🐭",
            "🐹",
            "🐰",
            "🦊",
            "🐻",
            "🐼",
            "🐨",
            "🐯",
            "🦁",
            "🐮",
            "🐷",
            "🐸",
            "🐵",
            "🐔",
            "🐧",
            "🐦",
            "🦄",
            "🐝",
            "🦋",
            "🐛",
        ],
        Comida: [
            "🍕",
            "🍔",
            "🍟",
            "🌭",
            "🍿",
            "🧇",
            "🥓",
            "🥞",
            "🧀",
            "🥗",
            "🍝",
            "🍜",
            "🍲",
            "🍛",
            "🍣",
            "🍱",
            "🥟",
            "🍦",
            "🍰",
            "🎂",
            "🧁",
            "🍪",
            "🍩",
            "☕",
            "🍵",
        ],
        Deportes: [
            "⚽",
            "🏀",
            "🏈",
            "⚾",
            "🥎",
            "🎾",
            "🏐",
            "🏉",
            "🥏",
            "🎱",
            "🏓",
            "🏸",
            "🏒",
            "🏑",
            "🥍",
            "🏏",
            "🥊",
            "🥋",
            "🎯",
            "⛳",
        ],
    };

    // GIFs simulados (en producción, estos vendrían de una API como Giphy o Tenor)
    const gifs = [
        {
            id: 1,
            url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif",
            title: "Celebration",
        },
        {
            id: 2,
            url: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
            title: "Happy Dance",
        },
        {
            id: 3,
            url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
            title: "Thumbs Up",
        },
        {
            id: 4,
            url: "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif",
            title: "Excited",
        },
        {
            id: 5,
            url: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
            title: "Clapping",
        },
        {
            id: 6,
            url: "https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif",
            title: "Dancing",
        },
        {
            id: 7,
            url: "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
            title: "Wow",
        },
        {
            id: 8,
            url: "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif",
            title: "Love",
        },
    ];

    const handlePostChange = (event) => {
        const text = event.target.value;
        if (text.length <= maxChars) {
            setPostText(text);
            setCharCount(text.length);
        }
    };

const handlePostSubmit = async () => {
    if (postText.trim() !== "" || selectedImage) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/posts/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyMiwiZW1haWwiOiJlcmljbXVudGFzQGdtYWlsLmNvbSIsInJvbGVzIjpbInVzZXIiLCJST0xFX1VTRVIiXSwiaWF0IjoxNzY0OTUzNjIwLCJleHAiOjE3NjQ5NTcyMjB9.CKQczWuNJwrCac-XJzDxmxifaJMTZNyOYLZWYoLQOHk'
                },
                body: JSON.stringify({
                    user: 22,
                    content: postText,
                    image: selectedImage || null
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Post creado exitosamente:", data);
                onClose();
            } else {
                console.error("Error al crear el post:", data);
                alert(data.error || "Error al crear el post");
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error al conectar con el servidor");
        }
    }
};

    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            onClose();
        }
    };

    // Manejo de imagen
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Manejo de emojis
    const handleEmojiClick = (emoji) => {
        const textarea = textareaRef.current;
        const cursorPosition = textarea.selectionStart;
        const newText =
            postText.slice(0, cursorPosition) +
            emoji +
            postText.slice(cursorPosition);

        if (newText.length <= maxChars) {
            setPostText(newText);
            setCharCount(newText.length);

            // Mantener el focus y posicionar el cursor después del emoji
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(
                    cursorPosition + emoji.length,
                    cursorPosition + emoji.length
                );
            }, 0);
        }
    };

    // Manejo de GIFs
    const handleGifSelect = (gifUrl) => {
        setSelectedImage(gifUrl);
        setShowGifPicker(false);
    };

    const isPostButtonEnabled = postText.trim().length > 0 || selectedImage;
    const charPercentage = (charCount / maxChars) * 100;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content post-modal-content">
                <div className="post-header">
                    <button className="close-x-button" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="post-body">
                    <div className="post-user-section">
                        <div className="post-avatar">
                            <LinkIcon
                                name={"imagen2"}
                                anchor={false}
                                classname={"avatar-icon"}
                            />
                        </div>
                        <div className="post-input-wrapper">
                            <textarea
                                ref={textareaRef}
                                placeholder="¿Qué está pasando?"
                                className="post-textarea"
                                value={postText}
                                onChange={handlePostChange}
                                maxLength={maxChars}
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Previsualización de imagen/GIF */}
                    {selectedImage && (
                        <div className="image-preview-container">
                            <img
                                src={selectedImage}
                                alt="Preview"
                                className="image-preview"
                            />
                            <button
                                className="remove-image-button"
                                onClick={handleRemoveImage}
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Selector de emojis */}
                    {showEmojiPicker && (
                        <div className="emoji-picker">
                            <div className="emoji-picker-header">
                                <h3>Emojis</h3>
                                <button
                                    className="emoji-close-button"
                                    onClick={() => setShowEmojiPicker(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="emoji-picker-content">
                                {Object.entries(emojiCategories).map(
                                    ([category, emojis]) => (
                                        <div
                                            key={category}
                                            className="emoji-category"
                                        >
                                            <div className="emoji-category-name">
                                                {category}
                                            </div>
                                            <div className="emoji-grid">
                                                {emojis.map((emoji, index) => (
                                                    <button
                                                        key={index}
                                                        className="emoji-button"
                                                        onClick={() =>
                                                            handleEmojiClick(
                                                                emoji
                                                            )
                                                        }
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Selector de GIFs */}
                    {showGifPicker && (
                        <div className="gif-picker">
                            <div className="gif-picker-header">
                                <h3>Elige un GIF</h3>
                                <button
                                    className="gif-close-button"
                                    onClick={() => setShowGifPicker(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="gif-picker-content">
                                <div className="gif-grid">
                                    {gifs.map((gif) => (
                                        <div
                                            key={gif.id}
                                            className="gif-item"
                                            onClick={() =>
                                                handleGifSelect(gif.url)
                                            }
                                        >
                                            <img
                                                src={gif.url}
                                                alt={gif.title}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="post-footer">
                    <div className="post-media-tools">
                        <div className="media-tools-left">
                            {/* Input oculto para archivos */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />

                            <button
                                className="media-tool"
                                title="Agregar imagen"
                                onClick={handleImageClick}
                            >
                                <LinkIcon
                                    name={"icon29"}
                                    anchor={false}
                                    classname={""}
                                />
                            </button>

                            <button
                                className="media-tool"
                                title="Agregar GIF"
                                onClick={() => {
                                    setShowGifPicker(!showGifPicker);
                                    setShowEmojiPicker(false);
                                }}
                            >
                                <LinkIcon
                                    name={"icon27"}
                                    anchor={false}
                                    classname={""}
                                />
                            </button>

                            <button
                                className="media-tool"
                                title="Agregar emoji"
                                onClick={() => {
                                    setShowEmojiPicker(!showEmojiPicker);
                                    setShowGifPicker(false);
                                }}
                            >
                                <LinkIcon
                                    name={"icon25"}
                                    anchor={false}
                                    classname={""}
                                />
                            </button>
                        </div>

                        <div className="media-tools-right">
                            {charCount > 0 && (
                                <div className="char-counter">
                                    <svg
                                        width="30"
                                        height="30"
                                        viewBox="0 0 30 30"
                                        className="char-circle"
                                    >
                                        <circle
                                            cx="15"
                                            cy="15"
                                            r="12"
                                            fill="none"
                                            stroke="#eff3f4"
                                            strokeWidth="2"
                                        />
                                        <circle
                                            cx="15"
                                            cy="15"
                                            r="12"
                                            fill="none"
                                            stroke={
                                                charPercentage >= 100
                                                    ? "#f4212e"
                                                    : charPercentage >= 90
                                                    ? "#ffd400"
                                                    : "#318041"
                                            }
                                            strokeWidth="2"
                                            strokeDasharray={`${
                                                (charPercentage / 100) * 75.4
                                            } 75.4`}
                                            transform="rotate(-90 15 15)"
                                        />
                                    </svg>
                                    {charCount >= maxChars - 20 && (
                                        <span
                                            className={`char-count ${
                                                charCount >= maxChars
                                                    ? "over-limit"
                                                    : ""
                                            }`}
                                        >
                                            {maxChars - charCount}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="post-actions">
                        <Button
                            onClick={handlePostSubmit}
                            classButton={`post-button ${
                                !isPostButtonEnabled ? "disabled" : ""
                            }`}
                            disabled={!isPostButtonEnabled}
                        >
                            <span className="post-button-text">Postear</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
