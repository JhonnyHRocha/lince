<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:39
 */

namespace Lince\Transformers;
use League\Fractal\TransformerAbstract;
use Lince\Entities\Usuarios;

class UsuariosTransformer extends TransformerAbstract
{
    public function transform(Usuarios $usuario){
        return[
            'id'                => $usuario->id,
            'name'              => $usuario->name,
            'email'             => $usuario->email,
            'password'          => $usuario->password,
            'id_cliente'        => $usuario->id_cliente,
            'tipo_usuario'      => $usuario->tipo_usuario,
            'data_validade'     => $usuario->data_validade,
            'status'            => $usuario->status,
            'limite_consultas'  => $usuario->limite_consultas
        ];
    }
}