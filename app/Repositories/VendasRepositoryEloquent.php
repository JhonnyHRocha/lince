<?php

namespace Lince\Repositories;

use Illuminate\Support\Facades\DB;
use Lince\Http\Controllers\RevendedoresController;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Lince\Repositories\VendasRepository;
use Lince\Entities\Vendas;
use Lince\Presenters\VendasPresenter;

/**
 * Class VendasRepositoryEloquent
 * @package namespace Lince\Repositories;
 */
class VendasRepositoryEloquent extends BaseRepository implements VendasRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Vendas::class;
    }

    public function presenter(){
        return VendasPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    public function vendasCliente($idCliente){
        return DB::table('vendas')
            ->select('vendas.id', 'clientes.nome as cliente', 'revendedores.nome','pacotes.pacote','vendas.quantidade_usuarios','vendas.quantidade_usuarios_adicionais','vendas.valor','vendas.valor_desconto',
                    'vendas.data_venda','vendas.data_confirm_pgto',
                    DB::raw('(CASE WHEN vendas.status_pagamento = 0 THEN "Aguardando Confirmação"
                                   WHEN vendas.status_pagamento = 1 THEN "Pago"
                                   WHEN vendas.status_pagamento = 2 THEN "Cancelado"
                                   WHEN vendas.status_pagamento = 3 THEN "Não Compensado" END) AS status'))
            ->join('clientes','clientes.id','=','vendas.id_cliente')
            ->join('revendedores','revendedores.id','=','vendas.id_vendedor')
            ->join('pacotes','vendas.id_pacote','=','pacotes.id')
            ->where('vendas.id_cliente','=',$idCliente)
            ->take(5)
            ->orderBy('vendas.id','desc')
            ->get();
    }

    public function vendasGeral($id_usuario){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$id_usuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1){
            return DB::table('vendas')
                ->select('vendas.id', 'clientes.nome as cliente', 'clientes.id as cliente_id', 'revendedores.nome as vendedor', 'revendedores.id as vendedor_id', 'pacotes.pacote','vendas.quantidade_usuarios',
                    'vendas.quantidade_usuarios_adicionais','vendas.valor','vendas.valor_desconto', 'vendas.data_venda','vendas.data_confirm_pgto',
                    DB::raw('(CASE WHEN vendas.status_pagamento = 0 THEN "Aguardando Compensação"
                                   WHEN vendas.status_pagamento = 1 THEN "Pago"
                                   WHEN vendas.status_pagamento = 2 THEN "Não"
                                   WHEN vendas.status_pagamento = 3 THEN "Não Compensado" END) AS status'))
                ->join('clientes','clientes.id','=','vendas.id_cliente')
                ->join('revendedores','revendedores.id','=','vendas.id_vendedor')
                ->join('pacotes','vendas.id_pacote','=','pacotes.id')
                ->orderBy('vendas.id','desc')
                ->get();
        } elseif($tipo_usuario[0]->tipo_usuario === 2) {
            return DB::table('vendas')
                ->select('vendas.id', 'clientes.nome as cliente', 'clientes.id as cliente_id', 'revendedores.nome as vendedor','pacotes.pacote','vendas.quantidade_usuarios','vendas.quantidade_usuarios_adicionais','vendas.valor',
                    'vendas.valor_desconto','vendas.data_venda','vendas.data_confirm_pgto',
                    DB::raw('(CASE WHEN vendas.status_pagamento = 0 THEN "Aguardando Compensação"
                                   WHEN vendas.status_pagamento = 1 THEN "Pago"
                                   WHEN vendas.status_pagamento = 2 THEN "Não"
                                   WHEN vendas.status_pagamento = 3 THEN "Não Compensado" END) AS status'))
                ->join('clientes','clientes.id','=','vendas.id_cliente')
                ->join('revendedores','revendedores.id','=','vendas.id_vendedor')
                ->join('pacotes','vendas.id_pacote','=','pacotes.id')
                ->where('vendas.id_cliente','=',$id_usuario)
                ->orderBy('vendas.id','desc')
                ->get();
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }

    public function somatoriaValores($id_usuario){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$id_usuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1){
            return DB::select(DB::raw("
                SELECT	sum(valor) as valor, count(*) as quantidade, status_pagamento as status, MONTH(data_venda) as mes
                FROM vendas
                WHERE MONTH(data_venda) = MONTH(NOW()) OR MONTH(data_venda) = MONTH(NOW())-1
                GROUP BY status_pagamento, MONTH(data_venda)
                ORDER BY MONTH(data_venda), status_pagamento
            "));
        } elseif($tipo_usuario[0]->tipo_usuario === 2) {
            return DB::table('vendas')
                ->select('vendas.id', 'clientes.nome as cliente', 'clientes.id as cliente_id', 'revendedores.nome as vendedor','pacotes.pacote','vendas.quantidade_usuarios','vendas.quantidade_usuarios_adicionais','vendas.valor',
                    'vendas.valor_desconto','vendas.data_venda','vendas.data_confirm_pgto',
                    DB::raw('(CASE WHEN vendas.status_pagamento = 0 THEN "Aguardando Compensação"
                                   WHEN vendas.status_pagamento = 1 THEN "Pago"
                                   WHEN vendas.status_pagamento = 2 THEN "Não"
                                   WHEN vendas.status_pagamento = 3 THEN "Não Compensado" END) AS status'))
                ->join('clientes','clientes.id','=','vendas.id_cliente')
                ->join('revendedores','revendedores.id','=','vendas.id_vendedor')
                ->join('pacotes','vendas.id_pacote','=','pacotes.id')
                ->where('vendas.id_cliente','=',$id_usuario)
                ->orderBy('vendas.id','desc')
                ->get();
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }

    public function adicionaCredito(array $data, $idUsuario, $idCliente){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$idUsuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1){
            return DB::select(DB::raw("
                UPDATE clientes
                SET numero_usuarios = " .$data['quantidade_usuarios']. ",
                    data_contratacao = '" .$data['data_liberacao']. "',
                    data_expiracao = '" .$data['data_expiracao']. "',
                    consultas_contratado = " .$data['quantidade_consultas']. ",
                    valor_mensal = " .$data['valor']. ",
                    status = 1
                WHERE clientes.id = " .$idCliente. "
            "));
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }
}
