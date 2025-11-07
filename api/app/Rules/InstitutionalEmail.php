<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class InstitutionalEmail implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Formato: 21******@alumno.utc.edu.mx (21 seguido de 6 dígitos)
        $pattern = '/^21\d{6}@alumno\.utc\.edu\.mx$/';
        
        if (!preg_match($pattern, $value)) {
            $fail('El :attribute debe tener el formato institucional: 21******@alumno.utc.edu.mx');
        }
    }
    
    /**
     * Extraer el número de matrícula del correo
     */
    public static function extractStudentId(string $email): ?string
    {
        if (preg_match('/^(21\d{6})@alumno\.utc\.edu\.mx$/', $email, $matches)) {
            return $matches[1];
        }
        
        return null;
    }
}
