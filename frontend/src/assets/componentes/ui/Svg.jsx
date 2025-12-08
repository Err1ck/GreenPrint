import { IMAGENES } from "../../data/imagenes";

function SvgComponente({ name }) {
  const SvgAsset = IMAGENES.svg[name];
  const imagePath = IMAGENES.img[name];
  const classNameDef = ` ${name}`.trim();

  if (SvgAsset) {
    if (typeof SvgAsset === "string") {
      return (
        <img src={SvgAsset} role="img" alt={name} className={classNameDef} />
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
