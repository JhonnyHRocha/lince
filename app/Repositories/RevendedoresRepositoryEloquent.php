<?php

namespace Lince\Repositories;

use Lince\Presenters\RevendedoresPresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use Lince\Repositories\RevendedoresRepository;
use Lince\Entities\Revendedores;

/**
 * Class RevendedoresRepositoryEloquent
 * @package namespace Lince\Repositories;
 */
class RevendedoresRepositoryEloquent extends BaseRepository implements RevendedoresRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return Revendedores::class;
    }

    public function presenter(){
        return RevendedoresPresenter::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
