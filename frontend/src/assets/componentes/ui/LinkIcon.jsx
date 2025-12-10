import React from "react";
import SvgComponente from "./Svg";

/**
 * LinkIcon:
 * - Modo normal: icono + texto (enlace o div)
 * - Modo buscador: name="icon5" y anchor=false ⇒ icono + input
 */
const LinkIcon = ({
    name,
    anchor = true,
    href = "#",
    classname,
    text,
    onSearch, // función opcional, se usa solo en modo buscador
}) => {
    // ⭐ MODO BUSCADOR: lupa + anchor=false
    if (name === "lupa" && anchor === false) {
        const handleClick = () => {
            if (typeof onSearch === "function") {
                onSearch(""); // navegar a la página de búsqueda
            }
        };

        return (
            <div className="link-icon" onClick={handleClick} style={{ cursor: 'pointer' }}>
                <SvgComponente name={name} />
                <div className="search-button-text">{text || "Buscar"}</div>
            </div>
        );
    }

    // ⭐ Caso especial: solo imagen clicable (sin texto)
    if (anchor && (!text || text.trim() === "")) {
        return (
            <a className="link-icon" href={href}>
                <SvgComponente name={name} />
            </a>
        );
    }

    // ⭐ Caso normal: icono + texto (enlace o div)
    return (
        <div className="link-icon">
            <SvgComponente name={name} />
            {anchor ? (
                <a className={classname} href={href}>
                    {text}
                </a>
            ) : (
                <div className={classname}>{text}</div>
            )}
        </div>
    );
};

export default LinkIcon;
