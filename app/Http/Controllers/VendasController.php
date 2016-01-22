<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Lince\Repositories\RevendedoresRepository;
use Lince\Repositories\VendasRepository;
use Lince\Services\VendasService;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;
use phpDocumentor\Reflection\DocBlock\Tag\ReturnTag;

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

    public function creditoCliente(Request $request, $idCliente){
        return $this->repository->adicionaCredito($request->all(), \Authorizer::getResourceOwnerId(), $idCliente);
    }

    public function baixa(Request $request){
        $boletos = $request['boletos'];

        $arrayVariaveis = array();
        $variavel = DB::select(DB::raw("
            SELECT id_venda
            FROM boleto
            JOIN vendas ON vendas.id = boleto.id_venda
            WHERE boleto.id IN ($boletos) AND vendas.data_confirm_pgto IS NULL
        "));

        if($variavel == [])
            return array('length' => 0);

        foreach ($variavel as $i => $value) {
            array_push($arrayVariaveis, $variavel[$i]->id_venda);
        }

        $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');

        $sql = " UPDATE vendas
            SET status_pagamento = 1,
                tipo_pagamento = 1,
                data_confirm_pgto = NOW()
            WHERE id IN ( {$bindingsString} ) ";
        $resultado = DB::select($sql, $arrayVariaveis);


        //ADICIONA O CREDITO AOS DEVIDOS CLIENTES
        $sql2 = " SELECT * FROM vendas WHERE id IN ( {$bindingsString} ) ";
        $resultado2 = DB::select($sql2, $arrayVariaveis);
        foreach ($resultado2 as $i => $value) {
            if($resultado2[$i]->id_pacote == 1){
                DB::select(DB::raw("
                    UPDATE clientes
                    SET numero_usuarios = " .$resultado2[$i]->quantidade_usuarios. ",
                        data_contratacao = NOW(),
                        data_expiracao = DATE_ADD(NOW(),INTERVAL 30 DAY),
                        consultas_contratado = " .$resultado2[$i]->quantidade_consultas. ",
                        valor_mensal = " .$resultado2[$i]->valor. ",
                        status = 1
                    WHERE clientes.id = " .$resultado2[$i]->id_cliente. "
                "));
            } else if($resultado2[$i]->id_pacote == 2) {
                DB::select(DB::raw("
                    UPDATE clientes
                    SET numero_usuarios = numero_usuarios + " .$resultado2[$i]->quantidade_usuarios. ",
                        valor_mensal = valor_mensal + " .$resultado2[$i]->valor. ",
                        status = 1
                    WHERE clientes.id = " .$resultado2[$i]->id_cliente. "
                "));
            }
        }

        //return $resultado2;
    }
}
