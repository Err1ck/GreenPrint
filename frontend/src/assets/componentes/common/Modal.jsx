import React, { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import LinkIcon from "../ui/LinkIcon";
import { X } from "lucide-react";
import "../../styles/Modal.css";

function Modal({ children, onClose }) {
  const [postText, setPostText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [user, setUser] = useState(null);
  const [adminCommunities, setAdminCommunities] = useState([]);
  const [selectedPublisher, setSelectedPublisher] = useState({ type: 'user', data: null });
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const maxChars = 280;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setSelectedPublisher({ type: 'user', data: userData });
      fetchAdminCommunities(userData);
    }
  }, []);

  const fetchAdminCommunities = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://127.0.0.1:8000/api/communities", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const communities = await response.json();
        // Filter communities where user is admin
        const userAdminCommunities = communities.filter(community =>
          community.admin_ids && community.admin_ids.includes(userData.id)
        );
        setAdminCommunities(userAdminCommunities);
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
    } finally {
      setLoadingCommunities(false);
    }
  };

  // Emojis populares organizados por categorías
  const emojiCategories = {
    Expresiones: [
      "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂",
      "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛",
      "😝", "😜", "🤪", "🤨", "🧐", "🤓",
    ],
    Gestos: [
      "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉",
      "👆", "👇", "☝️", "👏", "🙌", "🤲", "🤝", "🙏", "💪",
    ],
    Corazones: [
      "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔",
      "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝",
    ],
    Naturaleza: [
      "🌱", "🌿", "🍀", "🌾", "🌳", "🌲", "🌴", "🌵", "🌷", "🌹",
      "🌺", "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "⭐", "✨", "⚡",
      "🔥", "💧",
    ],
    Animales: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯",
      "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🦄", "🐝",
      "🦋", "🐛",
    ],
    Comida: [
      "🍕", "🍔", "🍟", "🌭", "🍿", "🧇", "🥓", "🥞", "🧀", "🥗",
      "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🍦", "🍰", "🎂",
      "🧁", "🍪", "🍩", "☕", "🍵",
    ],
    Deportes: [
      "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱",
      "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥊", "🥋", "🎯", "⛳",
    ],
  };

  // GIFs simulados
  const gifs = [
    { id: 1, url: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif", title: "Celebration" },
    { id: 2, url: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif", title: "Happy Dance" },
    { id: 3, url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", title: "Thumbs Up" },
    { id: 4, url: "https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif", title: "Excited" },
    { id: 5, url: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif", title: "Clapping" },
    { id: 6, url: "https://media.giphy.com/media/3oz8xAFtqoOUUrsh7W/giphy.gif", title: "Dancing" },
    { id: 7, url: "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif", title: "Wow" },
    { id: 8, url: "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif", title: "Love" },
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
      setIsSubmitting(true);

      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");

        if (!token || !userStr) {
          alert("Debes iniciar sesión para crear un post");
          setIsSubmitting(false);
          return;
        }

        const user = JSON.parse(userStr);

        const formData = new FormData();
        formData.append("user", user.id);
        formData.append("content", postText);

        // Add community parameter if publishing as community
        if (selectedPublisher.type === 'community') {
          formData.append("community", selectedPublisher.data.id);
        }

        if (selectedImage) {
          if (selectedImage.file) {
            formData.append("image", selectedImage.file);
          } else if (selectedImage.isGif && selectedImage.url) {
            formData.append("gif_url", selectedImage.url);
          }
        }

        const response = await fetch("http://127.0.0.1:8000/api/posts/create", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          console.log("Post creado exitosamente");
          window.location.reload();
          return;
        }

        try {
          const data = await response.json();
          console.error("Error al crear el post:", data);
          alert(data.error || "Error al crear el post");
        } catch (jsonError) {
          alert("Error al crear el post");
        }
        setIsSubmitting(false);
      } catch (error) {
        console.error("Error de red:", error);
        alert("Error al conectar con el servidor");
        setIsSubmitting(false);
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          preview: reader.result,
          file: file,
          isGif: false,
        });
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

  const handleEmojiClick = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = postText.substring(0, start) + emoji + postText.substring(end);

      if (newText.length <= maxChars) {
        setPostText(newText);
        setCharCount(newText.length);

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
      }
    }
  };

  const handleGifSelect = (gifUrl) => {
    setSelectedImage({
      preview: gifUrl,
      file: null,
      isGif: true,
      url: gifUrl,
    });
    setShowGifPicker(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  const isPostButtonEnabled = postText.trim().length > 0 || selectedImage;
  const charPercentage = (charCount / maxChars) * 100;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content post-modal-content">
        <div className="post-header">
          <div></div>
          <button className="close-x-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="post-body">
          {/* Publisher Selector */}
          {!loadingCommunities && adminCommunities.length > 0 && (
            <div style={{
              padding: "12px 16px",
              borderBottom: "1px solid #eff3f4",
              marginBottom: "12px"
            }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "#536471",
                marginBottom: "8px"
              }}>
                Publicar como:
              </label>
              <select
                value={selectedPublisher.type === 'user' ? 'user' : selectedPublisher.data.id}
                onChange={(e) => {
                  if (e.target.value === 'user') {
                    setSelectedPublisher({ type: 'user', data: user });
                  } else {
                    const community = adminCommunities.find(c => c.id === parseInt(e.target.value));
                    setSelectedPublisher({ type: 'community', data: community });
                  }
                }}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  fontSize: "15px",
                  border: "1px solid #cfd9de",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                <option value="user">👤 {user?.username || "Usuario"}</option>
                {adminCommunities.map(community => (
                  <option key={community.id} value={community.id}>
                    🌳 {community.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="post-user-section">
            <div
              className="post-avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: selectedPublisher.type === 'community' ? "20%" : "50%",
                overflow: "hidden",
                backgroundColor: "#cfd9de",
                flexShrink: 0,
                alignSelf: "flex-start"
              }}
            >
              {selectedPublisher.type === 'user' ? (
                user?.photo_url ? (
                  <img
                    src={`http://127.0.0.1:8000${user.photo_url}`}
                    alt={user.username}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#536471"
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                )
              ) : (
                selectedPublisher.data?.photo_url ? (
                  <img
                    src={`http://127.0.0.1:8000${selectedPublisher.data.photo_url}`}
                    alt={selectedPublisher.data.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#536471"
                    }}
                  >
                    {selectedPublisher.data?.name?.charAt(0).toUpperCase() || "C"}
                  </div>
                )
              )}
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
                src={selectedImage.preview || selectedImage}
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
                {Object.entries(emojiCategories).map(([category, emojis]) => (
                  <div key={category} className="emoji-category">
                    <div className="emoji-category-name">{category}</div>
                    <div className="emoji-grid">
                      {emojis.map((emoji, index) => (
                        <button
                          key={index}
                          className="emoji-button"
                          onClick={() => handleEmojiClick(emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
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
                      onClick={() => handleGifSelect(gif.url)}
                    >
                      <img src={gif.url} alt={gif.title} />
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
                  classLink={"modal-icon"}
                  name={"image"}
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
                  classLink={"modal-icon"}
                  name={"gif"}
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
                  classLink={"modal-icon"}
                  name={"emoji"}
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
                      strokeDasharray={`${(charPercentage / 100) * 75.4} 75.4`}
                      transform="rotate(-90 15 15)"
                    />
                  </svg>
                  {charCount >= maxChars - 20 && (
                    <span
                      className={`char-count ${charCount >= maxChars ? "over-limit" : ""
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
              classButton={`post-button ${!isPostButtonEnabled ? "disabled" : ""
                }`}
              disabled={!isPostButtonEnabled || isSubmitting}
            >
              <span className="post-button-text">
                {isSubmitting ? "Posteando..." : "Postear"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
