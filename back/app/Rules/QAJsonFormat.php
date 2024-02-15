<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class QAJsonFormat implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Get the contents of the file
        $contents = file_get_contents($value->getRealPath());

        // Decode the JSON data
        $data = json_decode($contents, true);

        // Check if the JSON is valid
        if (json_last_error() !== JSON_ERROR_NONE) {
            $fail('The ' . $attribute . ' must be a valid JSON.');
        }

        // Check if each item has a 'prompt' and 'answer' field
        foreach ($data as $item) {
            if (!isset($item['prompt']) || !isset($item['answer'])) {
                $fail('The ' . $attribute . ' must be a valid JSON.');
            }
        }
    }
}
