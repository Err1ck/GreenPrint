const Checkbox = ({ label, checked, onChange, id, name, disabled = false }) => {
    // Generamos un ID si no se proporciona para asegurar la accesibilidad
    const inputId =
        id || `checkbox-${name || Math.random().toString(36).substring(2, 9)}`;

    return (
        <div className="checkbox-container">
            <input
                type="checkbox"
                id={inputId}
                name={name}
                checked={checked} // El estado actual viene del padre
                onChange={onChange} // La función de cambio notifica al padre
                disabled={disabled}
                {...otrasProps} // Esparce cualquier otra prop nativa
            />
            {/* La etiqueta (label) está vinculada al input usando el 'htmlFor' y el 'id' para la accesibilidad */}
            <label
                htmlFor={inputId}
                className={disabled ? "disabled-label" : ""}
            >
                {label}
            </label>
        </div>
    );
};

export default Checkbox;
