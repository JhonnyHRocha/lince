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


Route::group(['middleware'=>'oauth'], function(){

    Route::get('user/authenticated', 'UserController@authenticated');
    Route::resource('cliente', 'ClienteController', ['except'=> ['create', 'edit']]);
    Route::resource('revendedor', 'RevendedoresController', ['except'=> ['create', 'edit']]);
    Route::resource('venda', 'VendasController', ['except'=> ['create', 'edit']]);
    Route::resource('usuario', 'UsuariosController', ['except'=> ['create', 'edit']]);

    Route::group(['prefix' => 'cliente'], function() {
        Route::get('{id}/usuario', 'ClienteController@clienteUsuarios');
        Route::post('{id}/usuario', 'ClienteController@addClienteUsuario');
        Route::get('{id}/usuario/{usuarioID}', 'ClienteController@exibeClienteUsuario');
        Route::put('{id}/usuario/{usuarioID}', 'ClienteController@atualizaClienteUsuario');
        Route::delete('{id}/usuario/{usuarioID}', 'ClienteController@deletaClienteUsuario');
    });




    //EXEMPLO DE CHECAGEM PELO middleware
    /*Route::group(['middleware' => 'CheckVendaOwner'], function(){
        Route::resource('venda', 'VendasController', ['except'=> ['create', 'edit']]);
    });*/

    /*Route::group(['prefix' =>'project'], function(){
        Route::resource('', 'ProjectController', ['except'=> ['create', 'edit']]);
    });*/
});


