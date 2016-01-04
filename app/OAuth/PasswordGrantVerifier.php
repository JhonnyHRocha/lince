<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 21:10
 */

namespace Lince\OAuth;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Request;

class PasswordGrantVerifier
{
    public function verify($username, $password)
    {
        $credentials = [
            'email'    => $username,
            'password' => $password,
        ];

        if (Auth::once($credentials)) {
            $ip_acesso = Request::ip();
            $id_usuario = Auth::user()->id;
            $id_cliente = Auth::user()->id_cliente;

            DB::select(DB::raw("
                INSERT INTO historico_login (id_cliente, id_usuario, login, ip, data_hora)
                VALUES ('$id_usuario','$id_cliente','$username','$ip_acesso',NOW());
            "));

            return Auth::user()->id;
        }

        return false;
    }
}