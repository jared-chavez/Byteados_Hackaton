<?php

namespace App\Services;

use App\Models\Order;
use App\Rules\InstitutionalEmail;

class EmailService
{
    /**
     * Validar formato de correo institucional según tipo de usuario
     */
    public function validateInstitutionalEmail(string $email, string $userType = 'student'): bool
    {
        if ($userType === 'student') {
            // Formato: 21******@alumno.utc.edu.mx
            $pattern = '/^21\d{6}@alumno\.utc\.edu\.mx$/';
        } else {
            // Para maestros, puedes definir un formato específico
            // Por ahora, aceptamos el mismo formato o uno diferente
            $pattern = '/^21\d{6}@alumno\.utc\.edu\.mx$/'; // Ajustar según necesidad
        }

        return preg_match($pattern, $email) === 1;
    }

    /**
     * Extraer número de matrícula del correo
     */
    public function extractStudentId(string $email): ?string
    {
        return InstitutionalEmail::extractStudentId($email);
    }

    /**
     * Enviar email de confirmación de orden
     */
    public function sendOrderConfirmation(Order $order): void
    {
        // TODO: Implementar envío de email
        // Por ahora solo es un placeholder
        // Puedes usar Laravel Mail después
        
        $user = $order->user;
        $orderNumber = $order->order_number;
        $total = $order->total;

        // Ejemplo de implementación futura:
        // Mail::to($user->email)->send(new OrderConfirmationMail($order));
    }

    /**
     * Enviar email cuando la orden está lista
     */
    public function sendOrderReady(Order $order): void
    {
        // TODO: Implementar envío de email
        // Por ahora solo es un placeholder
        
        $user = $order->user;
        $orderNumber = $order->order_number;

        // Ejemplo de implementación futura:
        // Mail::to($user->email)->send(new OrderReadyMail($order));
    }

    /**
     * Enviar notificación de stock bajo
     */
    public function sendLowStockAlert(array $products): void
    {
        // TODO: Implementar notificación a administradores
        // Por ahora solo es un placeholder
        
        // Ejemplo de implementación futura:
        // $admins = Admin::where('role', 'warehouse_manager')->get();
        // foreach ($admins as $admin) {
        //     Mail::to($admin->email)->send(new LowStockAlertMail($products));
        // }
    }
}

