import react from "react";
import SvgComponente from "./Svg";

/**
 * 
 * @param  param0 
 * @returns 
 */
const NavLinkIcon = ({ href = "#", imageClass, classIcon = "NavLinkIconDefault", aText }) => {
    return (
        <article className="nav-link-icon">
            <SvgComponente img_class={imageClass} />

            <a href={href} className={classIcon}>
                {aText}
            </a>

        </article>
    )
}
export default NavLinkIcon