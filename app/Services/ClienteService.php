<?php
/**
 * Created by PhpStorm.
 * User: Jonathan
 * Date: 07/10/15
 * Time: 14:20
 */

namespace Lince\Services;


use Illuminate\Support\Facades\Hash;
use Lince\Repositories\ClienteRepository;
use Lince\Repositories\UsuariosRepository;
use Lince\Validators\ClienteValidator;
use Lince\Validators\UsuariosValidator;
use Mockery\CountValidator\Exception;
use Prettus\Validator\Exceptions\ValidatorException;
use JansenFelipe\CnpjGratis\CnpjGratis;

class ClienteService
{
    /**
     * @var ClienteRepository
     */
    protected $repository;
    /**
     * @var ClienteValidator
     */
    private $clienteValidator;
    /**
     * @var UsuariosRepository
     */
    private $usuarioRepository;
    /**
     * @var UsuariosValidator
     */
    private $usuarioValidator;


    /**
     * @param ClienteRepository $repository
     * @param ClienteValidator $clienteValidator
     * @param UsuariosRepository $usuarioRepository
     * @param UsuariosValidator $usuarioValidator
     */
    public function __construct(ClienteRepository $repository,
                                ClienteValidator $clienteValidator,
                                UsuariosRepository $usuarioRepository,
                                UsuariosValidator $usuarioValidator){
        $this->repository = $repository;
        $this->clienteValidator = $clienteValidator;
        $this->usuarioRepository = $usuarioRepository;
        $this->usuarioValidator = $usuarioValidator;
    }

    public function create(array $data){
        //enviar email
        //disparar notificacao
        //postar tweet
        //exemplos de aplicacao apos criar o cliente no banco de dados
        //alem de inserir no banco de dados, pode fazer algumas outras funcoes em cima da acao de criar

        try{
            $this->clienteValidator->with($data)->passesOrFail();
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
            $this->clienteValidator->with($data)->passesOrFail();
            return $this->repository->update($data,$id);
        } catch(ValidatorException $e){
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

    public function addUsuario(array $data){
        try{
            $this->usuarioValidator->with($data)->passesOrFail();
            $data['password'] = Hash::make($data['password']);
            return $this->usuarioRepository->create($data);
        } catch(ValidatorException $e) {
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

    public function removeUsuario($clienteID, $usuarioID){
        try{
            //$usuario = $this->usuarioRepository->skipPresenter()->findWhere(['id' => $usuarioID]);
            //return $usuario->delete();
            return $this->usuarioRepository->delete($usuarioID);
        } catch(Exception $e){
            return[
                'error' => $e->errorInfo
            ];
        }
    }

    public function exibeTodosUsuarios(){
        try{
            return $this->usuarioRepository->all();
        } catch(Exception $e){
            return[
                'error' => $e->errorInfo
            ];
        }
    }

    public function atualizaUsuario(array $data, $usuarioID){
        try{
            $this->usuarioValidator->with($data)->passesOrFail();
            //if(str_contains(array_get($data, 'password'), '$2y$10$')){
            //    $data['password'] = Hash::make($data['password']);
            //}
            //REMOVE O CAMPO DE SENHA DESTA ROTA
            $data = array_except($data, ['password']);
            return $this->usuarioRepository->update($data,$usuarioID);
        } catch(ValidatorException $e){
            return[
                'error' => true,
                'message' => $e->getMessageBag()
            ];
        }
    }

}