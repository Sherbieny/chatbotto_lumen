<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
