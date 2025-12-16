import React, { useState } from "react";
import "../../styles/ReplyInput.css";
import { toast } from 'react-toastify';

const ReplyInput = ({ postId, onReplySubmitted }) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getCurrentUser = () => {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!userStr || !token) return null;
        return { user: JSON.parse(userStr), token };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Por favor escribe una respuesta");
            return;
        }

        const auth = getCurrentUser();
        if (!auth) {
            toast.error("Debes iniciar sesión para responder");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/replies/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.token}`
                },
                body: JSON.stringify({
                    user: auth.user.id,
                    post: postId,
                    content: content.trim()
                })
            });

            const data = await response.json();

            if (response.ok) {
                setContent("");
                if (onReplySubmitted) {
                    onReplySubmitted();
                }
            } else {
                console.error("Error:", data.error);
                toast.error(data.error || "Error al crear la respuesta");
            }
        } catch (error) {
            console.error("Error de red:", error);
            toast.error("Error al conectar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reply-input-container">
            <form onSubmit={handleSubmit} className="reply-input-form">
                <textarea
                    className="reply-input-textarea"
                    placeholder="Escribe tu respuesta..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isSubmitting}
                    rows={3}
                />
                <div className="reply-input-footer">
                    <span className="reply-input-count">{content.length} caracteres</span>
                    <button
                        type="submit"
                        className="reply-input-button"
                        disabled={isSubmitting || !content.trim()}
                    >
                        {isSubmitting ? "Enviando..." : "Responder"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReplyInput;
