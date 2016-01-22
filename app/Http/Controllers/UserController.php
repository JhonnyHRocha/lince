<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Lince\Entities\User;
use Lince\Http\Requests;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class UserController extends Controller
{
    public function authenticated(){
        $idUser = Authorizer::getResourceOwnerId();
        return \Lince\Entities\User::find($idUser);
    }

    //REMOVE DA TABELA DE SESSOES A SESSÃO PARA ESTE USUARIO
    public function logout(){
        $idUser = Authorizer::getResourceOwnerId();
        DB::select(DB::raw("
            DELETE FROM oauth_sessions WHERE owner_id = $idUser
        "));
    }

    //VEROFICA SE USUARIO ESTA LOGADO PARA PROSSEGUIR COM O ACESSO
    public function checkSession(Request $request){
        $email = $request['us'];
        $password = $request['pw'];

        $u = User::where('email', $email)->first();
        if($u){
            if (Hash::check($password, $u->password))
            {
                if($u->logado === 1)
                    return 1;
                else
                    return 0;
            }
        }

        return 0;
    }
}
