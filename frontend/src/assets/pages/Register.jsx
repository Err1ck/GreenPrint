import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";
import SvgComponente from "../componentes/ui/Svg";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al registrarse");
            }

            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-left-panel"></div>

            <div className="register-right-panel">
                <div className="register-form-wrapper">
                    <SvgComponente name="imagen3" />

                    <h1 className="register-title">Crear tu cuenta en GreenPrint</h1>

                    <form onSubmit={handleSubmit} className="register-form">
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="register-input"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="register-input"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="register-input"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="register-input"
                            />
                        </div>

                        {error && <div className="register-error">{error}</div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="register-submit-btn"
                        >
                            {loading ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>

                    <div className="register-separator">
                        <p className="register-signin-text">¿Ya tienes una cuenta?</p>
                        <button
                            onClick={() => navigate("/login")}
                            className="register-signin-btn"
                        >
                            Iniciar sesión
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
