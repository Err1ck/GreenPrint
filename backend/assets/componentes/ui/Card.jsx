import React from "react";
import SvgComponente from "./Svg";

/**
 * 
 * @param image  Es la imagen svg que pondremos.
 * @param date Es la fecha que utilizaremos
 * @param title Es el titulo que utilizaremos
 * @param description Es la descripción que se pondra.
 * @param classImage Es la clase que tiene la imagen.
 * @returns 
 */
const Card = ({ image, date, title, description, classImage = "" }) => {
    return (
        <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
            {/* Imagen opcional */}
            {image && <SvgComponente img_class="" img_src="" img_alt="" />}

            {(date || title || description) && (
                <div className="bg-white p-4 sm:p-6">
                    {/* Fecha opcional */}
                    {date && (
                        <time className="block text-xs text-gray-500">
                            {date}
                        </time>
                    )}

                    {/* Título opcional */}
                    {title && (
                        <h3 className="mt-0.5 text-lg text-gray-900">
                            {title}
                        </h3>
                    )}

                    {/* Descripción opcional */}
                    {description && (
                        <p className="mt-2 line-clamp-3 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            )}
        </article>
    );
};

export default Card;
