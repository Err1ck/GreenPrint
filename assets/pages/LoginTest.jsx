import { useState } from "react";
// import { Twitter } from "lucide-react";
import "../styles/login.css";

function TestLoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-left">
                    {/* <Twitter
                        className="login-logo-large"
                        size={300}
                        strokeWidth={1.5}
                    /> */}
                </div>

                <div className="login-right">
                    <div className="login-box">
                        {/* <Twitter
                            className="login-logo-small"
                            size={40}
                            strokeWidth={2}
                        /> */}

                        <h1 className="login-title">
                            {isLogin ? "Inicia sesión" : "Únete hoy"}
                        </h1>

                        <form onSubmit={handleSubmit} className="login-form">
                            {!isLogin && (
                                <div className="input-group">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nombre"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="login-input"
                                        required
                                    />
                                </div>
                            )}

                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="login-input"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="login-input"
                                    required
                                />
                            </div>

                            <button type="submit" className="login-button">
                                {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                            </button>
                        </form>

                        {isLogin && (
                            <a href="#" className="forgot-password">
                                ¿Olvidaste tu contraseña?
                            </a>
                        )}

                        <div className="login-divider">
                            <span>o</span>
                        </div>

                        <div className="login-footer">
                            <span className="footer-text">
                                {isLogin
                                    ? "¿No tienes una cuenta?"
                                    : "¿Ya tienes una cuenta?"}
                            </span>
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="toggle-button"
                            >
                                {isLogin ? "Regístrate" : "Inicia sesión"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestLoginPage;
