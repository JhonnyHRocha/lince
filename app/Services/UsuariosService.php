<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 14:20
 */

namespace Lince\Services;


use Illuminate\Support\Facades\Hash;
use Lince\Repositories\UsuariosRepository;
use Lince\Validators\UsuariosValidator;
use Prettus\Validator\Exceptions\ValidatorException;

class UsuariosService
{
    protected $repository;
    /**
     * @var UsuariosValidator
     */
    private $validator;

    public function __construct(UsuariosRepository $repository, UsuariosValidator $validator){
        $this->repository = $repository;
        $this->validator = $validator;
    }

    public function create(array $data){
        try{
            $this->validator->with($data)->passesOrFail();
            $data['password'] = Hash::make($data['password']);
            return $this->repository->create($data);
        } catch(ValidatorException $e) {
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

    public function update(array $data, $id){
        try{
            $this->validator->with($data)->passesOrFail();
            $data = array_except($data, ['password']);
            return $this->repository->update($data,$id);
        } catch(ValidatorException $e){
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

    public function senha(array $data, $id){
        try{
            $this->validator->with($data)->passesOrFail();
            $data['password'] = Hash::make($data['password']);
            //$data = array_get($data, ['password']);
            return $this->repository->update($data,$id);
        } catch(ValidatorException $e){
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

}