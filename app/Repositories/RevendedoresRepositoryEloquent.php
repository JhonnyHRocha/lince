<?php

namespace Lince\Repositories;

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

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
