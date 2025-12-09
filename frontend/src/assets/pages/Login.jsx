import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import SvgComponente from "../componentes/ui/Svg";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login", {
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
        throw new Error(data.message || "Error al iniciar sesión");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel"></div>

      <div className="login-right-panel">
        <div className="login-form-wrapper">
          <SvgComponente name="imagen3" />

          <h1 className="login-title">Iniciar sesión en GreenPrint</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="login-submit-btn"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <a href="/forgot-password" className="login-forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </form>

          <div className="login-separator">
            <p className="login-signup-text">¿No tienes una cuenta?</p>
            <button
              onClick={() => navigate("/register")}
              className="login-signup-btn"
            >
              Crear cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
