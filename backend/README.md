# COMANDOS 

## ABRIR

`npm run dev`

`symfony server:start`

(puedes hacer también: `npm run watch`)

(si algo da error, prueba: `symfony server:stop`)


## DATABASES ### ATENCION!!!! ANTES DE TODO ESTO VE A MIGRATIONS Y ELIMINA TODAS LAS VERSIONES `EXCEPTO EL GITIGNORE`


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