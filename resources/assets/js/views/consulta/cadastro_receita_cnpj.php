<?php

require_once '../../../../vendor/autoload.php';

use JansenFelipe\CnpjGratis\CnpjGratis;
use Goutte\Client;


if(isset($_POST['captcha']) && isset($_POST['cookie']) && isset($_POST['cnpj'])){
    $dados = CnpjGratis::consulta($_POST['cnpj'], $_POST['captcha'], $_POST['cookie']);
    //var_dump($dados);
    header('Content-Type: application/json');
    echo json_encode($dados);
    die;
}else{
    $params = CnpjGratis::getParams();
    header('Content-Type: application/json');
    echo json_encode($params);
    //echo base64_encode($img);
}

?>