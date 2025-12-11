import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import "../../styles/Navbar.css";
import Footer from "./Footer";
import Button from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";
import SettingsModal from "./SettingsModal";
import TrendingTopics from "./TrendingTopics";

function Navbar({ navbarType, navbarPage, onOpenModal }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Obtener el ID del usuario desde localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user.id);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  // 🔹 Lógica de búsqueda cuando se pulsa Enter en el buscador
  const handleSearch = (textoBuscado) => {
    // Navegar a la página de búsqueda
    navigate("/search");
  };

  return (
    <>
      {navbarType === 1 && (
        <nav className="navbarLeft">
          <div className="navbarLeft-container">
            <div className="navbarLeft-subcontainer">
              <div className="navbarImg">
                <div 
                  className="navbarImg-container" 
                  onClick={() => navigate("/")}
                  style={{ cursor: "pointer" }}
                >
                  <SvgComponente name="imagen3" />
                </div>
              </div>
              <div className="navbar-links">
                {navbarPage === "home" && (
                  <div className="navbar-links-right">
                    <LinkIcon
                      classLink={"navbar-home"}
                      name={"home"}
                      href={"/"}
                      classname={"navicon"}
                      text={"Inicio"}
                    />
                    <LinkIcon
                      name={"message"}
                      href={"/messages"}
                      classname={"navicon"}
                      text={"Mensajes"}
                    />
                    <LinkIcon
                      name={"save"}
                      href={"/saved"}
                      classname={"navicon"}
                      text={"Guardados"}
                    />
                    <LinkIcon
                      name={"comunidadesMias"}
                      href={"/communities"}
                      classname={"navicon"}
                      text={"Comunidades"}
                    />
                    <LinkIcon
                      name={"perfil"}
                      href={userId ? `/profile/${userId}` : "/perfil"}
                      classname={"navicon"}
                      text={"Perfil"}
                    />
                    <div
                      onClick={() => setIsSettingsModalOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <LinkIcon
                        name={"dots"}
                        anchor={false}
                        classname={"navicon"}
                        text={"Configuración"}
                      />
                    </div>
                  </div>
                )}
                {navbarPage === "messages" && (
                  <div className="navbar-links-right">
                    <LinkIcon
                      name={"home"}
                      href={"/"}
                      classname={"navicon"}
                      text={"Inicio"}
                    />
                    <LinkIcon
                      classLink={"navbar-messages"}
                      name={"message"}
                      href={"/messages"}
                      classname={"navicon"}
                      text={"Mensajes"}
                    />
                    <LinkIcon
                      name={"save"}
                      href={"/saved"}
                      classname={"navicon"}
                      text={"Guardados"}
                    />
                    <LinkIcon
                      name={"comunidadesMias"}
                      href={"/communities"}
                      classname={"navicon"}
                      text={"Comunidades"}
                    />
                    <LinkIcon
                      name={"perfil"}
                      href={userId ? `/profile/${userId}` : "/perfil"}
                      classname={"navicon"}
                      text={"Perfil"}
                    />
                    <div
                      onClick={() => setIsSettingsModalOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <LinkIcon
                        name={"dots"}
                        anchor={false}
                        classname={"navicon"}
                        text={"Configuración"}
                      />
                    </div>
                  </div>
                )}
                {navbarPage === "saved" && (
                  <div className="navbar-links-right">
                    <LinkIcon
                      name={"home"}
                      href={"/"}
                      classname={"navicon"}
                      text={"Inicio"}
                    />
                    <LinkIcon
                      name={"message"}
                      href={"/messages"}
                      classname={"navicon"}
                      text={"Mensajes"}
                    />
                    <LinkIcon
                      classLink={"navbar-saved"}
                      name={"save"}
                      href={"/saved"}
                      classname={"navicon"}
                      text={"Guardados"}
                    />
                    <LinkIcon
                      name={"comunidadesMias"}
                      href={"/communities"}
                      classname={"navicon"}
                      text={"Comunidades"}
                    />
                    <LinkIcon
                      name={"perfil"}
                      href={userId ? `/profile/${userId}` : "/perfil"}
                      classname={"navicon"}
                      text={"Perfil"}
                    />
                    <div
                      onClick={() => setIsSettingsModalOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <LinkIcon
                        name={"dots"}
                        anchor={false}
                        classname={"navicon"}
                        text={"Configuración"}
                      />
                    </div>
                  </div>
                )}
                {navbarPage === "community" && (
                  <div className="navbar-links-right">
                    <LinkIcon
                      name={"home"}
                      href={"/"}
                      classname={"navicon"}
                      text={"Inicio"}
                    />
                    <LinkIcon
                      name={"message"}
                      href={"/messages"}
                      classname={"navicon"}
                      text={"Mensajes"}
                    />
                    <LinkIcon
                      name={"save"}
                      href={"/saved"}
                      classname={"navicon"}
                      text={"Guardados"}
                    />
                    <LinkIcon
                      classLink={"navbar-community"}
                      name={"comunidadesMias"}
                      href={"/communities"}
                      classname={"navicon"}
                      text={"Comunidades"}
                    />
                    <LinkIcon
                      name={"perfil"}
                      href={userId ? `/profile/${userId}` : "/perfil"}
                      classname={"navicon"}
                      text={"Perfil"}
                    />
                    <div
                      onClick={() => setIsSettingsModalOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <LinkIcon
                        name={"dots"}
                        anchor={false}
                        classname={"navicon"}
                        text={"Configuración"}
                      />
                    </div>
                  </div>
                )}
                {navbarPage === "profile" && (
                  <div className="navbar-links-right">
                    <LinkIcon
                      name={"home"}
                      href={"/"}
                      classname={"navicon"}
                      text={"Inicio"}
                    />
                    <LinkIcon
                      name={"message"}
                      href={"/messages"}
                      classname={"navicon"}
                      text={"Mensajes"}
                    />
                    <LinkIcon
                      name={"save"}
                      href={"/saved"}
                      classname={"navicon"}
                      text={"Guardados"}
                    />
                    <LinkIcon
                      name={"comunidadesMias"}
                      href={"/communities"}
                      classname={"navicon"}
                      text={"Comunidades"}
                    />
                    <LinkIcon
                      classLink={"navbar-profile"}
                      name={"perfil"}
                      href={userId ? `/profile/${userId}` : "/perfil"}
                      classname={"navicon"}
                      text={"Perfil"}
                    />
                    <div
                      onClick={() => setIsSettingsModalOpen(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <LinkIcon
                        name={"dots"}
                        anchor={false}
                        classname={"navicon"}
                        text={"Configuración"}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <Footer footerType={1} />

          {/* Settings Modal */}
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
          />
        </nav>
      )}

      {navbarType === 2 && (
        <nav className="navbarRight">
          <div className="navbarRight-container">
            <div className="navbarRight-container-section">
              <div className="section-buscador">
                <LinkIcon
                  name={"lupa"}
                  anchor={false}
                  classname={"navicon"}
                  onSearch={handleSearch}
                  text={"Buscador"}
                />
              </div>

              {/* Trending Topics */}
              <TrendingTopics />

              {/* <div className="seccion-trend">
                <LinkIcon
                  name={"tendencias"}
                  anchor={false}
                  href={"/tendencias"}
                  classname={"navicon"}
                  text={"Tendencias"}
                />
              </div> */}
            </div>

            <div className="navbarRight-container-footer">
              <Footer footerType={2} />
              {onOpenModal && (
                <Button
                  onClick={onOpenModal}
                  classButton="button-navbar-open-modal"
                >
                  <div className="button-text">Nuevo Post</div>
                </Button>
              )}
            </div>
          </div>
        </nav>
      )}

      {navbarType === 3 && (
        <nav className="navbarRight2">
          <div className="navbarRight2-container">
            <Footer footerType={2} />
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
