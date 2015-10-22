<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 14:20
 */

namespace Lince\Services;


use Lince\Repositories\ClienteRepository;
use Lince\Validators\ClienteValidator;
use Prettus\Validator\Exceptions\ValidatorException;

class ClienteService
{
    protected $repository;
    /**
     * @var ClienteValidator
     */
    private $validator;

    public function __construct(ClienteRepository $repository, ClienteValidator $validator){
        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function create(array $data){
        //enviar email
        //disparar notificacao
        //postar tweet
        //exemplos de aplicacao apos criar o cliente no banco de dados
        //alem de inserir no banco de dados, pode fazer algumas outras funcoes em cima da acao de criar

        try{
            $this->validator->with($data)->passesOrFail();
            return $this->repository->create($data);
        } catch(ValidatorException $e){
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

    public function update(array $data, $id){
        try{
            $this->validator->with($data)->passesOrFail();
            return $this->repository->update($data,$id);
        } catch(ValidatorException $e){
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

}