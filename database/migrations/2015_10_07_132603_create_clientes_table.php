<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('nome', 80);
            $table->string('cpf_cnpj', 14);
            $table->string('tipo_pessoa', 2)->nullable();
            $table->string('contato', 40)->nullable();
            $table->string('logradouro', 80)->nullable();
            $table->string('complemento',30)->nullable();
            $table->string('bairro', 50)->nullable();
            $table->string('cidade',80)->nullable();
            $table->string('uf',2)->nullable();
            $table->string('cep', 8)->nullable();
            $table->string('telefone_1', 20)->nullable();
            $table->string('telefone_2', 20)->nullable();
            $table->string('email_cobranca', 50)->nullable();
            $table->string('skype', 40)->nullable();
            $table->smallInteger('numero_usuarios')->default(0);
            $table->decimal('valor_mensal',8,2)->default('0.00');
            $table->date('data_contratacao')->nullable();
            $table->date('data_expiracao')->nullable();
            $table->text('observacao')->nullable();
            $table->tinyInteger('status')->default(1);
            $table->integer('id_revendedor')->nullable();
            $table->integer('consultas_contratado')->nullable();
            $table->integer('consultas_disponiveis')->nullable();
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
        Schema::drop('clientes');
    }
}
