import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";
import "../../styles/Navbar.css"
function Navbar({ navbarType }) {
    return (
        <>
            {navbarType === 1 && (
                <nav className="navbarLeft">
                    <div className="navbarLeft-container">
                        <div className="navbarImg">
                            <SvgComponente name="imagen1" />
                        </div>
                        <LinkIcon
                            name={"icon1"}
                            href={"#"}
                            classname={"navicon"}
                            text={"Mi perfil"}
                        />
                        <LinkIcon
                            name={"icon4"}
                            href={"#"}
                            classname={"navicon"}
                            text={"Tendencia"}
                        />
                        <LinkIcon
                            name={"icon3"}
                            href={"#"}
                            classname={"navicon"}
                            text={"Comunidad"}
                        />
                    </div>
                </nav>
            )}
            {navbarType === 2 && (
                <nav className="navbarRight">
                    <div className="navbarRight-container">
                        <LinkIcon
                            name={"icon5"}
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
                    </div>
                </nav>
            )}
        </>
    );
}

export default Navbar;
