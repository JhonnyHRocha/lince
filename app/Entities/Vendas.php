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
        'quantidade_consultas',
        'valor',
        'data_venda',
        'status_pagamento',
    ];

}
