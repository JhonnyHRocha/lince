<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 13:10
 */

namespace Lince\Repositories;

use Lince\Presenters\ClientePresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Lince\Entities\Cliente;


class ClienteRepositoryEloquent extends BaseRepository implements ClienteRepository
{
    public function model(){
        return Cliente::class;
    }

    public function presenter(){
        return ClientePresenter::class;
    }

    //BUSCA O CLIENTE JUNTO AO ID DO USUARIO E APLICA A PAGINAÇÃO
    public function findOwner($userId, $limit = null, $columns = array()){
        return $this->scopeQuery(function($query) use ($userId){
            return $query->select('clientes.*')->where('id_revendedor', '=', $userId);
        })->paginate($limit,$columns);
    }
}
