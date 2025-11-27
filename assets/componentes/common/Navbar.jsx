import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";

function Navbar({ navbarSp = false }) {
    return (
        <>
            <nav className="navbarLeft">
                <SvgComponente name="icon1" />
                <LinkIcon
                    name={"icon2"}
                    href={"#"}
                    classname={"icon2-anchor"}
                    text={"Mi perfil"}
                />
                <LinkIcon
                    name={"icon3"}
                    href={"#"}
                    classname={"icon3-anchor"}
                    text={"Tendencia"}
                />
                <LinkIcon
                    name={"icon4"}
                    href={"#"}
                    classname={"icon4-anchor"}
                    text={"Comunidad"}
                />
                <LinkIcon
                    name={"icon5"}
                    href={"#"}
                    classname={"icon2-anchor"}
                    text={"Cartera"}
                />
            </nav>
            {
                (navbarSp = false && (
                    <nav className="navbarRight">
                        <LinkIcon
                            name={"icon6"}
                            anchor={false}
                            classname={"icono6-nonanchor"}
                            text={"Buscador"}
                        />
                        <LinkIcon
                            name={"icon7"}
                            anchor={false}
                            classname={"icono7-nonanchor"}
                            text={"Tendencias"}
                        />
                        <LinkIcon
                            name={"icon8"}
                            anchor={false}
                            classname={"icono8-nonanchor"}
                            text={"Comunidades"}
                        />
                    </nav>
                ))
            }
            {
                (navbarSp = true && (
                    <nav className="navbarRight2">
                        <LinkIcon
                            name={"icon6"}
                            anchor={false}
                            classname={"icono6-nonanchor"}
                            text={"Buscador"}
                        />
                        <LinkIcon
                            name={"icon7"}
                            anchor={false}
                            classname={"icono7-nonanchor"}
                            text={"Comunidad 1"}
                        />
                        <LinkIcon
                            name={"icon8"}
                            anchor={false}
                            classname={"icono8-nonanchor"}
                            text={"Comunidad 2"}
                        />
                    </nav>
                ))
            }
        </>
    );
}

export default Navbar;
