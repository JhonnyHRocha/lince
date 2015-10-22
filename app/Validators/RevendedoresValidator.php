<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 18:52
 */

namespace Lince\Validators;


use Prettus\Validator\LaravelValidator;

class RevendedoresValidator extends LaravelValidator
{
    protected $rules = [
        'id_usuario' => 'required',
        'nome' => 'required',
        'email' => 'required',
        'consultas_disponiveis' => 'required',
        'status' => 'required'
    ];
}