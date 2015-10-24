<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRevendedoresTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('revendedores', function (Blueprint $table) {
            $table->increments('id');
            $table->bigInteger('id_usuario')->nullable();;
            $table->string('nome', 50);
            $table->string('email', 50);
            $table->integer('consultas_disponiveis');
            $table->integer('status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('revendedores');
    }
}
