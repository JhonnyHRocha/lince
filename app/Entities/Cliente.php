<?php

namespace Lince\Entities;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $fillable = [
        'nome',
        'cpf_cnpj',
        'tipo_pessoa',
        'contato',
        'logradouro',
        'complemento',
        'bairro',
        'cidade',
        'uf',
        'cep',
        'telefone_1',
        'telefone_2',
        'email_cobranca',
        'skype',
        'numero_usuarios',
        'valor_mensal',
        'data_contratacao',
        'data_expiracao',
        'observacao',
        'status',
        'id_revendedor',
        'consultas_contratado',
        'consultas_disponiveis',
    ];

    public function users(){
        return $this->belongsToMany(User::class, 'clientes_usuario', 'id_cliente', 'id');
    }

}