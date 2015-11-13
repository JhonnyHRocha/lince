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
            'id_vendedor' => $vendas->id_vendedor,
            'id_pacote' => $vendas->id_pacote,
            'quantidade_usuarios' => $vendas->quantidade_usuarios,
            'quantidade_usuarios_adicionais' => $vendas->quantidade_usuarios_adicionais,
            'quantidade_consultas' => $vendas->quantidade_consultas,
            'valor' => $vendas->valor,
            'data_venda' => $vendas->data_venda,
            'status_pagamento' => $vendas->status_pagamento,
            'tipo_pagamento' => $vendas->tipo_pagamento,
            'data_confirm_pgto' => $vendas->status_pagamento,
        ];
    }
}