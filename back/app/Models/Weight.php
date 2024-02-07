<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Weight extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'weights';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['value', 'key', 'label', 'label_jp'];
}
