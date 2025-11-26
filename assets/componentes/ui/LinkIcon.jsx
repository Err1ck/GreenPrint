import react from "react";
import SvgComponente from "./Svg";

/**
 *
 * @param  href URL a la que navegará el usuario cuando haga clic en el texto del enlace.
 * @param imageClass Clase CSS que se pasará al componente SvgComponente para estilizar la imagen/vector.
 * @param classicon Clase CSS utilizada para estilizar el elemento <a> que actúa como enlace.
 * @param atext Texto o contenido que se mostrará dentro del enlace <a>.
 * @returns
 */
const LinkIcon = ({
    name,
    classIcon = "LinkIconDefault",
    href = "#",
    anchorClass,
    anchorText,
}) => {
    return (
        <div className="link-icon">
            <SvgComponente name={name} className={classIcon} />

            <a href={href} className={anchorClass}>
                {anchorText}
            </a>
        </div>
    );
};
export default LinkIcon;
