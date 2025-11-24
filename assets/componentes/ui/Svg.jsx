/**
 *
 * @param img_class Clase del svg o imagen.
 * @param img_src Pathing del svg o imagen.
 * @param img_alt Descripcion del svg o imagen.
 * @returns
 */

function SvgComponente(img_class, img_src, img_alt) {
    return <img className={img_class} src={img_src} alt={img_alt} />;
}

export default SvgComponente;
