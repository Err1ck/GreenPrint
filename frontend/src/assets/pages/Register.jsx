import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
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
                    backgroundColor: "#1da1f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                }}
            >
                <svg version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512" xml:space="preserve">

                    <g>
                        <path class="st0" d="M422.969,193.281c2.313-7.922,3.594-16.313,3.594-24.969c0-42.469-29.375-78.063-68.875-87.844
		C346.813,34.406,305.438,0,256,0s-90.813,34.406-101.75,80.469c-39.438,9.781-68.813,45.375-68.813,87.844
		c0,8.656,1.281,17.047,3.594,24.969C64.313,212.469,48.406,242.313,48.406,276c0,57.75,46.781,104.563,104.563,104.563
		c14.625,0,28.563-2.969,41.188-8.406c1.922,1.594,3.844,3.125,5.844,4.563V512h112V376.641c2-1.438,3.922-2.891,5.75-4.484
		c12.719,5.438,26.656,8.406,41.281,8.406c57.781,0,104.563-46.813,104.563-104.563
		C463.594,242.313,447.688,212.469,422.969,193.281z M280,480h-48v-88.156c7.688,2,15.688,3.031,24,3.031s16.313-1.031,24-3.031V480
		z M359.031,348.563c-9.906,0-19.5-1.922-28.625-5.844l-18.156-7.844l-0.25,0.25l-14.875,12.625
		c-5.203,4.328-10.969,7.844-17.125,10.328c-7.594,3.125-15.688,4.797-24,4.797s-16.406-1.672-24-4.797
		c-6.156-2.484-11.922-6-17.125-10.328L200,335.125l-0.25-0.25l-18.156,7.844c-9.125,3.922-18.719,5.844-28.625,5.844
		c-40,0-72.563-32.563-72.563-72.563c0-22.563,10.234-43.438,28.234-57.359l17.109-13.281l-6-20.891
		c-1.5-5.438-2.313-10.875-2.313-16.156c0-26.953,18.313-50.313,44.484-56.719l18.953-4.719l4.563-19.031
		C193.188,54.969,222.25,32,256,32s62.813,22.969,70.563,55.844l4.469,19.031l19.047,4.719
		c26.172,6.406,44.484,29.766,44.484,56.719c0,5.281-0.813,10.719-2.313,16.156l-6,20.891l17.109,13.281
		c18,13.922,28.234,34.797,28.234,57.359C431.594,316,399.031,348.563,359.031,348.563z"/>
                    </g>
                </svg>
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