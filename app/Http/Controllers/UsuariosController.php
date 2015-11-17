<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;
use Lince\Entities\User;
use Lince\Repositories\UsuariosRepository;
use Lince\Services\UsuariosService;

class UsuariosController extends Controller
{
    private $repository;

    private $service;

    public function  __construct(UsuariosRepository $repository, UsuariosService $service){
        $this->repository = $repository;
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        //if($request->query->getInt('tipo_usuario') == 1)
            return $this->repository->findOwner(\Authorizer::getResourceOwnerId(),$request->query->get('limit'));
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
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $this->repository->delete($id);
        }catch (Exception $e){
            return ['error' => $e->errorInfo];
        }
    }

    public function listagemUsuariosCliente(){
        return $this->repository->listagemUsuariosCliente(\Authorizer::getResourceOwnerId());
    }

    public function clienteUsuarios($id){
        return $this->repository->isUsuario($id);
    }

    public function atualizaUsuario(Request $request, $idUsuario){
        return $this->service->update($request->all(), $idUsuario);
    }

    public function atualizaSenha(Request $request, $id){
        return $this->service->senha($request->all(), $id);
    }
}
