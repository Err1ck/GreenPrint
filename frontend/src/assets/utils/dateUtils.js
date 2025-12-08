// Utilidades para formatear fechas
export const formatDate = (dateString) => {
    if (!dateString) {
        return "";
    }

    try {
        // Manejar diferentes formatos de fecha
        let date;

        // Si es un objeto con la propiedad 'date' (formato de Symfony serializer)
        if (typeof dateString === 'object' && dateString.date) {
            date = new Date(dateString.date);
        }
        // Si es un objeto con la propiedad 'timestamp'
        else if (typeof dateString === 'object' && dateString.timestamp) {
            date = new Date(dateString.timestamp * 1000);
        }
        // Si es un string en formato "YYYY-MM-DD HH:MM:SS" (formato de Symfony)
        else if (typeof dateString === 'string' && dateString.includes(' ')) {
            // Reemplazar espacio con 'T' para hacer compatible con ISO
            const isoString = dateString.replace(' ', 'T');
            date = new Date(isoString);
        }
        // Si es un string ISO o timestamp
        else {
            date = new Date(dateString);
        }

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.error('formatDate: Invalid date:', dateString);
            return "";
        }

        const months = [
            "ene", "feb", "mar", "abr", "may", "jun",
            "jul", "ago", "sep", "oct", "nov", "dic"
        ];

        const result = `${date.getDate()} ${months[date.getMonth()]}`;
        return result;
    } catch (error) {
        console.error('formatDate error:', error, dateString);
        return "";
    }
};

export const formatTime = (dateString) => {
    if (!dateString) {
        return "";
    }

    try {
        // Manejar diferentes formatos de fecha
        let date;

        // Si es un objeto con la propiedad 'date' (formato de Symfony serializer)
        if (typeof dateString === 'object' && dateString.date) {
            date = new Date(dateString.date);
        }
        // Si es un objeto con la propiedad 'timestamp'
        else if (typeof dateString === 'object' && dateString.timestamp) {
            date = new Date(dateString.timestamp * 1000);
        }
        // Si es un string en formato "YYYY-MM-DD HH:MM:SS" (formato de Symfony)
        else if (typeof dateString === 'string' && dateString.includes(' ')) {
            // Reemplazar espacio con 'T' para hacer compatible con ISO
            const isoString = dateString.replace(' ', 'T');
            date = new Date(isoString);
        }
        // Si es un string ISO o timestamp
        else {
            date = new Date(dateString);
        }

        // Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.error('formatTime: Invalid date:', dateString);
            return "";
        }

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const result = `${hours}:${minutes}`;
        return result;
    } catch (error) {
        console.error('formatTime error:', error, dateString);
        return "";
    }
};

export const formatFullDate = (dateString) => {
    if (!dateString) return "";

    try {
        let date;

        if (typeof dateString === 'object' && dateString.date) {
            date = new Date(dateString.date);
        } else if (typeof dateString === 'object' && dateString.timestamp) {
            date = new Date(dateString.timestamp * 1000);
        } else if (typeof dateString === 'string' && dateString.includes(' ')) {
            const isoString = dateString.replace(' ', 'T');
            date = new Date(isoString);
        } else {
            date = new Date(dateString);
        }

        if (isNaN(date.getTime())) {
            console.error('formatFullDate: Invalid date:', dateString);
            return "";
        }

        const months = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
    } catch (error) {
        console.error('formatFullDate error:', error, dateString);
        return "";
    }
};
