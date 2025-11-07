<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es requerido.',
            'name.max' => 'El nombre no puede exceder 255 caracteres.',
            'email.required' => 'El correo electrónico es requerido.',
            'email.email' => 'Debe ser un correo electrónico válido.',
            'email.max' => 'El correo electrónico no puede exceder 255 caracteres.',
            'subject.required' => 'El asunto es requerido.',
            'subject.max' => 'El asunto no puede exceder 255 caracteres.',
            'message.required' => 'El mensaje es requerido.',
            'message.min' => 'El mensaje debe tener al menos 10 caracteres.',
            'message.max' => 'El mensaje no puede exceder 2000 caracteres.',
        ];
    }
}

