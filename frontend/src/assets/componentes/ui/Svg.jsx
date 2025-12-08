import { useEffect, useState } from "react";
import { IMAGENES } from "../../data/imagenes";

function SvgComponente({ name }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Detectar el tema inicial
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Observer para detectar cambios en el tema
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const SvgAsset = IMAGENES.svg[name];
  const imagePath = IMAGENES.img[name];
  const classNameDef = `${name}`.trim();

  // Si es un SVG con versiones light/dark
  if (
    SvgAsset &&
    typeof SvgAsset === "object" &&
    (SvgAsset.light || SvgAsset.dark)
  ) {
    const selectedSvg = isDarkMode ? SvgAsset.dark : SvgAsset.light;
    return (
      <img src={selectedSvg} role="img" alt={name} className={classNameDef} />
    );
  }

  // Si es un SVG simple (sin versiones)
  if (SvgAsset) {
    return (
      <img src={SvgAsset} role="img" alt={name} className={classNameDef} />
    );
  }

  // Si es una imagen normal
  if (imagePath) {
    return <img src={imagePath} alt={name} className={classNameDef} />;
  }

  console.error(`Recurso no encontrado: ${name}`);
  return null;
}

export default SvgComponente;
