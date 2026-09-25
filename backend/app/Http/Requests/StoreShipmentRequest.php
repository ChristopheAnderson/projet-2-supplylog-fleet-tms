<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShipmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'origin' => ['required', 'string', 'max:150'],
            'destination' => ['required', 'string', 'max:150'],
            'cargo_type' => ['required', 'string', 'max:150'],
            'weight_kg' => ['required', 'numeric', 'min:100', 'max:100000'],
            'vehicle_id' => ['nullable', 'exists:vehicles,id'],
            'driver_id' => ['nullable', 'exists:drivers,id'],
            'estimated_delivery' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'origin.required' => 'Le lieu de chargement (origine) est obligatoire.',
            'destination.required' => 'Le lieu de livraison (destination) est obligatoire.',
            'cargo_type.required' => 'Le type de marchandise est requis.',
            'weight_kg.required' => 'Le poids en kg est obligatoire.',
        ];
    }
}
