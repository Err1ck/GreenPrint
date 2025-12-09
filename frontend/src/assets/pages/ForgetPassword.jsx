import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/forgetPassword.css";
import SvgComponente from "../componentes/ui/Svg";


function ForgetPassword() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Solo visual, sin lógica ni llamadas a APIs
  };

  return (
    <div className="forgot-container">
      <div className="forgot-left-panel"></div>

      <div className="forgot-right-panel">
        <div className="forgot-form-wrapper">
          <SvgComponente name="imagen3" />

          <h1 className="forgot-title">¿Olvidaste tu contraseña?</h1>
          <p className="forgot-subtitle">
            Introduce tu correo electrónico y te enviaremos instrucciones para
            restablecerla.
          </p>

          <form onSubmit={handleSubmit} className="forgot-form">
            <div>
              <input
                type="email"
                placeholder="Email"
                required
                className="forgot-input"
              />
            </div>

            <button type="submit" className="forgot-submit-btn">
              Enviar instrucciones
            </button>
          </form>

          <div className="forgot-separator">
            <p className="forgot-login-text">¿Ya recuerdas tu contraseña?</p>
            <button
              onClick={() => navigate("/login")}
              className="forgot-login-btn"
            >
              Volver a iniciar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
