<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 18:52
 */

namespace Lince\Validators;


use Prettus\Validator\LaravelValidator;

class ClienteValidator extends LaravelValidator
{
    protected $rules = [
        'nome' => 'required|max:255',
        'cpf_cnpj' => 'required|max:14'
    ];
}