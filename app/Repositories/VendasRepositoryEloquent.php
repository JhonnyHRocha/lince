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
            ->select('vendas.id', 'clientes.nome as cliente', 'revendedores.nome','pacotes.pacote','vendas.quantidade_usuarios','vendas.quantidade_usuarios_adicionais','vendas.valor',
                    'vendas.data_venda','vendas.data_confirm_pgto',
                    DB::raw('(CASE WHEN vendas.status_pagamento = 0 THEN "Aguardando Confirmação"
                                   WHEN vendas.status_pagamento = 1 THEN "Pago"
                                   WHEN vendas.status_pagamento = 2 THEN "Cancelado" END) AS status'))
            ->join('clientes','clientes.id','=','vendas.id_cliente')
            ->join('revendedores','revendedores.id','=','vendas.id_vendedor')
            ->join('pacotes','vendas.id_pacote','=','pacotes.id')
            ->where('vendas.id_cliente','=',$idCliente)
            ->take(5)
            ->orderBy('vendas.id','desc')
            ->get();
    }

}
