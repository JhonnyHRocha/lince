<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;

class ConsultasController extends Controller
{
    public function cpf_cnpj(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];

        $dados_pessoais = DB::connection('mysql2')->select(DB::raw("
            SELECT	*
            FROM t_dadospessoais
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 10
        "));

        $dados_email = DB::connection('mysql2')->select(DB::raw("
            SELECT	*
            FROM t_dadosemail
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 10
        "));

        $dados_telefone = DB::connection('mysql2')->select(DB::raw("
            SELECT	*
            FROM t_dadostelefone
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 10
        "));

        $dados_endereco = DB::connection('mysql2')->select(DB::raw("
            SELECT	*
            FROM t_dadosendereco
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 10
        "));


        return $dados_endereco;
    }
}
