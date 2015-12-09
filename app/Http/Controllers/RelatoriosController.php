<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;

class RelatoriosController extends Controller
{
    public function consultas(Request $request){
        $dataInicio = $request->query->get('inicio');
        $dataFinal = $request->query->get('fim');
        $usuario = $request->query->get('usuario');
        $cliente = $request->query->get('cliente');
        $tipo_consulta = $request->query->get('tipo_consulta');
        $status = $request->query->get('status');
        $query = "";

        if($dataInicio)
            $query .= " AND data_consulta >= '$dataInicio 00:00:00'  ";
        if($dataFinal)
            $query .= " AND data_consulta <= '$dataFinal 23:59:59' ";
        if($usuario)
            $query .= " AND users.name LIKE '$usuario' ";
        if($cliente)
            $query .= " AND consultas.id_cliente = '$cliente' ";
        if($tipo_consulta)
            $query .= " AND consultas.tipo_consulta = '$tipo_consulta' ";
        if($status)
            $query .= " AND consultas.status = '$status' ";

        return DB::select(DB::raw("
            SELECT  clientes.nome as cliente,
                    users.name as usuario,
                    users.email as login,
                    consultas.parametros as parametro,
                    DATE_FORMAT(consultas.data_consulta, '%d/%c/%Y %H:%i:%s') as data,
                    CASE
                      WHEN consultas.tipo_consulta = 0 THEN 'CPF / CNPJ'
                      WHEN consultas.tipo_consulta = 1 THEN 'Endereço'
                      WHEN consultas.tipo_consulta = 2 THEN 'Telefone'
                    END AS tipo,
                    CASE
                      WHEN consultas.status = 0 THEN 'Não Encontrado'
                      WHEN consultas.status = 1 THEN 'Encontrado'
                    END AS status
            FROM consultas
            LEFT JOIN clientes ON clientes.id = consultas.id_cliente
            LEFT JOIN users ON users.id = consultas.id_usuario
            WHERE 1 = 1
            $query
            ORDER BY consultas.data_consulta DESC
        "));
    }

    public function vendas(Request $request){
        $dataInicio = $request->query->get('inicio');
        $dataFinal = $request->query->get('fim');
        $vendedor = $request->query->get('vendedor');
        $cliente = $request->query->get('cliente');
        $status_pagamento = $request->query->get('status');
        $query = "";

        if($dataInicio)
            $query .= " AND data_venda >= '$dataInicio 00:00:00' ";
        if($dataFinal)
            $query .= " AND data_venda <= '$dataFinal 23:59:59' ";
        if($vendedor || $vendedor == "0")
            $query .= " AND vendas.id_vendedor = '$vendedor' ";
        if($cliente)
            $query .= " AND vendas.id_cliente = '$cliente' ";
        if($status_pagamento || $status_pagamento == "0")
            $query .= " AND vendas.status_pagamento = '$status_pagamento' ";

        return DB::select(DB::raw("
            SELECT  vendas.id,
                    clientes.nome as cliente,
                    revendedores.nome as vendedor,
                    pacotes.pacote,
                    vendas.quantidade_usuarios,
                    vendas.valor,
                    vendas.valor_desconto,
                    vendas.data_venda,
                    vendas.status_pagamento,
                    CASE
                        WHEN vendas.status_pagamento = 0 THEN 'Aguardando Compensação'
                        WHEN vendas.status_pagamento = 1 THEN 'Pago'
                        WHEN vendas.status_pagamento = 2 THEN 'Não'
                        WHEN vendas.status_pagamento = 3 THEN 'Não Compensado'
                    END AS status,
                    vendas.tipo_pagamento,
                    vendas.data_confirm_pgto,
                    (SELECT SUM(valor) FROM vendas WHERE 1 = 1 $query) as total,
                    boleto.id AS boleto
            FROM vendas
            JOIN clientes ON clientes.id = vendas.id_cliente
            JOIN revendedores ON revendedores.id = vendas.id_vendedor
            JOIN pacotes ON pacotes.id = vendas.id_pacote
            LEFT JOIN boleto ON boleto.id_venda = vendas.id
            WHERE 1 = 1
            $query
        "));
    }


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
