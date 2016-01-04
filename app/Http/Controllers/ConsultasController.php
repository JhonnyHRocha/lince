<?php

namespace Lince\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\View;
use Lince\Http\Requests;
use Lince\Http\Controllers\Controller;
use phpDocumentor\Reflection\DocBlock\Tag\ReturnTag;

class ConsultasController extends Controller
{
    //VERIFICA SE O CPF / CNPJ JA FOI CONSULTADO NO CB, RETORNANDO A QUANTIDADE DE REGISTROS CONTIDA NA TABELA DE VERIFICACAO
    public function verificaConsultaDados(Request $request){
        $cpf_consulta = $request['cpf_cnpj'];
        $resultado = DB::connection('mysql2')->select(DB::raw("
            SELECT COUNT(*) AS contagem FROM consulta_cb
            WHERE cpf_cnpj LIKE '$cpf_consulta'
        "));
        return $resultado;
    }

    //SALVA O RETORNO DA CONSULTA DO CCBUSCA VINDA DA VIEW/SCRIPT PARA SALVAR NAS RESPECTIVAS TABELAS TEMPORARIAS NO BANCO DE DADOS
    //VERIFICA SE A CHAVE PAI EXISTE E EM CASO NEGATIVO ENTRA NA ACAO TRY CATCH, IGNORANDO O INSERT VAZIO
    public function consultaDados(Request $request){
        $array = json_decode($request['array'],true);
        $cpf_consulta = $request['cpf_cnpj'];

        try{
            foreach($array['cadastro'] as $i => $v)
            {
                $sexo = null;
                $nome = $v['nome'];
                $cpf = $v['cpf'];
                $dtnascimento = $v['dtnascimento'];
                if($v['sexo'] == 1)
                    $sexo = 'M';
                else if($v['sexo'] == 2)
                    $sexo = 'F';
                else if($v['sexo'] == 3)
                    $sexo = 'M';
                $nomemae = $v['nomemae'];
                DB::connection('mysql2')->select(DB::raw("
                    INSERT IGNORE INTO temp_dadospessoais(cpf_cnpj,nome,datanascimento,sexo,nome_mae,cad_origem)
                    VALUES('$cpf','$nome','$dtnascimento','$sexo','$nomemae','CB');
                "));
            }
        } catch(\Exception $e){ }

        try{
            foreach($array['veiculos'] as $i => $v)
            {
                $cpf = $v['cpf'];
                $placa = $v['placa'];
                $renavan = $v['renavan'];
                $chassi = $v['chassi'];
                $ano_fab = $v['anofab'];
                $ano_mod = $v['anomod'];
                $modelo = $v['modelo'];
                $tipo = $v['tipo'];
                $especie = $v['especie'];
                $combustivel = $v['combustivel'];

                DB::connection('mysql2')->select(DB::raw("
                    INSERT IGNORE INTO temp_dadosveiculos(cpf_cnpj,placa,renavan,chassi,ano_fab,ano_mod,modelo,tipo,especie,combustivel)
                    VALUES('$cpf','$placa','$renavan','$chassi','$ano_fab','$ano_mod','$modelo','$tipo','$especie','$combustivel');
                "));
            }
        } catch(\Exception $e){ }

        try{
            foreach($array['enderecos'] as $i => $v)
            {
                $logradouro = $v['logradouro'];
                $numero= $v['num'];
                $complemento = $v['complemento'];
                $bairro = $v['bairro'];
                $cidade = $v['cidade'];
                $cep = $v['cep'];
                $uf= $v['uf'];

                DB::connection('mysql2')->select(DB::raw("
                    INSERT IGNORE INTO temp_dadosendereco (cpf_cnpj, logradouro, numero, complemento, bairro, cep, cidade, uf)
                    VALUES ('$cpf_consulta', '$logradouro', '$numero', '$complemento', '$bairro', '$cep', '$cidade', '$uf');
                "));
            }
        } catch(\Exception $e){ }

        try{
            foreach($array['telefones'] as $i => $v)
            {
                $ddd = $v['ddd'];
                $telefone= $v['telefone'];

                DB::connection('mysql2')->select(DB::raw("
                    INSERT IGNORE INTO temp_dadostelefone (cpf_cnpj, ddd, telefone, telefoneddd)
                    VALUES ('$cpf_consulta', '$ddd', '$telefone', CONCAT('$ddd','$telefone'));
                "));
            }
        } catch(\Exception $e){ }

        try{
            foreach($array['emails'] as $i => $v)
            {
                $email = $v['email'];

                DB::connection('mysql2')->select(DB::raw("
                    INSERT IGNORE INTO temp_dadosemail (cpf_cnpj, email)
                    VALUES ('$cpf_consulta', '$email');
                "));
            }
        } catch(\Exception $e){ }

        try{
            foreach($array['empresas'] as $i => $v)
            {
                $cnpj = $v['cnpj'];
                $nome = $v['nome'];
                $qualificacao = $v['qualificacao'];

                DB::connection('mysql2')->select(DB::raw("
                    INSERT IGNORE INTO temp_empresas (cpf, cnpj, nome, qualificacao)
                    VALUES ('$cpf_consulta', '$cnpj', '$nome', '$qualificacao');
                "));
            }
        } catch(\Exception $e){ }

        DB::connection('mysql2')->select(DB::raw("
            INSERT IGNORE INTO consulta_cb (cpf_cnpj,data_hora)
            VALUES ('$cpf_consulta', NOW());
        "));

        //return $array;
    }


    //CONSULTA CPF CNPJ PARA EXIBICAO NA TELA DE RESULTADOS DA CONSULTA
    public function consultaCPFCNPJ(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];
        $id_usuario = $request['usuario'];
        $id_cliente = $request['cliente'];

        $resultado = DB::connection('mysql2')->select(DB::raw("
            SELECT  cpf_cnpj,
                    nome
            FROM t_dadospessoais
            WHERE cpf_cnpj = '$cpf_cnpj'
            UNION
            SELECT  cpf_cnpj,
                    nome
            FROM temp_dadospessoais
            WHERE cpf_cnpj = '$cpf_cnpj'
        "));

        $contagem_resultados = count($resultado);
        DB::select(DB::raw("
            INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
            VALUES ($id_usuario, $id_cliente, '$cpf_cnpj', 0, '$contagem_resultados' , NOW())
        "));


        return $resultado;
    }


    //CONSULTA GERAL ATRAVES DO CPF_CNPJ PARA EXIBICAO NA TELA DE RESULTADOS DO CADASTRO SELECIONADO
    public function cpf_cnpj(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];

        $dados_pessoais = DB::connection('mysql2')->select(DB::raw("
            SELECT	a.id,
                    a.cpf_cnpj,
                    a.nome,
                    a.datanascimento,
                    a.sexo,
                    CASE
                        WHEN a.situacao_cadastral IS NULL THEN b.situacao_cadastral
                        ELSE a.situacao_cadastral
                    END AS situacao_cadastral,
                    CASE
                        WHEN a.digito_verificador IS NULL THEN b.digito_verificador
                        ELSE a.digito_verificador
                    END AS digito_verificador,
                    CASE
                        WHEN a.data_inscricao IS NULL THEN b.data_inscricao
                        ELSE a.data_inscricao
                    END AS data_inscricao,
                    CASE
                        WHEN a.comprovante IS NULL THEN b.comprovante
                        ELSE a.comprovante
                    END AS comprovante,
                    CASE
                        WHEN a.data_consulta IS NULL THEN b.data_consulta
                        ELSE a.data_consulta
                    END AS data_consulta
            FROM t_dadospessoais a
            LEFT JOIN temp_situacao b ON a.cpf_cnpj = b.cpf_cnpj
            WHERE a.cpf_cnpj = $cpf_cnpj
            LIMIT 50
            UNION
            SELECT	a.id,
                    a.cpf_cnpj,
                    a.nome,
                    a.datanascimento,
                    a.sexo,
                    b.situacao_cadastral AS situacao_cadastral,
                    b.digito_verificador AS digito_verificador,
                    b.data_inscricao AS data_inscricao,
                    b.comprovante AS comprovante,
                    b.data_consulta AS data_consulta
            FROM temp_dadospessoais a
            LEFT JOIN temp_situacao b ON a.cpf_cnpj = b.cpf_cnpj
            WHERE a.cpf_cnpj = $cpf_cnpj
            LIMIT 50
        "));

        $dados_email = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT	email
            FROM t_dadosemail
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 10
            UNION DISTINCT
            SELECT DISTINCT	email
            FROM temp_dadosemail
            WHERE cpf_cnpj = $cpf_cnpj
        "));

        $dados_telefone = DB::connection('mysql2')->select(DB::raw("
            SELECT	DISTINCT
                    t_dadostelefone.cpf_cnpj,
                    t_dadostelefone.ddd,
                    t_dadostelefone.telefone,
                    t_dadostelefone.telefoneddd,
                    CASE
                        WHEN temp_operadora.operadora LIKE 'Numero nÃo encontrad' THEN 'Não encontrado'
                        ELSE temp_operadora.operadora
                    END AS operadora,
                    temp_operadora.portado
            FROM t_dadostelefone
            LEFT JOIN temp_operadora ON t_dadostelefone.telefoneddd = temp_operadora.telefone
            WHERE t_dadostelefone.cpf_cnpj = $cpf_cnpj
            LIMIT 50
            UNION DISTINCT
            SELECT	DISTINCT
                    temp_dadostelefone.cpf_cnpj,
                    temp_dadostelefone.ddd,
                    temp_dadostelefone.telefone,
                    temp_dadostelefone.telefoneddd,
                    CASE
                        WHEN temp_operadora.operadora LIKE 'Numero nÃo encontrad' THEN 'Não encontrado'
                        ELSE temp_operadora.operadora
                    END AS operadora,
                    temp_operadora.portado
            FROM temp_dadostelefone
            LEFT JOIN temp_operadora ON temp_dadostelefone.telefoneddd = temp_operadora.telefone
            WHERE temp_dadostelefone.cpf_cnpj = $cpf_cnpj
            LIMIT 50
        "));

        $dados_endereco = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT cpf_cnpj,
                            logradouro,
                            numero,
                            complemento,
                            bairro,
                            cep,
                            cidade,
                            uf
            FROM t_dadosendereco
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 50
            UNION DISTINCT
            SELECT DISTINCT cpf_cnpj,
                            logradouro,
                            numero,
                            complemento,
                            bairro,
                            cep,
                            cidade,
                            uf
            FROM temp_dadosendereco
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 50
        "));

        $dados_mae = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT	nome_mae
            FROM t_dadosmae
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 1
            UNION DISTINCT
            SELECT DISTINCT	nome_mae
            FROM temp_dadospessoais
            WHERE cpf_cnpj = $cpf_cnpj
            LIMIT 1
        "));

        $dados_veiculo = DB::connection('mysql2')->select(DB::raw("
            SELECT	cpf_cnpj,
                    placa,
                    renavan,
                    chassi,
                    ano_fab,
                    ano_mod,
                    modelo,
                    A.descricao AS tipo,
                    B.descricao AS especie,
                    C.descricao AS combustivel
            FROM temp_dadosveiculos
            LEFT JOIN codigos_detran A ON A.estilo like 'tipo' AND A.codigo = tipo
            LEFT JOIN codigos_detran B ON B.estilo like 'especie' AND B.codigo = especie
            LEFT JOIN codigos_detran C ON C.estilo like 'combustivel' AND C.codigo = combustivel
            WHERE cpf_cnpj = $cpf_cnpj
        "));

        return Response::json(array('dados_pessoais' => $dados_pessoais, 'dados_email' => $dados_email, 'dados_telefone' => $dados_telefone,
                                    'dados_endereco' => $dados_endereco, 'dados_mae' => $dados_mae, 'dados_veiculo' => $dados_veiculo));
    }

    //ENCONTRA OS POSSÍVEIS VIZINHOS DO CADASTRO
    public function possiveisVizinhos(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];
        $cep = $request['cep'];

        $arrayVariaveis = array();
        $variavel = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT cpf_cnpj
            FROM t_dadosendereco
            WHERE CEP LIKE '$cep'
            AND cpf_cnpj != '$cpf_cnpj'
            LIMIT 10
        "));

        if($variavel == [])
            return array('length' => 0);

        foreach ($variavel as $i => $value) {
            array_push($arrayVariaveis, $variavel[$i]->cpf_cnpj);
        }

        $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');

        $sql = " SELECT cpf_cnpj, nome
            FROM t_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString} )";

        $resultado = DB::connection('mysql2')->select($sql, $arrayVariaveis);

        return $resultado;
    }


    //ATUALIZA A OPERADORA DO TELEFONE E SE O MESMO FEZ PORTABILIDADE
    public function atualizaOperadora(Request $request){
        $telefone = $request['telefone'];
        $cpf_cnpj = $request['cpf_cnpj'];
        $operadora = $request['operadora'];
        $portabilidade = $request['portabilidade'];

        DB::connection('mysql2')->select(DB::raw("
            INSERT IGNORE INTO temp_operadora (telefone, cpf_cnpj, operadora, portado)
            VALUES ('$telefone', '$cpf_cnpj' ,'$operadora', '$portabilidade');
        "));
    }

    //PEGA TODOS OS TELEFONES DAQUELE CPF - CNPJ
    public function telefones(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];

        $dados_telefone = DB::connection('mysql2')->select(DB::raw("
            SELECT	DISTINCT
                    t_dadostelefone.cpf_cnpj,
                    t_dadostelefone.ddd,
                    t_dadostelefone.telefone,
                    t_dadostelefone.telefoneddd,
                    CASE
                        WHEN temp_operadora.operadora LIKE 'Numero nÃo encontrad' THEN 'Não encontrado'
                        ELSE temp_operadora.operadora
                    END AS operadora,
                    temp_operadora.portado
            FROM t_dadostelefone
            LEFT JOIN temp_operadora ON t_dadostelefone.telefoneddd = temp_operadora.telefone
            WHERE t_dadostelefone.cpf_cnpj = $cpf_cnpj
            LIMIT 50
            UNION DISTINCT
            SELECT	DISTINCT
                    temp_dadostelefone.cpf_cnpj,
                    temp_dadostelefone.ddd,
                    temp_dadostelefone.telefone,
                    temp_dadostelefone.telefoneddd,
                    CASE
                        WHEN temp_operadora.operadora LIKE 'Numero nÃo encontrad' THEN 'Não encontrado'
                        ELSE temp_operadora.operadora
                    END AS operadora,
                    temp_operadora.portado
            FROM temp_dadostelefone
            LEFT JOIN temp_operadora ON temp_dadostelefone.telefoneddd = temp_operadora.telefone
            WHERE temp_dadostelefone.cpf_cnpj = $cpf_cnpj
            LIMIT 50
        "));

        return $dados_telefone;
    }

    //ATUALIZA A SITUACAO DO CPF NA TABELA
    public function sitacaoCPF(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];
        $nome = $request['nome'];
        $situacao_cadastral = $request['situacao_cadastral'];
        $digito_verificador = $request['digito_verificador'];
        $data_inscricao = $request['data_inscricao'];
        $comprovante = $request['comprovante'];
        $data_consulta = $request['data_consulta'];

        $dados_telefone = DB::connection('mysql2')->select(DB::raw("
            INSERT INTO temp_situacao (cpf_cnpj, nome, situacao_cadastral, digito_verificador, data_inscricao, comprovante, data_consulta)
            VALUES ('$cpf_cnpj', '$nome', '$situacao_cadastral', '$digito_verificador', '$data_inscricao', '$comprovante', '$data_consulta')
            ON DUPLICATE KEY UPDATE situacao_cadastral='$situacao_cadastral', comprovante='$comprovante', data_consulta='$data_consulta';
        "));

        return $dados_telefone;
    }

    //CONSULTA DE CADASTROS PELO EMAIL
    public function consultaEmail(Request $request){
        $email = $request['email'];
        $id_usuario = $request['usuario'];
        $id_cliente = $request['cliente'];

        $arrayVariaveis = array();
        $variavel = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT cpf_cnpj
            FROM t_dadosemail
            WHERE email LIKE '$email%'
            LIMIT 10
            UNION DISTINCT
            SELECT DISTINCT cpf_cnpj
            FROM temp_dadosemail
            WHERE email LIKE '$email%'
        "));

        if($variavel == []){
            DB::select(DB::raw("
                INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                VALUES ($id_usuario, $id_cliente, '$email', 1, '0' , NOW())
            "));
            return array('length' => 0);
        }

        foreach ($variavel as $i => $value) {
            array_push($arrayVariaveis, $variavel[$i]->cpf_cnpj);
        }

        $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');

        $sql = " SELECT cpf_cnpj, nome
            FROM t_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString} )";

        $resultado = DB::connection('mysql2')->select($sql, $arrayVariaveis);

        $contagem_resultados = count($resultado);
        DB::select(DB::raw("
            INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
            VALUES ($id_usuario, $id_cliente, '$email', 1, '$contagem_resultados' , NOW())
        "));

        return $resultado;
    }

    //CONSULTA DE CADASTROS PELO TELEFONE
    public function consultaTelefone(Request $request){
        $telefone = $request['numero'];
        $id_usuario = $request['usuario'];
        $id_cliente = $request['cliente'];

        $arrayVariaveis = array();
        $variavel = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT cpf_cnpj
            FROM t_dadostelefone
            WHERE telefoneddd = '$telefone'
            UNION DISTINCT
            SELECT DISTINCT cpf_cnpj
            FROM temp_dadostelefone
            WHERE telefoneddd = '$telefone'
        "));

        if($variavel == []){
            DB::select(DB::raw("
                INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                VALUES ($id_usuario, $id_cliente, '$telefone', 2, '0' , NOW())
            "));
            return array('length' => 0);
        }


        foreach ($variavel as $i => $value) {
            array_push($arrayVariaveis, $variavel[$i]->cpf_cnpj);
        }

        $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');

        $sql = " SELECT cpf_cnpj, nome
            FROM t_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString} )";

        $resultado = DB::connection('mysql2')->select($sql, $arrayVariaveis);

        $contagem_resultados = count($resultado);
        DB::select(DB::raw("
            INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
            VALUES ($id_usuario, $id_cliente, '$telefone', 2, '$contagem_resultados' , NOW())
        "));

        return $resultado;
    }

    //CONSULTA DE CADASTROS PELA PLACA DO CARRO OU TELEFONE
    public function consultaVeiculo(Request $request){
        $placa = str_replace('-','', $request['placa']);
        $renavan = $request['renavan'];
        $id_usuario = $request['usuario'];
        $id_cliente = $request['cliente'];
        $query = '';

        if($placa != null)
            $query = $query . " AND placa LIKE '$placa' ";
        if($renavan != null)
            $query = $query . " AND renavan LIKE '$renavan' ";

        $arrayVariaveis = array();
        $variavel = DB::connection('mysql2')->select(DB::raw("
            SELECT DISTINCT cpf_cnpj
            FROM temp_dadosveiculos
            WHERE 1 = 1 $query
        "));

        if($variavel == []){
            DB::select(DB::raw("
                INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                VALUES ($id_usuario, $id_cliente, 'P:$placa - R:$renavan', 3, '0' , NOW())
            "));
            return array('length' => 0);
        }


        foreach ($variavel as $i => $value) {
            array_push($arrayVariaveis, $variavel[$i]->cpf_cnpj);
        }

        $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');
        $bindingsString2 = trim( str_repeat('?,', count($arrayVariaveis)), ',');

        $sql = " SELECT DISTINCT cpf_cnpj, nome
            FROM t_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString} )";

        $sql1 = " SELECT DISTINCT cpf_cnpj, nome
            FROM temp_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString2} )";

        $resultado = DB::connection('mysql2')->select($sql, $arrayVariaveis);
        $resultado2 = DB::connection('mysql2')->select($sql1, $arrayVariaveis);

        $resultado_final = array_merge($resultado, $resultado2);

        $uniqueArray = $this->arrayUnique($resultado_final);

        $contagem_resultados = count($uniqueArray);
        DB::select(DB::raw("
            INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
            VALUES ($id_usuario, $id_cliente, 'P:$placa - R:$renavan', 3, '$contagem_resultados' , NOW())
        "));


        return $uniqueArray;
    }

    public function consultaNome(Request $request){
        $nome = $request['nome'];
        $cidade = $request['cidade'];
        $uf = $request['uf'];
        $cep = $request['cep'];
        $id_usuario = $request['usuario'];
        $id_cliente = $request['cliente'];
        $query = '';

        if($cidade != null)
            $query = $query . " AND cidade LIKE '$cidade%' ";
        if($uf != null)
            $query = $query . " AND uf LIKE '$uf%' ";
        if($cep != null)
            $query = $query . " AND cep LIKE '$cep%' ";

        if($cidade != null || $uf != null || $cep != null){
            $arrayVariaveis = array();
            $variavel = DB::connection('mysql2')->select(DB::raw("
                SELECT DISTINCT cpf_cnpj
                FROM t_dadosendereco
                WHERE 1 = 1 $query
                UNION DISTINCT
                SELECT DISTINCT cpf_cnpj
                FROM temp_dadosendereco
                WHERE 1 = 1 $query
            "));

            if($variavel == []){
                DB::select(DB::raw("
                    INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                    VALUES ($id_usuario, $id_cliente, 'N:$nome - C:$cidade - U:$uf - C:$cep', 4, '0' , NOW())
                "));
                return array('length' => 0);
            }

            foreach ($variavel as $i => $value) {
                array_push($arrayVariaveis, $variavel[$i]->cpf_cnpj);
            }

            $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');

            $sql = " SELECT DISTINCT cpf_cnpj, nome
            FROM t_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString} )
            AND nome LIKE '$nome%' ";
            $resultado = DB::connection('mysql2')->select($sql, $arrayVariaveis);


            $contagem_resultados = count($resultado);
            DB::select(DB::raw("
                INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                VALUES ($id_usuario, $id_cliente, 'N:$nome - C:$cidade - U:$uf - C:$cep', 4, '$contagem_resultados' , NOW())
            "));

            return $resultado;
        } else {
            $resultado = DB::connection('mysql2')->select(DB::raw("
                SELECT DISTINCT cpf_cnpj, nome
                FROM t_dadospessoais
                WHERE nome LIKE '$nome%'
                UNION DISTINCT
                SELECT DISTINCT cpf_cnpj, nome
                FROM temp_dadospessoais
                WHERE nome LIKE '$nome%'
            "));

            $contagem_resultados = count($resultado);
            DB::select(DB::raw("
                INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                VALUES ($id_usuario, $id_cliente, 'N:$nome', 4, '$contagem_resultados' , NOW())
            "));

            return $resultado;
        }
    }

    public function consultaEndereco(Request $request){
        $logradouro = $request['logradouro'];
        $cidade = $request['cidade'];
        $uf = $request['uf'];
        $cep = $request['cep'];
        $id_usuario = $request['usuario'];
        $id_cliente = $request['cliente'];
        $query = '';

        if($logradouro != null)
            $query = $query . " AND logradouro LIKE '$logradouro%' ";
        if($cidade != null)
            $query = $query . " AND cidade LIKE '$cidade%' ";
        if($uf != null)
            $query = $query . " AND uf LIKE '$uf%' ";
        if($cep != null)
            $query = $query . " AND cep LIKE '$cep%' ";

        $arrayVariaveis = array();
        $variavel = DB::connection('mysql2')->select(DB::raw("
                SELECT DISTINCT cpf_cnpj
                FROM t_dadosendereco
                WHERE 1 = 1 $query
                LIMIT 50
                UNION DISTINCT
                SELECT DISTINCT cpf_cnpj
                FROM temp_dadosendereco
                WHERE 1 = 1 $query
                LIMIT 50
            "));

        if($variavel == [])
            return array('length' => 0);

        foreach ($variavel as $i => $value) {
            array_push($arrayVariaveis, $variavel[$i]->cpf_cnpj);
        }

        $bindingsString = trim( str_repeat('?,', count($arrayVariaveis)), ',');

        $sql = " SELECT DISTINCT cpf_cnpj, nome
            FROM t_dadospessoais
            WHERE cpf_cnpj IN ( {$bindingsString} )
            LIMIT 50 ";
        $resultado = DB::connection('mysql2')->select($sql, $arrayVariaveis);

        $contagem_resultados = count($resultado);
        DB::select(DB::raw("
                INSERT INTO consultas(id_usuario,id_cliente,parametros,tipo_consulta,status,data_consulta)
                VALUES ($id_usuario, $id_cliente, 'L:$logradouro - C:$cidade - U:$uf - C:$cep', 5, '$contagem_resultados' , NOW())
            "));

        return $resultado;
    }


    //FUNCAO PARA REMOVER AS CHAVES DUPLICADAS DE UM ARRAY
    public function arrayUnique($array, $preserveKeys = false)
    {
        // Unique Array for return
        $arrayRewrite = array();
        // Array with the md5 hashes
        $arrayHashes = array();
        foreach($array as $key => $item) {
            // Serialize the current element and create a md5 hash
            $hash = md5(serialize($item));
            // If the md5 didn't come up yet, add the element to
            // to arrayRewrite, otherwise drop it
            if (!isset($arrayHashes[$hash])) {
                // Save the current element hash
                $arrayHashes[$hash] = $hash;
                // Add element to the unique Array
                if ($preserveKeys) {
                    $arrayRewrite[$key] = $item;
                } else {
                    $arrayRewrite[] = $item;
                }
            }
        }
        return $arrayRewrite;
    }

    /*
    public function sitacaoCNPJ(Request $request){
        $cpf_cnpj = $request['cpf_cnpj'];
        $nome = $request['nome'];
        $situacao_cadastral = $request['situacao_cadastral'];
        $digito_verificador = $request['digito_verificador'];
        $data_inscricao = $request['data_inscricao'];
        $comprovante = $request['comprovante'];
        $data_consulta = $request['data_consulta'];

        $dados_telefone = DB::connection('mysql2')->select(DB::raw("
            INSERT INTO temp_situacao (cpf_cnpj, nome, situacao_cadastral, digito_verificador, data_inscricao, comprovante, data_consulta)
            VALUES ('$cpf_cnpj', '$nome', '$situacao_cadastral', '$digito_verificador', '$data_inscricao', '$comprovante', '$data_consulta')
            ON DUPLICATE KEY UPDATE situacao_cadastral='$situacao_cadastral', comprovante='$comprovante', data_consulta='$data_consulta';
        "));

        return $dados_telefone;
    }*/
}
