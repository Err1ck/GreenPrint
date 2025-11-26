import LinkIcon from "../ui/LinkIcon";
import SvgComponente from "../ui/Svg";

function Navbar({ navbarSp = false }) {
    return (
        <>
            <nav className="navbarRight">
                <SvgComponente name="icon1" />
                <LinkIcon
                    name={"icon2"}
                    classIcon={"icon2"}
                    href={"#"}
                    anchorClass={"icon2-anchor"}
                    anchorText={"Mi perfil"}
                />
                <LinkIcon
                    name={"icon3"}
                    classIcon={"icon3"}
                    href={"#"}
                    anchorClass={"icon3-anchor"}
                    anchorText={"Tendencia"}
                />
                <LinkIcon
                    name={"icon4"}
                    classIcon={"icon4"}
                    href={"#"}
                    anchorClass={"icon4-anchor"}
                    anchorText={"Comunidad"}
                />
                <LinkIcon
                    name={"icon5"}
                    classIcon={"icon5"}
                    href={"#"}
                    anchorClass={"icon2-anchor"}
                    anchorText={"Cartera"}
                />
            </nav>
            {
                (navbarSp = false && (
                    <nav className="navbarLeft">
                        <LinkIcon anchor={false} />
                        <div>Buscador</div>
                        <div>Tendencias</div>
                        <div>Comunidades</div>
                    </nav>
                ))
            }
            {
                (navbarSp = true && (
                    <nav className="navbarLeft">
                        <div>Buscador</div>
                        <div>Comunidad</div>
                        <div>comunidad</div>
                    </nav>
                ))
            }
        </>
    );
}

export default Navbar;
