import React, { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import "../../styles/Modal.css";
import { Camera, X } from "lucide-react";
import { toast } from 'react-toastify';

function EditCommunityModal({ isOpen, onClose, communityId }) {
    const [name, setName] = useState("");
    const [biography, setBiography] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const maxChars = 160;

    const profileInputRef = useRef(null);
    const bannerInputRef = useRef(null);

    // Load community data
    useEffect(() => {
        if (isOpen && communityId) {
            loadCommunityData();
        }
    }, [isOpen, communityId]);

    const loadCommunityData = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) return;

            const response = await fetch(`http://127.0.0.1:8000/api/communities/${communityId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const communityData = await response.json();
                setName(communityData.name || "");
                setBiography(communityData.biography || "");
                setCharCount(communityData.biography?.length || 0);
                setProfilePreview(communityData.photo_url ? `http://127.0.0.1:8000${communityData.photo_url}` : null);
                setBannerPreview(communityData.banner_url ? `http://127.0.0.1:8000${communityData.banner_url}` : null);
            }
        } catch (error) {
            console.error("Error loading community data:", error);
        }
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleBiographyChange = (event) => {
        const text = event.target.value;
        if (text.length <= maxChars) {
            setBiography(text);
            setCharCount(text.length);
        }
    };

    const handleProfileImageClick = () => {
        profileInputRef.current?.click();
    };

    const handleBannerImageClick = () => {
        bannerInputRef.current?.click();
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBannerImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setBannerImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProfileImage = (e) => {
        e.stopPropagation();
        setProfileImage(null);
        setProfilePreview(null);
        if (profileInputRef.current) {
            profileInputRef.current.value = "";
        }
    };

    const handleRemoveBannerImage = (e) => {
        e.stopPropagation();
        setBannerImage(null);
        setBannerPreview(null);
        if (bannerInputRef.current) {
            bannerInputRef.current.value = "";
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error("Debes iniciar sesión");
                return;
            }

            const updateData = {
                name: name,
                biography: biography
            };

            // Upload profile image if there's a new one
            if (profileImage) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result;
                    updateData.photo_data = base64Image;

                    // Upload banner and update
                    await uploadBannerAndUpdate(token, updateData);
                };
                reader.readAsDataURL(profileImage);
            } else {
                // No new profile image, continue with banner
                await uploadBannerAndUpdate(token, updateData);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar los cambios");
            setIsSubmitting(false);
        }
    };

    const uploadBannerAndUpdate = async (token, updateData) => {
        try {
            // Upload banner image if there's a new one
            if (bannerImage) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result;
                    updateData.banner_data = base64Image;

                    // Update community
                    await updateCommunity(token, updateData);
                };
                reader.readAsDataURL(bannerImage);
            } else {
                // No new banner image, update directly
                await updateCommunity(token, updateData);
            }
        } catch (error) {
            console.error("Error uploading banner:", error);
            setIsSubmitting(false);
        }
    };

    const updateCommunity = async (token, updateData) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/communities/${communityId}/edit`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updateData)
                }
            );

            if (response.ok) {
                alert("Comunidad actualizada correctamente");
                onClose();
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al actualizar la comunidad");
            }
        } catch (error) {
            console.error("Error updating community:", error);
            alert("Error al actualizar la comunidad");
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

    const charPercentage = (charCount / maxChars) * 100;

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content post-modal-content" style={{ maxWidth: "600px" }}>
                {/* Header */}
                <div className="post-header">
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#0f1419",
                        margin: "0"
                    }}>
                        Editar Comunidad
                    </h2>
                    <button className="close-x-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="post-body" style={{ maxHeight: "70vh" }}>
                    {/* Banner Upload */}
                    <div style={{ marginBottom: "60px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#0f1419",
                            marginBottom: "8px"
                        }}>
                            Banner
                        </label>
                        <div
                            onClick={handleBannerImageClick}
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "200px",
                                backgroundColor: bannerPreview ? "transparent" : "#cfd9de",
                                backgroundImage: bannerPreview ? `url(${bannerPreview})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                border: "2px dashed #536471"
                            }}
                        >
                            {!bannerPreview && (
                                <Camera size={48} color="#536471" />
                            )}
                            {bannerPreview && (
                                <button
                                    onClick={handleRemoveBannerImage}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(15, 20, 25, 0.75)",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "background-color 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(15, 20, 25, 0.9)"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(15, 20, 25, 0.75)"}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleBannerImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Profile Photo Upload */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#0f1419",
                            marginBottom: "8px"
                        }}>
                            Foto de Perfil
                        </label>
                        <div
                            onClick={handleProfileImageClick}
                            style={{
                                position: "relative",
                                width: "134px",
                                height: "134px",
                                borderRadius: "20px",
                                backgroundColor: profilePreview ? "transparent" : "#cfd9de",
                                backgroundImage: profilePreview ? `url(${profilePreview})` : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                border: "2px dashed #536471"
                            }}
                        >
                            {!profilePreview && (
                                <Camera size={32} color="#536471" />
                            )}
                            {profilePreview && (
                                <button
                                    onClick={handleRemoveProfileImage}
                                    style={{
                                        position: "absolute",
                                        top: "8px",
                                        right: "8px",
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(15, 20, 25, 0.75)",
                                        color: "white",
                                        border: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "background-color 0.2s"
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(15, 20, 25, 0.9)"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(15, 20, 25, 0.75)"}
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                        <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    {/* Community Name */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={{
                            display: "block",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#0f1419",
                            marginBottom: "8px"
                        }}>
                            Nombre de la Comunidad
                        </label>
                        <input
                            type="text"
                            placeholder="Nombre de la comunidad"
                            value={name}
                            onChange={handleNameChange}
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid #cfd9de",
                                borderRadius: "8px",
                                fontFamily: "inherit",
                                color: "#0f1419",
                                outline: "none"
                            }}
                        />
                    </div>

                    {/* Biography */}
                    <div>
                        <label style={{
                            display: "block",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#0f1419",
                            marginBottom: "8px"
                        }}>
                            Descripción
                        </label>
                        <textarea
                            placeholder="Describe tu comunidad..."
                            value={biography}
                            onChange={handleBiographyChange}
                            maxLength={maxChars}
                            style={{
                                width: "100%",
                                minHeight: "100px",
                                padding: "12px",
                                fontSize: "15px",
                                border: "1px solid #cfd9de",
                                borderRadius: "8px",
                                resize: "vertical",
                                fontFamily: "inherit",
                                color: "#0f1419",
                                outline: "none"
                            }}
                        />
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "4px"
                        }}>
                            <span style={{
                                fontSize: "13px",
                                color: charPercentage >= 100 ? "#f4212e" : "#536471"
                            }}>
                                {charCount}/{maxChars}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="post-footer">
                    <div className="post-actions" style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                        <Button
                            onClick={onClose}
                            classButton="post-button"
                            style={{
                                background: "transparent",
                                border: "1px solid #cfd9de",
                                color: "#0f1419"
                            }}
                        >
                            <span className="post-button-text" style={{ color: "#0f1419" }}>
                                Cancelar
                            </span>
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            classButton={`post-button ${isSubmitting ? "disabled" : ""}`}
                            disabled={isSubmitting}
                        >
                            <span className="post-button-text">
                                {isSubmitting ? "Guardando..." : "Guardar"}
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditCommunityModal;
