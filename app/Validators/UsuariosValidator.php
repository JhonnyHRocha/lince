<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 18:52
 */

namespace Lince\Validators;


use Prettus\Validator\LaravelValidator;

class UsuariosValidator extends LaravelValidator
{
    protected $rules = [
        'password' => 'min:6'
    ];
}