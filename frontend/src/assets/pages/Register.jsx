import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        // Validar longitud mínima de contraseña
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

            // Registro exitoso, redirigir al login
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "#000",
            }}
        >
            {/* Lado izquierdo - Imagen con logo de X */}
            <div
                style={{
                    flex: 1,
                    backgroundImage: "url('/src/assets/img/tree-wallpaper.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >

            </div>

            {/* Lado derecho - Formulario */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px",
                    backgroundColor: "#000",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "380px",
                    }}
                >


                    {/* Título */}
                    <h1
                        style={{
                            fontSize: "31px",
                            fontWeight: "700",
                            color: "#e7e9ea",
                            marginBottom: "32px",
                            fontFamily:
                                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        }}
                    >
                        Crear tu cuenta
                    </h1>

                    {/* Formulario */}
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                        }}
                    >
                        {/* Campo Email */}
                        <div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "17px",
                                    backgroundColor: "#000",
                                    color: "#e7e9ea",
                                    border: "1px solid #333639",
                                    borderRadius: "4px",
                                    outline: "none",
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#1d9bf0";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#333639";
                                }}
                            />
                        </div>


                        <div>
                            <input
                                type="text"
                                placeholder="Nombre de usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "17px",
                                    backgroundColor: "#000",
                                    color: "#e7e9ea",
                                    border: "1px solid #333639",
                                    borderRadius: "4px",
                                    outline: "none",
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#1d9bf0";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#333639";
                                }}
                            />
                        </div>

                        {/* Campo Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "17px",
                                    backgroundColor: "#000",
                                    color: "#e7e9ea",
                                    border: "1px solid #333639",
                                    borderRadius: "4px",
                                    outline: "none",
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#1d9bf0";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#333639";
                                }}
                            />
                        </div>

                        {/* Campo Confirmar Password */}
                        <div>
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "17px",
                                    backgroundColor: "#000",
                                    color: "#e7e9ea",
                                    border: "1px solid #333639",
                                    borderRadius: "4px",
                                    outline: "none",
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#1d9bf0";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#333639";
                                }}
                            />
                        </div>

                        {/* Mensaje de error */}
                        {error && (
                            <div
                                style={{
                                    color: "#f4212e",
                                    fontSize: "13px",
                                    fontFamily:
                                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {/* Botón Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                fontWeight: "700",
                                backgroundColor: "#eff3f4",
                                color: "#0f1419",
                                border: "none",
                                borderRadius: "9999px",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.5 : 1,
                                fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                if (!loading) e.target.style.backgroundColor = "#d7dbdc";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#eff3f4";
                            }}
                        >
                            {loading ? "Creando cuenta..." : "Crear cuenta"}
                        </button>
                    </form>

                    {/* Separador */}
                    <div
                        style={{
                            marginTop: "40px",
                            paddingTop: "20px",
                        }}
                    >
                        <p
                            style={{
                                color: "#71767b",
                                fontSize: "15px",
                                marginBottom: "20px",
                                fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                            }}
                        >
                            ¿Ya tienes una cuenta?
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            style={{
                                width: "100%",
                                padding: "12px",
                                fontSize: "15px",
                                fontWeight: "700",
                                backgroundColor: "transparent",
                                color: "#1d9bf0",
                                border: "1px solid #536471",
                                borderRadius: "9999px",
                                cursor: "pointer",
                                fontFamily:
                                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                                transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "rgba(29, 155, 240, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                            }}
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