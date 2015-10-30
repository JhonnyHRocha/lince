<?php

namespace Lince\Entities;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

class Cliente_Usuario extends Model implements Transformable
{
    use TransformableTrait;

    protected $fillable = [
        'id_cliente',
        'id_usuario',
    ];
}
