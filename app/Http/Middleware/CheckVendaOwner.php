<?php

namespace Lince\Http\Middleware;

use Closure;
use Lince\Repositories\RevendedoresRepository;
use Lince\Repositories\VendasRepository;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class CheckVendaOwner
{
    public function __construct(RevendedoresRepository $revendedoresRepository, VendasRepository $repository){
        $this->repository = $repository;
        $this->revendedoresRepository = $revendedoresRepository;
    }


    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $userId = Authorizer::getResourceOwnerId();

        $revendedor = $this->revendedoresRepository->findWhere(['id_usuario' => $userId]);
        $id_revendedor = $revendedor[0]['id'];

        $id = $request->venda;

        if($this->repository->isOwner($id,$id_revendedor) == false){
            return ['error'=>'Acesso Negado'];
        }

        return $next($request);
    }
}
