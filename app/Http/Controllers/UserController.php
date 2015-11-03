<?php

namespace Lince\Http\Controllers;

use Lince\Http\Requests;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class UserController extends Controller
{
    public function authenticated(){
        $idUser = Authorizer::getResourceOwnerId();
        return \Lince\Entities\User::find($idUser);
    }
}
