<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Lince\Entities\Cliente;
use Lince\Entities\User;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;

class EmailController extends Controller
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

    public function emailCadastro(Request $request, $id){
        $cliente = Cliente::findOrFail($id);
        $data = array('nome' => $cliente->contato, 'cnpj' => $cliente->cpf_cnpj, 'token' => $cliente->token, 'email' => $cliente->email_cobranca);

        Mail::send('email/confirmar_email', $data, function($message) use ($cliente) {
            $message->to($cliente->email_cobranca, $cliente->contato)->subject('Bem vindo ao sistema Lince!');
        });
    }

    public function confirmarCadastro(Request $request){
        $cnpj = $request->query->get('cnpj');
        $token = $request->query->get('token');

        $resultado = DB::select(DB::raw("
            SELECT  CASE
                      WHEN token = '$token' THEN 'Ok'
                      ELSE 'Incorreto'
                    END AS token,
                    verificado
            FROM clientes
            WHERE cpf_cnpj = $cnpj
        "));

        if($resultado[0]->token === 'Ok' && $resultado[0]->verificado <= 0){
            DB::table('clientes')
                ->where('cpf_cnpj', $cnpj)
                ->update(array('verificado' => 1, 'token' => str_random(30)));
            $retorno = array('mensagem' => 'Conta ativada com sucesso!', 'mensagem1' => 'Agora você já pode se conectar utilizando seu login e senha.');
        } else if($resultado[0]->verificado === 1){
            $retorno = array('mensagem' => 'Esta conta já esta ativa em nosso sistema!', 'mensagem1' => 'Para acessar, utilize suas credênciais na tela de login.');
        } else {
            $retorno = array('mensagem' => 'Ocorreu um erro no sistema, contate nosso suporte para melhor auxiliá-lo!');
        }

        return $retorno;
    }

    public function emailSenha(Request $request){
        $usuario = $request->query->get('usuario');
        $user = DB::select(DB::raw("
            SELECT  *
            FROM users
            WHERE email = '$usuario'
        "));

        if($user[0]->tipo_usuario === 4){
            $retorno = array('mensagem' => 'Para redefinir sua senha, contate seu usuário master.');
        } else if($user[0]->tipo_usuario === 3){
            $cliente = Cliente::findOrFail($user[0]->id_cliente);
            $remember_token = str_random(10);

            //ATUALIZA REMEMBER TOKEN
            DB::table('users')
                ->where('id', $user[0]->id)
                ->update(array('remember_token' => $remember_token));

            //PREENCHE A VARIAVEL DATA COM UM ARRAY QUE SERA PASSADO PARA A FORMACAO DO EMAIL
            $data = array('nome' => $user[0]->name,'login'=> $user[0]->email ,'cnpj' => $cliente->cpf_cnpj, 'email' => $cliente->email_cobranca, 'token' => $remember_token);
            Mail::send('email/redefinir_senha', $data, function($message) use ($cliente) {
                $message->to($cliente->email_cobranca, $cliente->contato)->subject('Redefinir senha de acesso ao sistema Lince');
            });

            $retorno = array('mensagem' => 'Foi enviado um e-mail com as instruções para a redefinição da senha!');
        } else {
            $retorno = array('mensagem' => 'Ocorreu um erro no sistema, contate nosso suporte para melhor auxiliá-lo!');
        }

        return $retorno;
    }

    public function verificaToken(Request $request){
        $usuario = $request->query->get('usuario');
        $token = $request->query->get('token');
        $senha = $request->query->get('senha');


        $user = DB::select(DB::raw("
            SELECT  id,
                    CASE
                      WHEN remember_token != '$token' THEN 0
                      ELSE 1
                    END AS token
            FROM users
            WHERE email = '$usuario'
        "));

        if($user[0]->token === 1){
            //ATUALIZA SENHA
            DB::table('users')
                ->where('id', $user[0]->id)
                ->update(array('password' => Hash::make($senha)));
            $retorno = array('mensagem' => 'Valido', 'id' => $user[0]->id);
        } else {
            $retorno = array('mensagem' => 'Invalido');
        }

        return $retorno;
    }

}