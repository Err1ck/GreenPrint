import Icono1 from "../../img/1_perfil.svg";
import Icono2 from "../../img/2_perfil-white.svg";
import Icono3 from "../../img/3_home.svg";
import Icono4 from "../../img/4_home-white.svg";
import Icono5 from "../../img/5_comunidadesmias.svg";
import Icono6 from "../../img/6_comunidadesmias-white.svg";
import Icono7 from "../../img/7_tendencias.svg";
import Icono8 from "../../img/8_tendencias-white.svg";
import Icono9 from "../../img/9_lupa.svg";
import Icono10 from "../../img/10_lupa-white.svg";
import Icono11 from "../../img/11_comunidadgeneral.svg";
import Icono12 from "../../img/12_comunidadgeneral-white.svg";
import Icono13 from "../../img/13_mas.svg";
import Icono14 from "../../img/14_mas-white.svg";
import Icono15 from "../../img/15_comentario.svg";
import Icono16 from "../../img/16_comentario-white.svg";
import Icono17 from "../../img/17_like1.svg";
import Icono18 from "../../img/18_like1-white.svg";
import Icono19 from "../../img/19_like2.svg";
import Icono20 from "../../img/20_like2-white.svg";
import Icono21 from "../../img/21_retweet.svg";
import Icono22 from "../../img/22_retweet-white.svg";
import Icono23 from "../../img/23_cartera.svg";
import Icono24 from "../../img/24_cartera-white.svg";
import Icono25 from "../../img/25_emoji.svg";
import Icono26 from "../../img/26_emoji-white.svg";
import Icono27 from "../../img/27_gif.svg";
import Icono28 from "../../img/28_gif-white.svg";
import Icono29 from "../../img/29_image.svg";
import Icono30 from "../../img/30_image-white.svg";
import Icono31 from "../../img/31_message.svg";
import Icono32 from "../../img/32_message-white.svg";
import Icono33 from "../../img/33_share.svg";
import Icono34 from "../../img/34_share-white.svg";

import Imagen1 from "../../img/logo.jpg";
import Imagen2 from "../../img/avatar-test.jpg";
import Imagen3 from "../../img/logo2.jpg";
import Imagen4 from "../../img/logo3.jpg";

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
        icon13: Icono13,
        icon14: Icono14,
        icon15: Icono15,
        icon16: Icono16,
        icon17: Icono17,
        icon18: Icono18,
        icon19: Icono19,
        icon20: Icono20,
        icon21: Icono21,
        icon22: Icono22,
        icon23: Icono23,
        icon24: Icono24,
        icon25: Icono25,
        icon26: Icono26,
        icon27: Icono27,
        icon28: Icono28,
        icon29: Icono29,
        icon30: Icono30,
        icon31: Icono31,
        icon32: Icono32,
        icon33: Icono33,
        icon34: Icono34,
    },
    img: {
        imagen1: Imagen1,
        imagen2: Imagen2,
        imagen3: Imagen3,
        imagen4: Imagen4,
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
