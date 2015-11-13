<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Lince\Entities\Cliente;
use Lince\Repositories\ClienteRepository;
use Lince\Services\ClienteService;

class ClienteController extends Controller
{
    /**
     * @var ClienteRepository
     */
    private $repository;
    /**
     * @var ClienteService
     */
    private $service;

    /**
     * @param ClienteRepository $repository
     * @param ClienteService $service
     */
    public function __construct(ClienteRepository $repository, ClienteService $service){
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

    public function verificaClienteExiste($id){
        $cliente = \Lince\Entities\Cliente::where('cpf_cnpj', $id)->first();
        if($cliente !== null)
            return $cliente;
        else
            return response()->json(['cnpj' => '']);
    }

    public function verificaUsuarioExiste($id){
        $usuario = \Lince\Entities\Usuarios::where('email', $id)->first();
        if($usuario !== null)
            return response()->json(['id' => 'true']);
        else
            return response()->json(['id' => 'false']);
    }

    public function clienteUsuarios($id){
        return $this->service->isUsuario($id);
    }

    public function addClienteUsuario(Request $request){
        $this->service->addUsuario($request->all());
    }

    public function deletaClienteUsuario($clienteID, $usuarioID){
        $this->service->removeUsuario($clienteID, $usuarioID);
    }

    public function exibeClienteUsuario($clienteID, $usuarioID){
        return \Lince\Entities\Usuarios::where('id_cliente', $clienteID)->where('id',$usuarioID)->first();
    }

    public function atualizaClienteUsuario(Request $request, $clienteID, $idUsuario){
        return $this->service->atualizaUsuario($request->all(), $idUsuario);
    }

    public function exibeTodosUsuarios(){
        return $this->service->exibeTodosUsuarios();
    }

    public function clienteListagem(Request $request){
        return $this->repository->skipPresenter()->all(['id','nome']);
    }

    //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
    public function selecionaClientesDashboard($idUsuario, Request $request){
        return $this->repository->skipPresenter()->clienteDashboard($idUsuario,$request->query->get('limit'));
    }


/*
Route::get('{id}/usuarios', 'ClienteController@clienteUsuarios');
Route::post('{id}/usuarios', 'ClienteController@addClienteUsuario');
Route::get('{id}/usuario/{usuarioID}', 'ClienteController@exibeClienteUsuario');
Route::delete('{id}/usuario/{usuarioID}', 'ClienteController@deletaClienteUsuario');*/
}
