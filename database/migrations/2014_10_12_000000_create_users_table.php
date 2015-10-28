<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            //EMAIL RECEBERA O NOME DO USUARIO QUE IRA SE LOGAR NO SISTEMA
            $table->string('email')->unique();;
            $table->smallInteger('id_cliente')->default('0');
            $table->smallInteger('tipo_usuario')->default('4');
            $table->string('password', 60);
            $table->smallInteger('status')->default('0');
            $table->date('data_validade')->nullable();
            $table->rememberToken();
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
        Schema::drop('users');
    }
}
