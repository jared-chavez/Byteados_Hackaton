<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class InstitutionalEmail implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $allowedDomains = [
            'utc.edu.mx',
            'alumno.utc.edu.mx',
            'maestros.utc.edu.mx',
        ];

        $domain = substr(strrchr($value, "@"), 1);

        if (!in_array($domain, $allowedDomains)) {
            $fail('El correo debe ser institucional (@utc.edu.mx, @alumno.utc.edu.mx o @maestros.utc.edu.mx)');
            return;
        }

        // Validar formato para estudiantes
        if ($domain === 'alumno.utc.edu.mx') {
            $localPart = substr($value, 0, strpos($value, '@'));
            // Aceptar cualquier matrícula de 8 dígitos
            if (!preg_match('/^\d{8}$/', $localPart)) {
                $fail('El formato del correo estudiantil debe ser: XXXXXXXX@alumno.utc.edu.mx (8 dígitos)');
            }
        }
    }

    public static function extractStudentId(string $email): ?string
    {
        if (strpos($email, '@alumno.utc.edu.mx') !== false) {
            return substr($email, 0, strpos($email, '@'));
        }
        
        return null;
    }
}