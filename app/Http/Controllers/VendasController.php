<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;
use Lince\Repositories\RevendedoresRepository;
use Lince\Repositories\VendasRepository;
use Lince\Services\VendasService;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class VendasController extends Controller
{
    /**
     * @var VendasRepository
     */
    private $repository;
    /**
     * @var VendasService
     */
    private $service;

    /**
     * @param VendasRepository $repository
     * @param VendasService $service
     */
    public function __construct(VendasRepository $repository, VendasService $service, RevendedoresRepository $revendedoresRepository){
        $this->repository = $repository;
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return $this->repository->skipPresenter()->vendasGeral(\Authorizer::getResourceOwnerId());
        //return $this->repository->all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return $this->service->create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->repository->find($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        return $this->service->update($request->all(), $id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function find(Request $request, $id)
    {
        return $this->service->update($request->all(), $id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        return $this->repository->delete($id);
    }

    public function selecionaVendasCliente($idCliente){
        //return $this->repository->all();
        return $this->repository->skipPresenter()->vendasCliente($idCliente);
    }

    public function verificarVendaOwner($vendaId){
        return $this->repository->isOwner($vendaId,$this->id_revendedor);
    }

    public function somaValores(){
        return $this->repository->somatoriaValores(\Authorizer::getResourceOwnerId());
    }
}
