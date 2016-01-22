<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 18:52
 */

namespace Lince\Validators;


use Prettus\Validator\LaravelValidator;

class VendasValidator extends LaravelValidator
{
    protected $rules = [
        'id_cliente' => 'required',
        'id_vendedor' => 'required',
        'quantidade_consultas' => 'required',
        'valor' => 'required',
        'data_venda' => 'required',
        'status_pagamento' => 'required'
    ];
}