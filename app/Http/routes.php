<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use \Illuminate\Support\Facades\Mail;

Route::get('/', function () {
    return view('app');
});

Route::post('oauth/access_token', function() {
    return Response::json(Authorizer::issueAccessToken());
});

Route::get('boleto/{id}/', 'BoletoController@index');


Route::group(['prefix' => 'email'], function() {
    Route::post('cadastro/{id}', 'EmailController@emailCadastro');
    Route::get('cadastro', 'EmailController@confirmarCadastro');
    Route::get('senha', 'EmailController@emailSenha');
    Route::get('token', 'EmailController@verificaToken');
});

Route::get('confirmar', function () {
    return view('email/redefinir_senha');
});


//FUNCOES DE REGISTRO DO CLIENTE / USUARIO SEM SER PRECISO ESTAR LOGADO NO SISTEMA
Route::group(['prefix' => 'cliente'], function() {
    Route::get('cnpj/{cnpj}', 'ClienteController@verificaClienteExiste');
    Route::get('usuario/{login}', 'ClienteController@verificaUsuarioExiste');
    Route::post('novo', 'ClienteController@store'); //ADICIONA NOVO CLIENTE
    Route::post('{id}/novo_usuario', 'ClienteController@addClienteUsuario'); //ADICIONA NOVO USUARIO AO CLIENTE
});




Route::group(['middleware'=>'oauth'], function(){

    Route::get('user/authenticated', 'UserController@authenticated');
    Route::resource('cliente', 'ClienteController', ['except'=> ['create', 'edit']]);
    Route::resource('revendedor', 'RevendedoresController', ['except'=> ['create', 'edit']]);
    Route::resource('venda', 'VendasController', ['except'=> ['create', 'edit']]);
    Route::resource('usuario', 'UsuariosController', ['except'=> ['create', 'edit']]);
    //Route::resource('boleto/{id}/', 'BoletoController@index');

    Route::group(['prefix' => 'inicio'], function() {
        Route::get('vendas', 'InicioController@vendasUltimosMeses');
        Route::get('cliente_status/{usuarioID}', 'InicioController@clienteStatus');
        Route::get('ranking_vendas/{usuarioID}', 'InicioController@rankingVendas');
        Route::get('historico_vendas/{clienteID}', 'InicioController@historicoVendasCliente');
        Route::get('dados_geral/{clienteID}', 'InicioController@dadosGeralCliente');
        Route::get('consultas_usuarios/{clienteID}', 'InicioController@rankingConsultasUsuarios');
        Route::get('ultimas_consultas/{clienteID}', 'InicioController@ultimasConsultas');
    });

    Route::group(['prefix' => 'cliente'], function() {
        Route::get('dashboard/{idUsuario}', 'ClienteController@selecionaClientesDashboard');
        Route::get('listagem/{usuarioID}', 'ClienteController@clienteListagem');
        Route::post('{id}/usuario', 'ClienteController@addClienteUsuario');
        Route::get('{id}/usuario/{usuarioID}', 'ClienteController@exibeClienteUsuario');
        Route::put('{id}/usuario/{usuarioID}', 'ClienteController@atualizaClienteUsuario');
        Route::delete('{id}/usuario/{usuarioID}', 'ClienteController@deletaClienteUsuario');
    });

    Route::group(['prefix' => 'usuario'], function(){
        Route::get('listagem/usuarios_clientes', 'UsuariosController@listagemUsuariosCliente');
        Route::get('cliente/{id}', 'UsuariosController@clienteUsuarios');
        Route::get('disponiveis/{id}', 'UsuariosController@usuariosDisponiveis');
        Route::put('cliente/{id}', 'UsuariosController@atualizaUsuario');
        Route::put('atualiza_senha/{id}', 'UsuariosController@atualizaSenha');
    });

    Route::group(['prefix' => 'venda'], function(){
        Route::get('vendas_cliente/{idCliente}', 'VendasController@selecionaVendasCliente');
        Route::get('soma_valores/geral', 'VendasController@somaValores');
        Route::put('credito/{idCliente}', 'VendasController@creditoCliente');
    });

    Route::group(['prefix' => 'relatorio'], function() {
        Route::get('consultas', 'RelatoriosController@consultas');
        Route::get('vendas', 'RelatoriosController@vendas');
    });

    Route::group(['prefix' => 'consulta'], function() {
        Route::post('cpf_cnpj', 'ConsultasController@cpf_cnpj');
        Route::get('email', 'ConsultasController@email');
    });


    //EXEMPLO DE CHECAGEM PELO middleware
    /*Route::group(['middleware' => 'CheckVendaOwner'], function(){
        Route::resource('venda', 'VendasController', ['except'=> ['create', 'edit']]);
    });*/

    /*Route::group(['prefix' =>'project'], function(){
        Route::resource('', 'ProjectController', ['except'=> ['create', 'edit']]);
    });*/
});


