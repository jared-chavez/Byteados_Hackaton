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
            'estudiantes.utc.edu.mx',
            'maestros.utc.edu.mx',
        ];

        $domain = substr(strrchr($value, "@"), 1);

        if (!in_array($domain, $allowedDomains)) {
            $fail('El correo debe ser institucional (@utc.edu.mx)');
            return;
        }

        // Validar formato para estudiantes
        if ($domain === 'estudiantes.utc.edu.mx') {
            $localPart = substr($value, 0, strpos($value, '@'));
            if (!preg_match('/^21\d{6}$/', $localPart)) {
                $fail('El formato del correo estudiantil debe ser: 21XXXXXX@estudiantes.utc.edu.mx');
            }
        }
    }

    public static function extractStudentId(string $email): ?string
    {
        if (strpos($email, '@estudiantes.utc.edu.mx') !== false) {
            return substr($email, 0, strpos($email, '@'));
        }
        
        return null;
    }
}