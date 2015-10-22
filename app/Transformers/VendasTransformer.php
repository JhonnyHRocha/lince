<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:39
 */

namespace Lince\Transformers;
use Lince\Entities\Vendas;
use League\Fractal\TransformerAbstract;

class VendasTransformer extends TransformerAbstract
{
    public function transform(Vendas $vendas){
        return[
            'id_venda' => $vendas->id,
            'id_cliente' => $vendas->id_cliente,
            'valor' => $vendas->valor,
            'quantidade_consultas' => $vendas->quantidade_consultas,
            'data_venda' => $vendas->data_venda,
            'status_pagamento' => $vendas->status_pagamento,
        ];
    }
}