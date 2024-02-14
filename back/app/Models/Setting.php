<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'label', 'value'];


    public static function getSuggestionsCount()
    {
        $count = static::where('key', 'suggestionsCount')->first();
        return $count ? $count->value : 5;
    }
}
