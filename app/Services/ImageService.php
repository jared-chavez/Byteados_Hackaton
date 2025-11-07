<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    protected $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    public function processImageToBlob(
        UploadedFile $file,
        int $maxWidth = 800,
        int $maxHeight = 800,
        int $quality = 85
    ): ?string {
        try {
            $image = $this->imageManager->read($file->getPathname());
            
            // Redimensionar manteniendo proporción
            $image->scaleDown($maxWidth, $maxHeight);
            
            // Convertir a JPEG y obtener como string
            $encoded = $image->toJpeg($quality);
            
            return $encoded->toString();
        } catch (\Exception $e) {
            \Log::error('Error processing image: ' . $e->getMessage());
            return null;
        }
    }

    public function base64ToBlob(string $base64String): ?string
    {
        try {
            // Remover el prefijo data:image/...;base64, si existe
            if (strpos($base64String, 'data:image') === 0) {
                $base64String = substr($base64String, strpos($base64String, ',') + 1);
            }
            
            $imageData = base64_decode($base64String);
            
            if ($imageData === false) {
                return null;
            }
            
            // Crear imagen temporal
            $tempFile = tempnam(sys_get_temp_dir(), 'img');
            file_put_contents($tempFile, $imageData);
            
            // Procesar imagen
            $image = $this->imageManager->read($tempFile);
            $image->scaleDown(800, 800);
            $encoded = $image->toJpeg(85);
            
            // Limpiar archivo temporal
            unlink($tempFile);
            
            return $encoded->toString();
        } catch (\Exception $e) {
            \Log::error('Error converting base64 to blob: ' . $e->getMessage());
            return null;
        }
    }

    public function getBlobMimeType(string $blob): string
    {
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($blob);
        
        // Fallback a JPEG si no se puede determinar
        return $mimeType ?: 'image/jpeg';
    }

    public function resizeBlob(string $blob, int $width, int $height): ?string
    {
        try {
            $image = $this->imageManager->read($blob);
            $image->resize($width, $height);
            $encoded = $image->toJpeg(85);
            
            return $encoded->toString();
        } catch (\Exception $e) {
            \Log::error('Error resizing blob: ' . $e->getMessage());
            return null;
        }
    }
}