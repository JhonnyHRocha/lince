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


Route::get('/', function () {
    return view('app');
});

Route::post('oauth/access_token', function() {
    return Response::json(Authorizer::issueAccessToken());
});

Route::get('login', function () {
    return view('login');
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

    Route::group(['prefix' => 'cliente'], function() {
        Route::get('dashboard/{idUsuario}', 'ClienteController@selecionaClientesDashboard');
        Route::get('{id}/usuario', 'ClienteController@clienteUsuarios');
        Route::post('{id}/usuario', 'ClienteController@addClienteUsuario');
        Route::get('{id}/usuario/{usuarioID}', 'ClienteController@exibeClienteUsuario');
        Route::put('{id}/usuario/{usuarioID}', 'ClienteController@atualizaClienteUsuario');
        Route::delete('{id}/usuario/{usuarioID}', 'ClienteController@deletaClienteUsuario');
    });

    Route::group(['prefix' => 'venda'], function(){
        Route::get('vendas_cliente/{idCliente}', 'VendasController@selecionaVendasCliente');
    });




    //EXEMPLO DE CHECAGEM PELO middleware
    /*Route::group(['middleware' => 'CheckVendaOwner'], function(){
        Route::resource('venda', 'VendasController', ['except'=> ['create', 'edit']]);
    });*/

    /*Route::group(['prefix' =>'project'], function(){
        Route::resource('', 'ProjectController', ['except'=> ['create', 'edit']]);
    });*/
});


