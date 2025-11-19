import React from "react";

/**
 * Componente Button
 *
 * @param {React.ReactNode} props.children El contenido a mostrar dentro del boton. Puede ser una cadena de texto, un elemento img o svg
 * @param {function} props.onClick La funcion JavaScript que se ejecutara cuando el usuario haga clic en el boton
 * @param {string} [props.classButton = 'boton-primary'] Clases CSS adicionales para estilizar el boton  ( Opcional )
 */
const Button = ({ children, onClick, classButton = "button-primary" }) => {
    return (
        <button className={`button-default ${classButton}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
