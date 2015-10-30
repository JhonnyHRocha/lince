<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 29/10/15
 * Time: 15:20
 */

namespace Lince\Repositories;


use Lince\Entities\Usuarios;
use Lince\Presenters\UsuariosPresenter;
use Prettus\Repository\Eloquent\BaseRepository;

class UsuariosRepositoryEloquent extends BaseRepository implements UsuariosRepository
{
    public function model(){
        return Usuarios::class;
    }

    public function presenter(){
        return UsuariosPresenter::class;
    }





    //BUSCA O USUARIO JUNTO AO ID DO CLIENTE E APLICA A PAGINAÇÃO
    public function findOwner($clienteID, $limit = null, $columns = array()){
            return $this->scopeQuery(function($query) use ($clienteID){

                return $query->select('users.*');
                //if($tipo_usuario === '3')
                //else
                //if($tipo_usuario == 1)
                //   return $query->select('users.*')->where('id_cliente', '=', $clienteID);

                //return $query->select('users.*')->where('id_cliente', '=', $clienteID);
            })->paginate($limit,$columns);



    }
}