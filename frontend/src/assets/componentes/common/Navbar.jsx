import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import "../../styles/Navbar.css";
import Footer from "./Footer";
import Button from "../ui/Button";

function Navbar({ navbarType, onOpenModal }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);


  // Obtener el ID del usuario desde localStorage
  useEffect(() => {
    const userStr = localStorage.getItem('user');
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
                <SvgComponente name="imagen1" />
              </div>
              <div className="navbar-links">
                <div className="navbar-links-right">
                  <LinkIcon
                    name={"icon3"}
                    href={"/"}
                    classname={"navicon"}
                    text={"Inicio"}
                  />
                  <LinkIcon
                    name={"icon31"}
                    href={"/communities"}
                    classname={"navicon"}
                    text={"Mensajes"}
                  />
                  <LinkIcon
                    name={"icon41"}
                    href={"/guardados"}
                    classname={"navicon"}
                    text={"Guardados"}
                  />
                  <LinkIcon
                    name={"icon5"}
                    href={"/communities"}
                    classname={"navicon"}
                    text={"Comunidades"}
                  />
                  <LinkIcon
                    name={"icon1"}
                    href={userId ? `/profile/${userId}` : "/perfil"}
                    classname={"navicon"}
                    text={"Perfil"}
                  />
                  <LinkIcon
                    name={"icon39"}
                    href={"/opciones"}
                    classname={"navicon"}
                    text={"Opciones"}
                  />
                </div>
              </div>
            </div>
          </div>
          <Footer footerType={1} />
        </nav>
      )}

      {navbarType === 2 && (
        <nav className="navbarRight">
          <div className="navbarRight-container">
            <div className="navbarRight-container-section">
              <div className="section-buscador">
                <LinkIcon
                  name={"icon9"}
                  anchor={false}
                  classname={"navicon"}
                  onSearch={handleSearch}
                  text={"Buscador"}
                />
              </div>
              <div className="seccion-trend">
                <LinkIcon
                  name={"icon7"}
                  anchor={false}
                  href={"/tendencias"}
                  classname={"navicon"}
                  text={"Tendencias"}
                />
                <LinkIcon
                  name={"icon11"}
                  anchor={false}
                  href={"/communities"}
                  classname={"navicon"}
                  text={"Comunidades"}
                />
              </div>
            </div>

            <div className="navbarRight-container-footer">
              <Footer footerType={2} />
              <Button
                onClick={onOpenModal}
                classButton="button-navbar-open-modal"
              >
                <div className="button-text">Nuevo Post</div>
              </Button>
            </div>
          </div>
        </nav>
      )}

      {navbarType === 3 && (
        <nav className="navbarRight2">
          <div className="navbarRight2-container">
            <LinkIcon
              name={"icon"}
              anchor={false}
              classname={"navicon"}
              text={"Buscador"}
            />
            <LinkIcon
              name={"icon4"}
              anchor={false}
              classname={"navicon"}
              text={"Tendencias"}
            />
            <LinkIcon
              name={"icon6"}
              anchor={false}
              classname={"navicon"}
              text={"Comunidades"}
            />
            <Footer footerType={2} />
          </div>
        </nav>
      )}
    </>
  );
}

export default Navbar;
