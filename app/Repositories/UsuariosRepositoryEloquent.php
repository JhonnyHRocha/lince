<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 29/10/15
 * Time: 15:20
 */

namespace Lince\Repositories;


use Illuminate\Support\Facades\DB;
use Lince\Entities\Usuarios;
use Lince\Presenters\UsuariosPresenter;
use Prettus\Repository\Eloquent\BaseRepository;

class UsuariosRepositoryEloquent extends BaseRepository implements UsuariosRepository
{
    public function model(){
        return Usuarios::class;
    }

    public function presenter(){
        return UsuariosPresenter::class;
    }

    //BUSCA O USUARIO JUNTO AO ID DO CLIENTE E APLICA A PAGINAÇÃO
    public function findOwner($clienteID, $limit = null, $columns = array()){
        return $this->scopeQuery(function($query) use ($clienteID){

            return $query->select('users.*');
            //if($tipo_usuario === '3')
            //else
            //if($tipo_usuario == 1)
            //   return $query->select('users.*')->where('id_cliente', '=', $clienteID);

            //return $query->select('users.*')->where('id_cliente', '=', $clienteID);
        })->paginate($limit,$columns);
    }


    public function listagemUsuariosCliente($idUsuario){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$idUsuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1){
            return DB::select(DB::raw("
                SELECT	clientes.id, clientes.nome, clientes.cpf_cnpj, clientes.consultas_disponiveis, count(users.id) as quantidade_usuarios, (clientes.numero_usuarios - count(users.id)) as usuarios_disponiveis,
                        users.email
                FROM clientes
                LEFT JOIN users ON users.id_cliente = clientes.id
                GROUP BY clientes.id
                ORDER BY clientes.nome
            "));

        } elseif($tipo_usuario[0]->tipo_usuario === 2) {
            return DB::select(DB::raw("
                SELECT	clientes.id, clientes.nome, clientes.cpf_cnpj, clientes.consultas_disponiveis, count(users.id) as quantidade_usuarios, (clientes.numero_usuarios - count(users.id)) as usuarios_disponiveis,
                        users.email
                FROM clientes
                LEFT JOIN users ON users.id_cliente = clientes.id
                WHERE clientes.id_revendedor = $idUsuario
                GROUP BY clientes.id
                ORDER BY clientes.nome
            "));
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }

    public function isUsuario($clienteID){
        try{
            return DB::table('users')
                    ->select('users.id','name as nome', 'users.email', 'users.tipo_usuario','users.limite_consultas','clientes.numero_usuarios',
                                DB::raw('(CASE
                                            WHEN tipo_usuario = 1 THEN "Administrador"
                                            WHEN tipo_usuario = 2 THEN "Revendedor"
                                            WHEN tipo_usuario = 3 THEN "Usuário Master"
                                            WHEN tipo_usuario = 4 THEN "Usuário"
                                          END) AS tipo_usuario_label'),
                                DB::raw('(CASE
                                            WHEN users.status = 0 THEN "Inativo"
                                            WHEN users.status = 1 THEN "Ativo"
                                            WHEN users.status = 2 THEN "Bloqueado"
                                          END) AS status_label'),
                                'users.status','password', 'data_validade')
                    ->join('clientes', 'clientes.id', '=', 'users.id_cliente')
                    ->where(['id_cliente' => $clienteID])
                    ->get();
        } catch(Exception $e){
            return[
                'error' => $e->errorInfo
            ];
        }
        //return response()->json(['data' => $usuario->usuarios]);
    }

}