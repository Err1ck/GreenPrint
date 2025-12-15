import React, { useState, useRef } from "react";
import Button from "../ui/Button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import "../../styles/Modal.css";

function CreateCommunityModal({ isOpen, onClose, onCommunityCreated }) {
    const [formData, setFormData] = useState({
        name: "",
        biography: "",
    });
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [selectedBanner, setSelectedBanner] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const photoInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setError(""); // Clear error when user types
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Por favor selecciona un archivo de imagen válido");
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError("La imagen es demasiado grande. Máximo 5MB.");
                return;
            }

            setSelectedPhoto(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const handleBannerChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Por favor selecciona un archivo de imagen válido");
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError("La imagen es demasiado grande. Máximo 5MB.");
                return;
            }

            setSelectedBanner(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError("");
        }
    };

    const removePhoto = () => {
        setSelectedPhoto(null);
        setPhotoPreview(null);
        if (photoInputRef.current) {
            photoInputRef.current.value = "";
        }
    };

    const removeBanner = () => {
        setSelectedBanner(null);
        setBannerPreview(null);
        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError("El nombre de la comunidad es obligatorio");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (!token || !userStr) {
                setError("Debes iniciar sesión para crear una comunidad");
                setIsSubmitting(false);
                return;
            }

            // Prepare data
            const requestData = {
                name: formData.name,
                biography: formData.biography || "",
            };

            // Convert images to base64 if selected
            if (selectedPhoto) {
                requestData.photo_data = await fileToBase64(selectedPhoto);
            }

            if (selectedBanner) {
                requestData.banner_data = await fileToBase64(selectedBanner);
            }

            const response = await fetch("http://127.0.0.1:8000/api/communities/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Comunidad creada exitosamente:", data);

                // Update user in localStorage if roles were updated
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                // Reset form
                setFormData({
                    name: "",
                    biography: "",
                });
                setSelectedPhoto(null);
                setSelectedBanner(null);
                setPhotoPreview(null);
                setBannerPreview(null);

                // Notify parent component
                if (onCommunityCreated) {
                    onCommunityCreated(data.community);
                }

                onClose();
            } else {
                const errorData = await response.json();
                setError(errorData.error || "Error al crear la comunidad");
            }
        } catch (error) {
            console.error("Error de red:", error);
            setError("Error al conectar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content post-modal-content" style={{ maxWidth: "600px" }}>
                <div className="post-header">
                    <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>
                        Crear comunidad
                    </h2>
                    <button className="close-x-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="post-body" style={{ padding: "20px" }}>
                    {error && (
                        <div
                            style={{
                                padding: "12px",
                                marginBottom: "16px",
                                backgroundColor: "#fee",
                                border: "1px solid #fcc",
                                borderRadius: "8px",
                                color: "#c00",
                                fontSize: "14px",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Nombre de la comunidad *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Mi comunidad"
                            maxLength={50}
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid var(--color-bg-secondary)",
                                borderRadius: "8px",
                                backgroundColor: "var(--color-bg)",
                                color: "var(--color-text-primary)",
                                outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#00ba7c")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--color-bg-secondary)")}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="biography"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Biografía
                        </label>
                        <textarea
                            id="biography"
                            name="biography"
                            value={formData.biography}
                            onChange={handleChange}
                            placeholder="Describe tu comunidad..."
                            maxLength={255}
                            rows={4}
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid var(--color-bg-secondary)",
                                borderRadius: "8px",
                                backgroundColor: "var(--color-bg)",
                                color: "var(--color-text-primary)",
                                outline: "none",
                                resize: "vertical",
                                fontFamily: "inherit",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={(e) => (e.target.style.borderColor = "#00ba7c")}
                            onBlur={(e) => (e.target.style.borderColor = "var(--color-bg-secondary)")}
                        />
                    </div>

                    {/* Photo Upload */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Foto de perfil
                        </label>
                        <input
                            ref={photoInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: "none" }}
                        />

                        {!photoPreview ? (
                            <div
                                onClick={() => photoInputRef.current?.click()}
                                style={{
                                    border: "2px dashed var(--color-bg-secondary)",
                                    borderRadius: "8px",
                                    padding: "40px 20px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    backgroundColor: "var(--color-bg)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#00ba7c";
                                    e.currentTarget.style.backgroundColor = "rgba(0, 186, 124, 0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--color-bg-secondary)";
                                    e.currentTarget.style.backgroundColor = "var(--color-bg)";
                                }}
                            >
                                <ImageIcon size={40} style={{ margin: "0 auto 12px", color: "#536471" }} />
                                <p style={{ margin: 0, color: "#536471", fontSize: "14px" }}>
                                    Haz clic para seleccionar una imagen
                                </p>
                                <p style={{ margin: "4px 0 0 0", color: "#8899a6", fontSize: "12px" }}>
                                    JPG, PNG, GIF o WEBP (máx. 5MB)
                                </p>
                            </div>
                        ) : (
                            <div style={{ position: "relative" }}>
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <button
                                    onClick={removePhoto}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "32px",
                                        height: "32px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Banner Upload */}
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "15px",
                                fontWeight: "600",
                                color: "var(--color-text-primary)",
                            }}
                        >
                            Banner
                        </label>
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBannerChange}
                            style={{ display: "none" }}
                        />

                        {!bannerPreview ? (
                            <div
                                onClick={() => bannerInputRef.current?.click()}
                                style={{
                                    border: "2px dashed var(--color-bg-secondary)",
                                    borderRadius: "8px",
                                    padding: "40px 20px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                    backgroundColor: "var(--color-bg)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#00ba7c";
                                    e.currentTarget.style.backgroundColor = "rgba(0, 186, 124, 0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--color-bg-secondary)";
                                    e.currentTarget.style.backgroundColor = "var(--color-bg)";
                                }}
                            >
                                <Upload size={40} style={{ margin: "0 auto 12px", color: "#536471" }} />
                                <p style={{ margin: 0, color: "#536471", fontSize: "14px" }}>
                                    Haz clic para seleccionar una imagen
                                </p>
                                <p style={{ margin: "4px 0 0 0", color: "#8899a6", fontSize: "12px" }}>
                                    JPG, PNG, GIF o WEBP (máx. 5MB)
                                </p>
                            </div>
                        ) : (
                            <div style={{ position: "relative" }}>
                                <img
                                    src={bannerPreview}
                                    alt="Preview"
                                    style={{
                                        width: "100%",
                                        maxHeight: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <button
                                    onClick={removeBanner}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "32px",
                                        height: "32px",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="post-footer" style={{ padding: "0 20px 20px" }}>
                    <div className="post-actions" style={{ justifyContent: "flex-end" }}>
                        <Button
                            onClick={handleSubmit}
                            classButton={`post-button ${!formData.name.trim() ? "disabled" : ""}`}
                            disabled={!formData.name.trim() || isSubmitting}
                        >
                            <span className="post-button-text">
                                {isSubmitting ? "Creando..." : "Crear comunidad"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateCommunityModal;
