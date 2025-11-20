import React from "react";

const Card = ({ image, date, title, description, classImage  = "" }) => {
    return (
        <article className="overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">

            {/* Imagen opcional */}
            {image && (
                <img
                    alt=""
                    src={image}
                    className={`img-default ${classImage}`}
                />
            )}

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
