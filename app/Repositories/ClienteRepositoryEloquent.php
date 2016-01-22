<?php

namespace Lince\Repositories;

use Illuminate\Support\Facades\DB;
use Lince\Presenters\ClientePresenter;
use Prettus\Repository\Eloquent\BaseRepository;
use Lince\Entities\Cliente;


class ClienteRepositoryEloquent extends BaseRepository implements ClienteRepository
{
    public function model(){
        return Cliente::class;
    }

    public function presenter(){
        return ClientePresenter::class;
    }

    //BUSCA O CLIENTE JUNTO AO ID DO USUARIO E APLICA A PAGINAÇÃO
    public function findOwner($userId, $limit = null, $columns = array()){
        return $this->scopeQuery(function($query) use ($userId){
            return $query->select('clientes.*')->where('id_revendedor', '=', $userId);
        })->paginate($limit,$columns);
    }

    public function clienteDashboard($id_usuario){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$id_usuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1){
            return DB::select(DB::raw("
                SELECT  clientes.id,clientes.nome,clientes.cpf_cnpj,clientes.contato,clientes.logradouro,clientes.bairro,clientes.cidade,
                        clientes.uf,clientes.cep,clientes.telefone_1,clientes.telefone_2,clientes.email_cobranca,clientes.skype,clientes.numero_usuarios,
                        clientes.valor_mensal,clientes.data_contratacao,clientes.data_expiracao,clientes.consultas_disponiveis,revendedores.nome as revendedor,
                        (CASE WHEN clientes.status = 0 THEN 'Inativo'
                              WHEN clientes.status = 1 THEN 'Ativo'
                              WHEN clientes.status = 2 THEN 'Bloqueado' END) AS status,
                        (CASE WHEN clientes.status = 0 THEN 'default'
                              WHEN clientes.status = 1 THEN 'primary'
                              WHEN clientes.status = 2 THEN 'danger' END) AS cor_status
                FROM clientes
                JOIN revendedores ON revendedores.id = clientes.id_revendedor
            "));
        } elseif($tipo_usuario[0]->tipo_usuario === 2) {
            return DB::select(DB::raw("
                SELECT  clientes.id,clientes.nome,clientes.cpf_cnpj,clientes.contato,clientes.logradouro,clientes.bairro,clientes.cidade,
                        clientes.uf,clientes.cep,clientes.telefone_1,clientes.telefone_2,clientes.email_cobranca,clientes.skype,clientes.numero_usuarios,
                        clientes.valor_mensal,clientes.data_contratacao,clientes.data_expiracao,clientes.consultas_disponiveis,
                        (CASE WHEN clientes.status = 0 THEN 'Inativo'
                              WHEN clientes.status = 1 THEN 'Ativo'
                              WHEN clientes.status = 2 THEN 'Bloqueado' END) AS status
                FROM clientes
                WHERE clientes.id_revendedor = $id_usuario
            "));
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }

    /*
    public function clienteDashboard($idUsuario, $limit = null, $columns = array()){
        //VERIFICA O TIPO DE USUARIO E RETORNA O SELECT DE ACORDO COM O TIPO DE USUARIO DELE
        $tipo_usuario = DB::table('users')->select('users.tipo_usuario')->where('users.id','=',$idUsuario)->get();

        if($tipo_usuario[0]->tipo_usuario === 1){
            return $this->scopeQuery(function($query) use ($idUsuario){
                return $query->select('clientes.id','clientes.nome','clientes.cpf_cnpj','clientes.contato','clientes.logradouro','clientes.bairro','clientes.cidade',
                        'clientes.uf','clientes.cep','clientes.telefone_1','clientes.telefone_2','clientes.email_cobranca','clientes.skype','clientes.numero_usuarios',
                        'clientes.valor_mensal','clientes.data_contratacao','clientes.data_expiracao','clientes.consultas_disponiveis','revendedores.nome as revendedor',
                        DB::raw('(CASE WHEN clientes.status = 0 THEN "Inativo"
                                        WHEN clientes.status = 1 THEN "Ativo"
                                        WHEN clientes.status = 2 THEN "Bloqueado" END) AS status'),
                        DB::raw('(CASE WHEN clientes.status = 0 THEN "default"
                                        WHEN clientes.status = 1 THEN "primary"
                                        WHEN clientes.status = 2 THEN "danger" END) AS cor_status'))
                        ->join('revendedores','revendedores.id','=','clientes.id_revendedor');
            })->paginate($limit,$columns);

        } elseif($tipo_usuario[0]->tipo_usuario === 2) {
            return $this->scopeQuery(function($query) use ($idUsuario){
                return $query->select('clientes.id','clientes.nome','clientes.cpf_cnpj','clientes.contato','clientes.logradouro','clientes.bairro','clientes.cidade',
                            'clientes.uf','clientes.cep','clientes.telefone_1','clientes.telefone_2','clientes.email_cobranca','clientes.skype','clientes.numero_usuarios',
                            'clientes.valor_mensal','clientes.data_contratacao','clientes.data_expiracao','clientes.consultas_disponiveis',
                            DB::raw('(CASE WHEN clientes.status = 1 THEN "Ativo"
                                    WHEN clientes.status = 0 THEN "Inativo" END) AS status'))
                            ->where('clientes.id_revendedor','=',$idUsuario);
            })->paginate($limit,$columns);
        } else {
            return response()->json(['error' => 'Acesso Inválido']);
        }
    }
    */

}
