import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import "../../styles/Modal.css";
import { X, Palette, Lock, Shield } from "lucide-react";

function SettingsModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("appearance");
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Account states
    const [newEmail, setNewEmail] = useState("");
    const [confirmEmail, setConfirmEmail] = useState("");
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);

    // Privacy states
    const [isPrivate, setIsPrivate] = useState(false);
    const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

    // Cargar datos del usuario
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

            // Cargar tema
            const storedTheme = localStorage.getItem("theme");
            setIsDarkMode(storedTheme === "dark");

            // Cargar datos del usuario desde la API
            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setNewEmail(userData.email || "");
                setConfirmEmail(userData.email || "");
                setIsPrivate(userData.is_private || false);
            }
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDarkMode(true);
        }
    };

    const handleEmailChange = async () => {
        if (newEmail !== confirmEmail) {
            alert("Los emails no coinciden");
            return;
        }

        if (!newEmail || newEmail.trim() === "") {
            alert("El email no puede estar vacío");
            return;
        }

        try {
            setIsUpdatingEmail(true);
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userStr || !token) {
                alert("Debes iniciar sesión");
                return;
            }

            const user = JSON.parse(userStr);

            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    email: newEmail
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                alert("Email actualizado correctamente");
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al actualizar el email");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar el email");
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    const handlePrivacyToggle = async () => {
        try {
            setIsUpdatingPrivacy(true);
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userStr || !token) {
                alert("Debes iniciar sesión");
                return;
            }

            const user = JSON.parse(userStr);
            const newPrivacyValue = !isPrivate;

            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    is_private: newPrivacyValue
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setIsPrivate(newPrivacyValue);
                alert(`Perfil ${newPrivacyValue ? 'privado' : 'público'} activado`);
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al actualizar la privacidad");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al actualizar la privacidad");
        } finally {
            setIsUpdatingPrivacy(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmation = window.confirm(
            "¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
        );

        if (!confirmation) return;

        const doubleConfirmation = window.confirm(
            "Esta es tu última oportunidad. ¿Realmente quieres eliminar tu cuenta permanentemente?"
        );

        if (!doubleConfirmation) return;

        try {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userStr || !token) {
                alert("Debes iniciar sesión");
                return;
            }

            const user = JSON.parse(userStr);

            const response = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/destroy`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Cuenta eliminada correctamente");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Error al eliminar la cuenta");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al eliminar la cuenta");
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            onClose();
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: "appearance", label: "Apariencia", icon: Palette },
        { id: "account", label: "Cuenta", icon: Lock },
        { id: "privacy", label: "Privacidad", icon: Shield },
    ];

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content post-modal-content" style={{ maxWidth: "700px", minHeight: "500px" }}>
                {/* Header */}
                <div className="post-header">
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                        margin: "0"
                    }}>
                        Configuración
                    </h2>
                    <button className="close-x-button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* Body with Tabs */}
                <div style={{ display: "flex", height: "500px" }}>
                    {/* Sidebar with tabs */}
                    <div style={{
                        width: "200px",
                        borderRight: "1px solid var(--color-bg-secondary)",
                        padding: "16px 0"
                    }}>
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <div
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: "12px 16px",
                                        cursor: "pointer",
                                        backgroundColor: activeTab === tab.id ? "var(--color-bg-secondary)" : "transparent",
                                        borderLeft: activeTab === tab.id ? "3px solid #00ba7c" : "3px solid transparent",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        transition: "all 0.2s"
                                    }}
                                    onMouseEnter={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.backgroundColor = "var(--color-bg-secondary)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (activeTab !== tab.id) {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }
                                    }}
                                >
                                    <Icon size={20} color={activeTab === tab.id ? "#00ba7c" : "#536471"} />
                                    <span style={{
                                        fontSize: "15px",
                                        fontWeight: activeTab === tab.id ? "700" : "400",
                                        color: activeTab === tab.id ? "var(--color-text-primary)" : "#536471"
                                    }}>
                                        {tab.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Content area */}
                    <div style={{
                        flex: 1,
                        padding: "24px",
                        overflowY: "auto"
                    }}>
                        {/* Apariencia Tab */}
                        {activeTab === "appearance" && (
                            <div>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "var(--color-text-primary)",
                                    marginBottom: "16px"
                                }}>
                                    Apariencia
                                </h3>

                                {/* Theme Toggle */}
                                <div style={{
                                    padding: "16px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    borderRadius: "12px",
                                    marginBottom: "16px"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <h4 style={{
                                                fontSize: "15px",
                                                fontWeight: "600",
                                                color: "var(--color-text-primary)",
                                                margin: "0 0 4px 0"
                                            }}>
                                                Modo Oscuro
                                            </h4>
                                            <p style={{
                                                fontSize: "13px",
                                                color: "#536471",
                                                margin: 0
                                            }}>
                                                Cambia entre tema claro y oscuro
                                            </p>
                                        </div>
                                        <button
                                            onClick={toggleTheme}
                                            style={{
                                                width: "52px",
                                                height: "28px",
                                                borderRadius: "14px",
                                                backgroundColor: isDarkMode ? "#00ba7c" : "#cfd9de",
                                                border: "none",
                                                cursor: "pointer",
                                                position: "relative",
                                                transition: "background-color 0.3s"
                                            }}
                                        >
                                            <div style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "white",
                                                position: "absolute",
                                                top: "2px",
                                                left: isDarkMode ? "26px" : "2px",
                                                transition: "left 0.3s",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                            }} />
                                        </button>
                                    </div>
                                </div>

                                <p style={{
                                    fontSize: "13px",
                                    color: "#536471",
                                    fontStyle: "italic"
                                }}>
                                    Más opciones de personalización próximamente...
                                </p>
                            </div>
                        )}

                        {/* Cuenta Tab */}
                        {activeTab === "account" && (
                            <div>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "var(--color-text-primary)",
                                    marginBottom: "16px"
                                }}>
                                    Cuenta y Seguridad
                                </h3>

                                {/* Cambiar Email */}
                                <div style={{
                                    padding: "16px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    borderRadius: "12px",
                                    marginBottom: "16px"
                                }}>
                                    <h4 style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "var(--color-text-primary)",
                                        margin: "0 0 12px 0"
                                    }}>
                                        Cambiar Email
                                    </h4>
                                    <input
                                        type="email"
                                        placeholder="Nuevo email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            marginBottom: "8px",
                                            border: "1px solid #cfd9de",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontFamily: "inherit",
                                            color: "var(--color-text-primary)",
                                            backgroundColor: "var(--color-bg)"
                                        }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Confirmar email"
                                        value={confirmEmail}
                                        onChange={(e) => setConfirmEmail(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            marginBottom: "12px",
                                            border: "1px solid #cfd9de",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontFamily: "inherit",
                                            color: "var(--color-text-primary)",
                                            backgroundColor: "var(--color-bg)"
                                        }}
                                    />
                                    <button
                                        onClick={handleEmailChange}
                                        disabled={isUpdatingEmail}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#00ba7c",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "20px",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            cursor: isUpdatingEmail ? "not-allowed" : "pointer",
                                            opacity: isUpdatingEmail ? 0.6 : 1
                                        }}
                                    >
                                        {isUpdatingEmail ? "Actualizando..." : "Actualizar Email"}
                                    </button>
                                </div>

                                {/* Eliminar Cuenta */}
                                <div style={{
                                    padding: "16px",
                                    backgroundColor: "#fff5f5",
                                    border: "1px solid #fed7d7",
                                    borderRadius: "12px"
                                }}>
                                    <h4 style={{
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "#c53030",
                                        margin: "0 0 8px 0"
                                    }}>
                                        Eliminar cuenta
                                    </h4>
                                    <p style={{
                                        fontSize: "13px",
                                        color: "#742a2a",
                                        margin: "0 0 12px 0"
                                    }}>
                                        Una vez que elimines tu cuenta, no hay vuelta atrás.
                                    </p>
                                    <button
                                        onClick={handleDeleteAccount}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#e53e3e",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "20px",
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Eliminar Cuenta
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Privacidad Tab */}
                        {activeTab === "privacy" && (
                            <div>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "var(--color-text-primary)",
                                    marginBottom: "16px"
                                }}>
                                    Privacidad
                                </h3>

                                {/* Perfil Privado */}
                                <div style={{
                                    padding: "16px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    borderRadius: "12px",
                                    marginBottom: "16px"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <h4 style={{
                                                fontSize: "15px",
                                                fontWeight: "600",
                                                color: "var(--color-text-primary)",
                                                margin: "0 0 4px 0"
                                            }}>
                                                Perfil Privado
                                            </h4>
                                            <p style={{
                                                fontSize: "13px",
                                                color: "#536471",
                                                margin: 0
                                            }}>
                                                Solo tus seguidores pueden ver tus publicaciones
                                            </p>
                                        </div>
                                        <button
                                            onClick={handlePrivacyToggle}
                                            disabled={isUpdatingPrivacy}
                                            style={{
                                                width: "52px",
                                                height: "28px",
                                                borderRadius: "14px",
                                                backgroundColor: isPrivate ? "#00ba7c" : "#cfd9de",
                                                border: "none",
                                                cursor: isUpdatingPrivacy ? "not-allowed" : "pointer",
                                                position: "relative",
                                                transition: "background-color 0.3s",
                                                opacity: isUpdatingPrivacy ? 0.6 : 1
                                            }}
                                        >
                                            <div style={{
                                                width: "24px",
                                                height: "24px",
                                                borderRadius: "50%",
                                                backgroundColor: "white",
                                                position: "absolute",
                                                top: "2px",
                                                left: isPrivate ? "26px" : "2px",
                                                transition: "left 0.3s",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                                            }} />
                                        </button>
                                    </div>
                                </div>

                                <p style={{
                                    fontSize: "13px",
                                    color: "#536471",
                                    fontStyle: "italic"
                                }}>
                                    Más opciones de privacidad próximamente...
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
