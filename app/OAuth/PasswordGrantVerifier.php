<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 21:10
 */

namespace Lince\OAuth;

use Illuminate\Support\Facades\Auth;

class PasswordGrantVerifier
{
    public function verify($username, $password)
    {
        $credentials = [
            'email'    => $username,
            'password' => $password,
        ];

        if (Auth::once($credentials)) {
            return Auth::user()->id;
        }

        return false;
    }
}