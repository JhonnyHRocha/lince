<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:39
 */

namespace Lince\Transformers;
use League\Fractal\TransformerAbstract;
use Lince\Entities\Revendedores;

class RevendedoresTransformer extends TransformerAbstract
{
    public function transform(Revendedores $revendedores){
        return[
            'id'                    => $revendedores->id,
            'id_usuario'            => $revendedores->id_usuario,
            'nome'                  => $revendedores->nome,
            'email'                 => $revendedores->email,
            'consultas_disponiveis' => $revendedores->consultas_disponiveis,
            'status'                => $revendedores->status,
            'data_criado'           => $revendedores->created_at->format('d/m/Y'),
        ];
    }
}