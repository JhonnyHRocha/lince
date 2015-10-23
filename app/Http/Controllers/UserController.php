<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;
use LucaDegasperi\OAuth2Server\Facades\Authorizer;

class UserController extends Controller
{
    public function authenticated(){
        $idUser = Authorizer::getResourceOwnerId();
        return \Lince\Entities\User::find($idUser);
    }
}
