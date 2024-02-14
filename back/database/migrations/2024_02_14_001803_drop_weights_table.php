<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropWeightsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::dropIfExists('weights');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::create('weights', function (Blueprint $table) {
            $table->increments('id');
            $table->timestamps();
            $table->integer('value');
            $table->text('key');
            $table->text('label');
            $table->text('label_jp');
        });
    }
}
