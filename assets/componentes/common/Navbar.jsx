import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";

function Navbar({ navbarType }) {
    return (
        <>
            {navbarType === 1 && (
                <nav className="navbarLeft">
                    <SvgComponente name="imagen1" />
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
                </nav>
            )}
            {navbarType === 2 && (
                <nav className="navbarRight">
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
                </nav>
            )}
            {navbarType === 3 && (
                <nav className="navbarRight2">
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
                </nav>
            )}
        </>
    );
}

export default Navbar;
