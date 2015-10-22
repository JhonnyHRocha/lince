<?php

namespace Lince\Entities;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

class Revendedores extends Model implements Transformable
{
    use TransformableTrait;

    protected $fillable = [
        'id_usuario',
        'nome',
        'email',
        'consultas_disponiveis',
        'status',
    ];

}
