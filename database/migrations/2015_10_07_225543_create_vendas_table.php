<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVendasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vendas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_cliente');
            $table->integer('id_vendedor');
            $table->integer('id_pacote');
            $table->integer('quantidade_usuarios');
            $table->integer('quantidade_usuarios_adicionais');
            $table->bigInteger('quantidade_consultas');
            $table->decimal('valor',8,2);
            $table->date('data_venda');
            $table->integer('status_pagamento');
            $table->date('data_confirm_pgto');
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
        Schema::drop('vendas');
    }
}
