<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;

class InicioController extends Controller
{
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

    public function vendasUltimosMeses(){
        return DB::select(DB::raw("
            SELECT	(CASE MONTHNAME(data_venda)
                         when 'January' then 'Janeiro'
                         when 'February' then 'Fevereiro'
                         when 'March' then 'Março'
                         when 'April' then 'Abril'
                         when 'May' then 'Maio'
                         when 'June' then 'Junho'
                         when 'July' then 'Julho'
                         when 'August' then 'Agosto'
                         when 'September' then 'Setembro'
                         when 'October' then 'Outubro'
                         when 'November' then 'Novembro'
                         when 'December' then 'Dezembro'
                         END) AS mes,
                    IFNULL((SELECT SUM(valor) as valor FROM vendas where MONTH(a.data_venda) = MONTH(vendas.data_venda) and status_pagamento = 2), '0.00') AS aguardando,
                    IFNULL((SELECT SUM(valor) as valor FROM vendas where MONTH(a.data_venda) = MONTH(vendas.data_venda) and status_pagamento = 1), '0.00') AS pago
            FROM vendas a
            WHERE MONTH(data_venda) >= (MONTH(NOW()) -6)
            GROUP BY MONTH(data_venda)
        "));
    }

    public function clienteStatus($idUsuario){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$idUsuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1) {
            return DB::select(DB::raw("
                SELECT	COUNT(*) as clientes,
                        status,
		                CONCAT(ROUND(( (COUNT(*)/(SELECT COUNT(*) FROM clientes)) * 100),2),'%') AS porcentagem,
		                (SELECT COUNT(*)-1 FROM revendedores) AS revendedores
                FROM clientes
                GROUP BY status
            "));
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }

    public function rankingVendas($idUsuario){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$idUsuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1) {
            return DB::select(DB::raw("
                SELECT	revendedores.nome,
                        COUNT(*) AS quantidade,
                        CONCAT(ROUND(( (COUNT(*)/(SELECT COUNT(*) FROM vendas where status_pagamento = 1)) * 100),2),'%') AS porcentagem,
                        SUM(valor) as valor,
                        (SELECT SUM(valor) FROM vendas WHERE vendas.status_pagamento = 1 AND MONTH(data_venda) = MONTH(NOW())) AS total_geral,
                        IFNULL((SELECT SUM(valor) FROM vendas WHERE vendas.status_pagamento = 2 ), 0) AS total_vendas_nao
                FROM vendas
                JOIN revendedores ON revendedores.id = vendas.id_vendedor
                WHERE vendas.status_pagamento = 1
                AND MONTH(data_venda) = MONTH(NOW())
                GROUP BY id_vendedor
                ORDER BY SUM(valor) DESC
            "));
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }

    public function historicoVendasCliente($idCliente){
        return DB::select(DB::raw("
                SELECT	vendas.id,
                        pacotes.pacote,
                        vendas.quantidade_usuarios,
                        vendas.valor,
                        vendas.data_venda,
                        (CASE WHEN vendas.status_pagamento = 0 THEN 'Aguardando Compensação'
                              WHEN vendas.status_pagamento = 1 THEN 'Pago'
                              WHEN vendas.status_pagamento = 2 THEN 'Não'
                              WHEN vendas.status_pagamento = 3 THEN 'Não Compensado' END) AS status,
                        (CASE WHEN MONTH(data_venda) = MONTH(NOW()) && status_pagamento IN (0,2,3) THEN 'true'
                              ELSE 'false' END) AS boleto
                FROM vendas
                JOIN pacotes ON pacotes.id = vendas.id_pacote
                WHERE id_cliente = $idCliente
                ORDER BY id DESC
        "));
    }

    public function dadosGeralCliente($idCliente){
        return DB::select(DB::raw("
            SELECT	clientes.id,
                    clientes.numero_usuarios,
                    COUNT(consultas.id) AS consultas,
                    CASE
                        WHEN data_expiracao < NOW() || data_expiracao IS NULL THEN ''
                        WHEN data_expiracao >= NOW() THEN 'Ilimitado'
                    END AS pacote,
                    clientes.valor_mensal,
                    CASE
                        WHEN data_expiracao < NOW() || data_expiracao IS NULL THEN ''
                        WHEN data_expiracao >= NOW() THEN data_expiracao
                    END AS data_expiracao
            FROM clientes
            LEFT JOIN consultas ON consultas.id_cliente = clientes.id AND MONTH(data_consulta) = MONTH(NOW())
            WHERE clientes.id = $idCliente
        "));
    }

    public function rankingConsultasUsuarios($idCliente){
        return DB::select(DB::raw("
            SELECT	users.id as id,
                    users.name as nome,
                    COUNT(consultas.id) as consultas
            FROM users
            LEFT JOIN consultas ON consultas.id_usuario = users.id
            WHERE users.id_cliente = $idCliente
            GROUP BY users.id
        "));
    }

    public function ultimasConsultas($idCliente){
        return DB::select(DB::raw("
            SELECT	users.name as nome,
                    CASE
                        WHEN consultas.tipo_consulta = 1 THEN 'CPF / CNPJ'
                        WHEN consultas.tipo_consulta = 2 THEN 'ENDEREÇO'
                    END AS tipo_consulta,
                    parametros,
		            DATE_FORMAT(data_consulta, '%d/%m/%Y %h:%m:%s') AS data_consulta
            FROM consultas
            JOIN users ON users.id = consultas.id_usuario
            WHERE consultas.id_cliente = $idCliente
            ORDER BY data_consulta DESC
            LIMIT 100
        "));
    }
}
