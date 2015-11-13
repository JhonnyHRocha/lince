<?php

namespace Lince\Entities;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

class Vendas extends Model implements Transformable
{
    use TransformableTrait;

    protected $fillable = [
        'id_cliente',
        'id_vendedor',
        'id_pacote',
        'quantidade_usuarios',
        'quantidade_usuarios_adicionais',
        'quantidade_consultas',
        'valor',
        'data_venda',
        'status_pagamento',
        'tipo_pagamento',
        'data_confirm_pgto'
    ];

}
