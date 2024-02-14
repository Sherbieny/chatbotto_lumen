<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class QA extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'qa';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['prompt', 'answer'];

    /**
     * Search the QA table for a given query string.
     *
     * @param  string  $query
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function search($query, $columns = ['prompt'], $limit = 10)
    {
        // Build the search query
        $search_query = static::query();
        foreach ($columns as $column) {
            $search_query->orWhereRaw("$column &@ ?", [$query]);
        }

        return $search_query->take($limit)->get()->map(function ($item) {
            return ['prompt' => $item->prompt, 'answer' => $item->answer];
        })->toArray();
    }

    /**
     * Get the answer for a given prompt if exist.
     *
     * @param  string  $prompt
     * @return string
     */
    public static function getAnswer($prompt)
    {
        $qa = static::where('prompt', $prompt)->first();

        return $qa ? $qa->answer : null;
    }
}
