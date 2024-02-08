<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS pgroonga');
    }
    /**
     * Reverse the migrations.
     */
    public function down()
    {
        DB::statement('DROP EXTENSION IF EXISTS pgroonga');
    }
};
