# TUTORIAL

`npm run dev`

`symfony server:start`

(puedes hacer también: `npm run watch`)

(si algo da error, prueba: `symfony server:stop`)

## COMO CREAR PÁGINAS

1. Para crear páginas, dirígete a /assets/pages, ahí puedes crear el componente de la página principal. Vamos a usar de ejemplo la página Test.jsx.

Para crear componentes reutilizables, dirígete a assets/components.

2. Luego, vamos a /assets y creamos un archivo .js con el nombre de la página. En este caso, test.js. Copia y pega un archivo ya hecho y modifica el nombre y el import de tu pagina

Básicamente, se crea un div con clase "root" el cual añadimos la página en su método render.

3. Vamos a la raíz del proyecto y nos abrimos webpack.config.js y añadimos el archivo .js que hemos creado:

 `.addEntry('nombre del archivo (sin extensíon js)', 'ruta del archivo')`

Ejemplo:

`.addEntry('test', './assets/test.js')`

4. Ahora creamos la plantilla twig, el cual se va a poner todo el js. Nos dirigimos a la carpeta templates y creamos test.html.twig (puedes crear una carpeta test y poner la plantilla dentro si lo ves necesario). Copia y pega la plantilla de una pagina ya hecha y modifica esto:

`encore_entry_link_tags('test')`

   ` encore_entry_script_tags('test') `
   
    



Sustituye 'test' por lo que hayas puesto como primer parámetro en `.addEntry` en el paso anterior.

5. Finalmente creamos el controlador:
   
`
     #[Route('/test', name: 'app_test')] // Cambia la ruta, su name y el nombre de la func
    public function test(): Response
    {
        return $this->render('test/test.html.twig'); // Aquí pones la ruta de la plantilla
    }
`


## DATABASES
### ATENCION!!!! ANTES DE TODO ESTO VE A MIGRATIONS Y `ELIMINA TODAS EXCEPTO EL GITIGNORE`

1. Eliminar la base de datos
`php bin/console doctrine:database:drop --force`

2. Crearla de nuevo
`php bin/console doctrine:database:create`

3. Crear la nueva version de la migracion
`php bin/console make:migration`

4.  Ejecutar migraciones
`php bin/console doctrine:migrations:migrate`

1. Ejecutar fixtures (datos falsos)
`php bin/console doctrine:fixtures:load`