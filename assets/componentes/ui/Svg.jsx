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

/**
 *
 */

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
    },
    img: {
        imagen1: Imagen1,
        imagen2: Imagen2,
    },
};

function SvgComponente({ name }) {
    const SvgIcon = RECURSOS.svg[name];
    const imagePath = RECURSOS.img[name];
    const classNameDef = ` ${name}`.trim();

    if (SvgIcon) {
        return <SvgIcon role="img" className={classNameDef} />;
    }
    if (imagePath) {
        return <img src={imagePath} className={classNameDef} />;
    }

    console.error(`Recurso no encontrado: ${name}`);
    return null;
}

export default SvgComponente;
