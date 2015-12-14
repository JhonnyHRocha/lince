<?php

namespace Lince\Entities;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

class Cliente extends Model implements Transformable
{
    use TransformableTrait;

    protected $table = 'clientes';

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
        'id_venda',
        'data_contratacao',
        'data_expiracao',
        'observacao',
        'status',
        'id_revendedor',
        'consultas_contratado',
        'consultas_disponiveis',
        'token'
    ];

    public function users(){
        return $this->belongsToMany(User::class, 'clientes_usuario', 'id_cliente', 'id');
    }
}
