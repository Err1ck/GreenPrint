import Icono1 from "../../img/perfil.svg";
import Icono2 from "../../img/home.svg";
import Icono3 from "../../img/comunidadesmias.svg";
import Icono4 from "../../img/tendencias.svg";
import Icono5 from "../../img/lupa.svg";
import Icono6 from "../../img/comunidadgeneral.svg";
import Icono7 from "../../img/mas.svg";
import Icono8 from "../../img/comentario.svg";
import Icono9 from "../../img/like1.svg";
import Icono10 from "../../img/like2.svg";
import Icono11 from "../../img/retweet.svg";
import Icono12 from "../../img/cartera.svg";
import Imagen1 from "../../img/logo.jpg";
import Imagen2 from "../../img/avatar-test.jpg";
import Imagen3 from "../../img/logo2.jpg";

const RECURSOS = {
    svg: {
        icon1: Icono1,
        icon2: Icono2,
        icon3: Icono3,
        icon4: Icono4,
        icon5: Icono5,
        icon6: Icono6,
        icon7: Icono7,
        icon8: Icono8,
        icon9: Icono9,
        icon10: Icono10,
        icon11: Icono11,
        icon12: Icono12,
    },
    img: {
        imagen1: Imagen1,
        imagen2: Imagen2,
        imagen3: Imagen3,
    },
};

function SvgComponente({ name }) {
    const SvgAsset = RECURSOS.svg[name];
    const imagePath = RECURSOS.img[name];
    const classNameDef = ` ${name}`.trim();

    if (SvgAsset) {
        if (typeof SvgAsset === "string") {
            return (
                <img
                    src={SvgAsset}
                    role="img"
                    alt={name}
                    className={classNameDef}
                />
            );
        }
        return <SvgAsset role="img" className={classNameDef} />;
    }
    if (imagePath) {
        return <img src={imagePath} alt={name} className={classNameDef} />;
    }
    console.error(`Recurso no encontrado: ${name}`);
    return null;
}

export default SvgComponente;
