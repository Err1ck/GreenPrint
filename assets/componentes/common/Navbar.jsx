import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import "../../styles/Navbar.css";
import Footer from "./Footer";
import Button from "../ui/Button";

function Navbar({ navbarType, onOpenModal }) {
    // 🔹 Lógica de búsqueda cuando se pulsa Enter en el buscador
    const handleSearch = (textoBuscado) => {
        // De momento, solo mostramos en consola:
        console.log("Buscando:", textoBuscado);

        // Más adelante aquí puedes:
        // - filtrar posts
        // - navegar a otra ruta
        // - llamar a una API, etc.
    };

    return (
        <>
            {navbarType === 1 && (
                <nav className="navbarLeft">
                    <div className="navbarLeft-container">
                        <div className="navbarLeft-subcontainer">
                            <div className="navbarImg">
                                <SvgComponente name="imagen4" />
                            </div>
                            <LinkIcon
                                name={"icon1"}
                                href={"#"}
                                classname={"navicon"}
                                text={"Mi perfil"}
                            />
                            <LinkIcon
                                name={"icon7"}
                                href={"/tendencias"}
                                classname={"navicon"}
                                text={"Tendencia"}
                            />
                            <LinkIcon
                                name={"icon5"}
                                href={"/comunidades"}
                                classname={"navicon"}
                                text={"Comunidad1"}
                            />
                        </div>
                    </div>
                    <Footer footerType={1} />
                </nav>
            )}

            {navbarType === 2 && (
                <nav className="navbarRight">
                    <div className="navbarRight-container">
                        {/* 🔍 AQUÍ transformamos Buscador en input */}
                        <LinkIcon
                            name={"icon9"}
                            anchor={false} // activa modo "no enlace"
                            classname={"navicon"} // misma clase para no romper diseño
                            onSearch={handleSearch} // ⬅️ NUEVO: lógica al pulsar Enter
                            text={"Buscador"} // este texto ya no se usa en modo buscador, pero no molesta
                        />

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
                            href={"/comunidades"}
                            classname={"navicon"}
                            text={"Comunidades"}
                        />

                        <Footer footerType={2} />

                        <Button
                            onClick={onOpenModal}
                            classButton="button-navbar-open-modal"
                        >
                            <div className="button-text">Nuevo Post</div>
                            <LinkIcon name={"icon13"} />
                        </Button>
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
