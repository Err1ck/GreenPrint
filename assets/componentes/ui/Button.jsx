import React from "react";

/**
 * @estiloClase {string} Asigna la clase del boton
 * @onClick {function} Asigna la funcion del onClick
 * @texto {string} Asigna el texto del boton
 */
const BotonReutilizable = ({
    texto,
    onClick,
    estiloClase = "boton-primario",
}) => {
    return (
        <button
            className={`boton-base ${estiloClase}`} // Combina una clase base con la personalizada
            onClick={onClick} // Asigna la función 'onClick' recibida por props
        >
            {texto}
        </button>
    );
};

export default BotonReutilizable;
