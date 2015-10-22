<?php

namespace Lince\Repositories;

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

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }

    //verifica se é ou nao dono de uma determinada venda
    public function isOwner($vendaId, $userId){

        if(count($this->findWhere(['id' => $vendaId, 'id_vendedor' => $userId]))){
            return true;
        }

        return false;
    }

    //public function presenter(){
    //    return VendasPresenter::class;
    //}
}
