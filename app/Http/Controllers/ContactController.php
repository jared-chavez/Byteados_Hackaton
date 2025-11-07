<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    /**
     * Mostrar el formulario de contacto
     */
    public function index()
    {
        return Inertia::render('Contact');
    }

    /**
     * Procesar y enviar el formulario de contacto
     */
    public function store(ContactRequest $request)
    {
        $validated = $request->validated();

        try {
            // Enviar correo
            Mail::send('emails.contact', [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
            ], function ($mail) use ($validated) {
                $mail->to(config('mail.from.address'), config('mail.from.name'))
                    ->subject('Nuevo mensaje de contacto: ' . $validated['subject'])
                    ->replyTo($validated['email'], $validated['name']);
            });

            return back()->with('success', '¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.');
        } catch (\Exception $e) {
            \Log::error('Error al enviar correo de contacto: ' . $e->getMessage());
            return back()->withErrors([
                'email' => 'Hubo un error al enviar el mensaje. Por favor, intenta nuevamente más tarde.'
            ])->withInput();
        }
    }
}

