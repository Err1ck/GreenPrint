import { useState, useEffect } from "react";
import { LogIn, LogOut } from "lucide-react";
import defaultAvatar from "../../img/user.png";

function Footer({ footerType }) {
  const [username, setUsername] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Obtener usuario de localStorage
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (userStr && token) {
      const user = JSON.parse(userStr);
      setUsername(user.username);
      setUserPhoto(user.photo_url);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("No se encontró token");
        return;
      }

      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Limpiar localStorage independientemente de la respuesta
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirigir al login o página principal
      window.location.href = '/login';

    } catch (error) {
      console.error("Error al hacer logout:", error);
      // Limpiar localStorage incluso si hay error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const handleFooterClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      handleLoginRedirect();
    }
  };

  return (
    <>
      {footerType === 1 && (
        <div className="footer1">
          <div
            className="footer1-container"
            style={{
              gap: '12px',
              cursor: 'pointer',
              justifyContent: isLoggedIn ? 'flex-start' : 'center'
            }}
            onClick={handleFooterClick}
          >
            {isLoggedIn ? (
              <>
                <img
                  src={userPhoto ? `http://127.0.0.1:8000${userPhoto}` : defaultAvatar}
                  alt={username}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <span style={{ color: "var(--color-text-primary)" }} className="info-username">{username}</span>
                <LogOut
                  size={20}
                  color="var(--color-text-primary)"
                  style={{ marginLeft: 'auto' }}
                />
              </>
            ) : (
              <>
                <LogIn
                  size={24}
                  color="#10b981"
                />
                <span
                  className="info-username"
                  style={{
                    color: '#10b981',
                    fontWeight: '600'
                  }}
                >
                  Iniciar sesión
                </span>
              </>
            )}
          </div>
        </div>
      )}
      {footerType === 2 && (
        <div className="footer2">
          <div>©2025 GreenPrint.co,</div>
          <div>Todos los derechos reservados</div>
        </div>
      )}
    </>
  );
}

export default Footer;