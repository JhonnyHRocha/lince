<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 08/10/15
 * Time: 20:39
 */

namespace Lince\Transformers;
use Lince\Entities\Cliente;
use League\Fractal\TransformerAbstract;

class ClienteTransformer extends TransformerAbstract
{
    public function transform(Cliente $cliente){
        return[
            'id'                => $cliente->id,
            'nome'              => $cliente->nome,
            'cpf_cnpj'          => $cliente->cpf_cnpj,
            'tipo_pessoa'       => $cliente->tipo_pessoa,
            'contato'           => $cliente->contato,
            'logradouro'        => $cliente->logradouro,
            'complemento'       => $cliente->complemento,
            'bairro'            => $cliente->bairro,
            'cidade'            => $cliente->cidade,
            'uf'                => $cliente->uf,
            'cep'               => $cliente->cep,
            'telefone_1'        => $cliente->telefone_1,
            'telefone_2'        => $cliente->telefone_2,
            'email'             => $cliente->email_cobranca,
            'skype'             => $cliente->skype,
        ];
    }
}