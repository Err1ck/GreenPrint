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
    // ⭐ MODO BUSCADOR: icon5 + anchor=false
    if (name === "icon5" && anchor === false) {
        const handleKeyDown = (e) => {
            if (e.key === "Enter" && typeof onSearch === "function") {
                onSearch(e.target.value); // mandamos el texto al padre (Navbar)
            }
        };

        return (
            <div className="link-icon">
                <SvgComponente name={name} />
                <input
                    type="text"
                    className="input-buscador"
                    placeholder={text || "Buscar..."}
                    onKeyDown={handleKeyDown}
                />
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
