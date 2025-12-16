import React, { useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import "../../styles/Modal.css";
import { Camera, X } from "lucide-react";
import defaultAvatar from "../../img/user.png";
import { toast } from 'react-toastify';
function UserSettingsModal({ isOpen, onClose }) {
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

    // Cargar datos del usuario actual
    useEffect(() => {
        if (isOpen) {
            loadUserData();
        }
    }, [isOpen]);

    const loadUserData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userStr || !token) return;

            const user = JSON.parse(userStr);

            // Cargar datos del usuario desde la API
            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setBiography(userData.biography || "");
                setCharCount(userData.biography?.length || 0);
                setProfilePreview(userData.photo_url ? `http://127.0.0.1:8000${userData.photo_url}` : null);
                setBannerPreview(userData.banner_url ? `http://127.0.0.1:8000${userData.banner_url}` : null);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
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
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userStr || !token) {
                toast.error("Debes iniciar sesión");
                return;
            }

            const user = JSON.parse(userStr);
            let profileUrl = profilePreview;
            let bannerUrl = bannerPreview;

            // Subir imagen de perfil si hay una nueva
            if (profileImage) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result;

                    const uploadResponse = await fetch(
                        `http://127.0.0.1:8000/api/users/${user.id}/upload-image`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                image_type: 'profile',
                                image_data: base64Image
                            })
                        }
                    );

                    if (uploadResponse.ok) {
                        const uploadData = await uploadResponse.json();
                        profileUrl = uploadData.url;

                        // Continuar con el banner si es necesario
                        await uploadBannerAndUpdate(user, token, profileUrl, bannerUrl);
                    } else {
                        const errorData = await uploadResponse.json();
                        toast.error(errorData.error || "Error al subir la imagen de perfil");
                        setIsSubmitting(false);
                    }
                };
                reader.readAsDataURL(profileImage);
            } else {
                // No hay nueva imagen de perfil, continuar con el banner
                await uploadBannerAndUpdate(user, token, profileUrl, bannerUrl);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error al guardar los cambios");
            setIsSubmitting(false);
        }
    };

    const uploadBannerAndUpdate = async (user, token, profileUrl, bannerUrl) => {
        try {
            // Subir imagen de banner si hay una nueva
            if (bannerImage) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Image = reader.result;

                    const uploadResponse = await fetch(
                        `http://127.0.0.1:8000/api/users/${user.id}/upload-image`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                image_type: 'banner',
                                image_data: base64Image
                            })
                        }
                    );

                    if (uploadResponse.ok) {
                        const uploadData = await uploadResponse.json();
                        bannerUrl = uploadData.url;

                        // Actualizar perfil del usuario
                        await updateUserProfile(user, token, profileUrl, bannerUrl);
                    } else {
                        const errorData = await uploadResponse.json();
                        toast.error(errorData.error || "Error al subir la imagen de banner");
                        setIsSubmitting(false);
                    }
                };
                reader.readAsDataURL(bannerImage);
            } else {
                // No hay nueva imagen de banner, actualizar perfil directamente
                await updateUserProfile(user, token, profileUrl, bannerUrl);
            }
        } catch (error) {
            console.error("Error uploading banner:", error);
            setIsSubmitting(false);
        }
    };

    const updateUserProfile = async (user, token, profileUrl, bannerUrl) => {
        try {
            const updateData = {
                biography: biography
            };

            // ✅ Solo enviar si hubo una imagen NUEVA subida
            if (profileImage && profileUrl) {
                updateData.photo_url = profileUrl;
            }

            if (bannerImage && bannerUrl) {
                updateData.banner_url = bannerUrl;
            }

            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${user.id}/edit`,
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
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                toast.success("Perfil actualizado correctamente");
                onClose();
                // Esperar 1.5 segundos para que el toast se muestre antes de recargar
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Error al actualizar el perfil");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error al actualizar el perfil");
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
                        Editar Perfil
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
                                borderRadius: "50%",
                                backgroundColor: profilePreview ? "transparent" : "#cfd9de",
                                backgroundImage: profilePreview ? `url(${profilePreview})` : `url(${defaultAvatar})`,
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

                    {/* Biography */}
                    <div>
                        <label style={{
                            display: "block",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#0f1419",
                            marginBottom: "8px"
                        }}>
                            Biografía
                        </label>
                        <textarea
                            placeholder="Cuéntanos sobre ti..."
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

export default UserSettingsModal;
