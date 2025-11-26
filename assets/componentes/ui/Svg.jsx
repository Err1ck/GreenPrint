import Icono1 from "./img/icon1.svg";
import Icono2 from "./img/icon2.svg";
import Icono3 from "./img/icon3.svg";
import Icono4 from "./img/icon4.svg";
import Icono5 from "./img/icon5.svg";
import Icono6 from "./img/icon6.svg";
import Icono7 from "./img/icon7.svg";
import Icono8 from "./img/icon8.svg";
import Icono9 from "./img/icon9.svg";
import Icono10 from "./img/icon10.svg";

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

function SvgComponente({ name, className }) {
    const SvgIcon = RECURSOS.svg[name];
    if (SvgIcon) {
        return <SvgIcon role="img" className={className} />;
    }
    const imagePath = RECURSOS.img[name];
    if (imagePath) {
        return <img src={imagePath} className={className} />;
    }

    console.error(`Recurso no encontrado: ${name}`);
    return null;
}

export default SvgComponente;
