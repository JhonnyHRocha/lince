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
}