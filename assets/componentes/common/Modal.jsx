import React, { useState } from "react";
import Button from "../ui/Button";
import LinkIcon from "../ui/LinkIcon";
import "../../styles/Modal.css"

function Modal({ children, onClose }) {
    const [postText, setPostText] = useState("");
    const handlePostChange = (event) => {
        setPostText(event.target.value);
    };
    const handlePostSubmit = () => {
        if (postText.trim() !== "") {
            console.log("Post enviado:", postText);
            // API
            onClose();
        }
    };
    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            onClose();
        }
    };
    const isPostButtonEnabled = postText.trim().length > 0;
    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content post-modal-content">
                {" "}
                <div className="post-header">
                    <button className="close-x-button" onClick={onClose}>
                        ×
                    </button>
                </div>
                <div className="post-input-area">
                    <textarea
                        placeholder="¿Qué quieres compartir hoy?"
                        rows="4"
                        className="post-textarea"
                        value={postText}
                        onChange={handlePostChange}
                    />
                </div>
                <div className="post-media-tools">
                    <LinkIcon
                        name={"icon_image"}
                        anchor={false}
                        classname={"media-tool"}
                        text={""}
                    />
                    <LinkIcon
                        name={"icon_gif"}
                        anchor={false}
                        classname={"media-tool"}
                        text={""}
                    />
                    <LinkIcon
                        name={"icon_emoji"}
                        anchor={false}
                        classname={"media-tool"}
                        text={""}
                    />
                </div>
                <div className="post-actions">
                    <Button
                        onClick={handlePostSubmit}
                        classButton={`button-primary post-button ${
                            !isPostButtonEnabled ? "disabled" : ""
                        }`}
                        disabled={!isPostButtonEnabled}
                    >
                        Postear
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
