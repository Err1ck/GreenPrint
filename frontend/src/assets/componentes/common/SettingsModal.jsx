import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import "../../styles/Modal.css";
import { X, Palette, Lock, Bell, Shield } from "lucide-react";

function SettingsModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("appearance");
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Cargar tema actual
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        setIsDarkMode(storedTheme === "dark");
    }, [isOpen]);

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
        { id: "notifications", label: "Notificaciones", icon: Bell },
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
                                
                                <div style={{
                                    padding: "24px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    borderRadius: "12px",
                                    textAlign: "center"
                                }}>
                                    <Lock size={48} color="#536471" style={{ marginBottom: "12px" }} />
                                    <p style={{
                                        fontSize: "15px",
                                        color: "#536471",
                                        margin: 0
                                    }}>
                                        Opciones de cuenta próximamente:
                                    </p>
                                    <ul style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "12px 0 0 0",
                                        fontSize: "14px",
                                        color: "#536471"
                                    }}>
                                        <li>• Cambiar contraseña</li>
                                        <li>• Cambiar email</li>
                                        <li>• Autenticación de dos factores</li>
                                        <li>• Eliminar cuenta</li>
                                    </ul>
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
                                
                                <div style={{
                                    padding: "24px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    borderRadius: "12px",
                                    textAlign: "center"
                                }}>
                                    <Shield size={48} color="#536471" style={{ marginBottom: "12px" }} />
                                    <p style={{
                                        fontSize: "15px",
                                        color: "#536471",
                                        margin: 0
                                    }}>
                                        Opciones de privacidad próximamente:
                                    </p>
                                    <ul style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "12px 0 0 0",
                                        fontSize: "14px",
                                        color: "#536471"
                                    }}>
                                        <li>• Perfil público/privado</li>
                                        <li>• Usuarios bloqueados</li>
                                        <li>• Contenido silenciado</li>
                                        <li>• Visibilidad de actividad</li>
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* Notificaciones Tab */}
                        {activeTab === "notifications" && (
                            <div>
                                <h3 style={{
                                    fontSize: "18px",
                                    fontWeight: "700",
                                    color: "var(--color-text-primary)",
                                    marginBottom: "16px"
                                }}>
                                    Notificaciones
                                </h3>
                                
                                <div style={{
                                    padding: "24px",
                                    backgroundColor: "var(--color-bg-secondary)",
                                    borderRadius: "12px",
                                    textAlign: "center"
                                }}>
                                    <Bell size={48} color="#536471" style={{ marginBottom: "12px" }} />
                                    <p style={{
                                        fontSize: "15px",
                                        color: "#536471",
                                        margin: 0
                                    }}>
                                        Opciones de notificaciones próximamente:
                                    </p>
                                    <ul style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: "12px 0 0 0",
                                        fontSize: "14px",
                                        color: "#536471"
                                    }}>
                                        <li>• Notificaciones de likes</li>
                                        <li>• Notificaciones de comentarios</li>
                                        <li>• Notificaciones de seguidores</li>
                                        <li>• Notificaciones push</li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsModal;
