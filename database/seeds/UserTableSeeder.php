<?php

/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 21:17
 */

use \Illuminate\Database\Seeder;

class UserTableSeeder extends Seeder
{
    public function run(){
        factory(\Lince\Entities\User::class,10)->create([
            'name' => 'Jonathan',
            'email' => 'jonathan@jhrdesenvolvimentos.com',
            'password' => bcrypt(123456),
            'remember_token' => str_random(10),
        ]);

        factory(\Lince\Entities\User::class,10)->create();
    }
}