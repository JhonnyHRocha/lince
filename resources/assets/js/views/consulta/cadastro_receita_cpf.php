<?php

    require_once '../../../../vendor/autoload.php';

    use JansenFelipe\CpfGratis\CpfGratis;

    if(isset($_POST['captcha']) && isset($_POST['cookie']) && isset($_POST['cpf']) && isset($_POST['data_nascimento'])){
        $dados = CpfGratis::consulta($_POST['cpf'], $_POST['data_nascimento'], $_POST['captcha'], $_POST['cookie']);
        echo json_encode($dados);//
        die;
    } else {
        $params = CpfGratis::getParams();
        header('Content-Type: application/json');
        echo json_encode($params);
    }

?>



