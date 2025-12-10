<?php

namespace App\Service;

use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;

class FileUploadService
{
    private const MAX_FILE_SIZE = 5242880; // 5MB en bytes
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp'
    ];

    public function __construct(
        private string $uploadsDirectory,
        private SluggerInterface $slugger
    ) {
    }

    /**
     * Sube un archivo de imagen y retorna la ruta relativa
     * 
     * @param UploadedFile $file El archivo subido
     * @param string $subdirectory Subdirectorio dentro de uploads (ej: 'posts', 'avatars')
     * @return string La ruta relativa del archivo guardado
     * @throws \Exception Si hay algún error en la validación o subida
     */
    public function upload(UploadedFile $file, string $subdirectory = 'posts'): string
    {
        // Validar tamaño del archivo
        if ($file->getSize() > self::MAX_FILE_SIZE) {
            throw new \Exception('El archivo es demasiado grande. Tamaño máximo: 5MB');
        }

        // Validar tipo MIME usando el tipo del cliente (no requiere fileinfo)
        $mimeType = $file->getClientMimeType();
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES)) {
            // Validación adicional por extensión como fallback
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

            if (!in_array($extension, $allowedExtensions)) {
                throw new \Exception('Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, GIF, WebP)');
            }
        }

        // Obtener el nombre original y crear un nombre seguro
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);

        // Obtener extensión del archivo original
        $extension = $file->getClientOriginalExtension();
        if (empty($extension)) {
            // Si no hay extensión, usar una basada en el MIME type
            $extension = match ($mimeType) {
                'image/jpeg' => 'jpg',
                'image/png' => 'png',
                'image/gif' => 'gif',
                'image/webp' => 'webp',
                default => 'jpg'
            };
        }

        // Generar nombre único con timestamp
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $extension;

        // Crear el directorio si no existe
        $targetDirectory = $this->uploadsDirectory . '/' . $subdirectory;
        if (!is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0755, true);
        }

        // Mover el archivo al directorio de destino
        try {
            $file->move($targetDirectory, $newFilename);
        } catch (FileException $e) {
            throw new \Exception('Error al subir el archivo: ' . $e->getMessage());
        }

        // Retornar la ruta relativa para guardar en BD
        return '/uploads/' . $subdirectory . '/' . $newFilename;
    }

    /**
     * Elimina un archivo del sistema de archivos
     * 
     * @param string $filePath Ruta relativa del archivo (ej: '/uploads/posts/imagen.jpg')
     * @return bool True si se eliminó correctamente, false si no existe
     */
    public function delete(string $filePath): bool
    {
        // Construir ruta completa
        $fullPath = $this->uploadsDirectory . '/../..' . $filePath;

        // Verificar que el archivo existe y eliminarlo
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }

        return false;
    }

    /**
     * Obtiene la URL completa de un archivo
     * 
     * @param string $filePath Ruta relativa del archivo
     * @param string $baseUrl URL base del servidor
     * @return string URL completa del archivo
     */
    public function getFileUrl(string $filePath, string $baseUrl = 'http://127.0.0.1:8000'): string
    {
        return $baseUrl . $filePath;
    }
}
