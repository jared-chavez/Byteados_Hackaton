import { z } from 'zod';

// Schema de validación para Login
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('El correo electrónico no es válido')
        .toLowerCase(),
    password: z
        .string()
        .min(1, 'La contraseña es requerida'),
    remember: z.boolean().optional().default(false),
});

// Schema de validación para Register
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(255, 'El nombre no puede exceder 255 caracteres')
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'),
    email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('El correo electrónico no es válido')
        .toLowerCase()
        .refine(
            (email) => 
                email.endsWith('@utc.edu.mx') || 
                email.endsWith('@alumno.utc.edu.mx') || 
                email.endsWith('@maestros.utc.edu.mx'),
            'El correo electrónico debe ser institucional (@utc.edu.mx, @alumno.utc.edu.mx o @maestros.utc.edu.mx)'
        ),
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
        .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
        .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
        .regex(/[^A-Za-z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
    password_confirmation: z
        .string()
        .min(1, 'La confirmación de contraseña es requerida'),
    user_type: z
        .enum(['student', 'teacher'], {
            errorMap: () => ({ message: 'Debes seleccionar un tipo de usuario válido' }),
        }),
    phone: z
        .string()
        .optional()
        .refine(
            (phone) => {
                if (!phone || phone.trim() === '') return true;
                return /^[0-9]{10}$/.test(phone);
            },
            'El teléfono debe tener 10 dígitos'
        ),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});

// Función helper para validar datos
export const validateForm = (schema, data) => {
    try {
        if (!schema || typeof schema.parse !== 'function') {
            console.error('Schema inválido:', schema);
            return { success: false, errors: { general: 'Schema de validación inválido' } };
        }
        
        schema.parse(data);
        return { success: true, errors: {} };
    } catch (error) {
        // Zod usa 'issues' en lugar de 'errors' en versiones modernas
        const issues = error?.issues || error?.errors;
        
        if (issues && Array.isArray(issues)) {
            const errors = {};
            issues.forEach((issue) => {
                if (issue && typeof issue === 'object') {
                    // Zod usa 'path' como array
                    const path = Array.isArray(issue.path) 
                        ? issue.path.join('.') 
                        : (issue.path ? String(issue.path) : 'general');
                    
                    // Zod usa 'message' para el mensaje de error
                    const message = issue.message || issue.msg || 'Error de validación';
                    
                    if (path && path !== '') {
                        errors[path] = message;
                    }
                }
            });
            return { success: false, errors: Object.keys(errors).length > 0 ? errors : { general: 'Error de validación' } };
        }
        
        // Error genérico si no podemos procesar el error
        console.error('Error de validación inesperado:', error);
        return { success: false, errors: { general: error?.message || 'Error de validación' } };
    }
};

