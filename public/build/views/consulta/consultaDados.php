<?php
    $cpf = $_GET["cpf"];

    try{
        $client = new SoapClient('http://www.ccbusca.com.br/webservice.php?wsdl');
        $client -> __getFunctions();
    } catch(SoapFault $e) {
        echo $e->getMessage();
    }

    $usuario = 'VIPER';
    $password = 'viper2015';
    $retira = array("/","-"," ",".");
    $cpf = str_replace($retira, '', $cpf);
    $dados = $client->ws_pesqcpf($usuario, $password, $cpf);
    $retorno = array();

    if (strstr($dados,"<msgocor>encontrado</msgocor>"))
    {
        if (preg_match_all("/<cadastro>([^^]*)<\/cadastro>/",$dados,$arr)){
            $cadastros_array = array();
            $cadastros = $arr[1][0];
            preg_match_all("/<cpf>([^<]{1,})<\/cpf>/",$cadastros,$cpfs);
            preg_match_all("/<nome>([^<]{1,})<\/nome>/",$cadastros,$nomes);
            preg_match_all("/<dtnascimento>([^<]{1,})<\/dtnascimento>/",$cadastros,$dtnascimentos);
            preg_match_all("/<nomemae>([^<]{1,})<\/nomemae>/",$cadastros,$nomemaes);
            preg_match_all("/<sexo>([^<]{1,})<\/sexo>/",$cadastros,$sexos);

            $cpf = trim($cpfs[1][0]);
            $nome = trim($nomes[1][0]);
            $dtnascimento = trim($dtnascimentos[1][0]);
            $nomemae = trim($nomemaes[1][0]);
            $sexo = trim($sexos[1][0]);

            array_push($cadastros_array,
                array(  'cpf' => $cpf,
                        'nome' => $nome,
                        'dtnascimento' => $dtnascimento,
                        'nomemae' => $nomemae,
                        'sexo' => $sexo
                ));

            $retorno['cadastro']= $cadastros_array;
        }
        if (preg_match_all("/<enderecos>([^^]*)<\/enderecos>/",$dados,$arr))
        {
            $enderecos_array = array();
            $enderecos = $arr[1][0];
            preg_match_all("/<tipo>([^<]{1,})<\/tipo>/",$enderecos,$tipos);
            preg_match_all("/<logradouro>([^<]{1,})<\/logradouro>/",$enderecos,$enders);
            preg_match_all("/<numero>([^<]+)<\/numero>/",$enderecos,$nums);
            preg_match_all("/<complemento>([^<]+)<\/complemento>/",$enderecos,$compls);
            preg_match_all("/<bairro>([^<]{1,})<\/bairro>/",$enderecos,$bairros);
            preg_match_all("/<cep>([0-9]{7,8})<\/cep>/",$enderecos,$ceps);
            preg_match_all("/<cidade>([^<]{3,})<\/cidade>/",$enderecos,$cidades);
            preg_match_all("/<estado>([A-Z]{2})<\/estado>/",$enderecos,$ufs);
            for ($i=0;$i<sizeof($enders[1]);$i++)
            {
                $tipo = array_key_exists($i,$tipos[1]) ? $tipos[1][$i] : "";
                $logradouro = $tipo ." " .$enders[1][$i];
                $numero = array_key_exists($i,$nums[1]) ? intval($nums[1][$i]) : "";
                $compl = array_key_exists($i,$compls[1]) ? $compls[1][$i] : "";
                $bairro = array_key_exists($i,$bairros[1]) ? $bairros[1][$i] : "";
                $cidade = array_key_exists($i,$cidades[1]) ? $cidades[1][$i] : "";
                $uf = array_key_exists($i,$ufs[1]) ? $ufs[1][$i] : "";
                $cep = array_key_exists($i,$ceps[1]) ? $ceps[1][$i] : "";

                array_push($enderecos_array,
                    array(  'logradouro' => $logradouro,
                            'num' => $numero,
                            'complemento' => $compl,
                            'bairro' => $bairro,
                            'cidade' => $cidade,
                            'uf' => $uf,
                            'cep' => $cep
                    ));
            }
            $retorno['enderecos']= $enderecos_array;
        }
        if (preg_match_all("/<telefones>([^^]*)<\/telefones>/",$dados,$arr)){
            $telefones_array = array();
            $telefones = $arr[1][0];
            preg_match_all("/<ddd>([^<]{1,})<\/ddd>/",$telefones,$ddds);
            preg_match_all("/<numero>([^<]{3,})<\/numero>/",$telefones,$fones);
            for ($i=0;$i<sizeof($fones[1]);$i++)
            {
                $ddd = trim($ddds[1][$i]);
                $fone = trim($fones[1][$i]);
                array_push($telefones_array,
                    array(  'ddd' => $ddd,
                            'telefone' => $fone
                    ));
            }
            $retorno['telefones']= $telefones_array;
        }
        if (preg_match_all("/<irmaos>([^^]*)<\/irmaos>/",$dados,$arr)){
            $parentes_array = array();
            $parentes = $arr[1][0];
            preg_match_all("/<nome>([^<]{1,})<\/nome>/",$parentes,$nomes);
            preg_match_all("/<cpf>([^<]{1,})<\/cpf>/",$parentes,$cpfs);
            for ($i=0;$i<sizeof($nomes[1]);$i++)
            {
                $nome = trim($nomes[1][$i]);
                $cpf = trim($cpfs[1][$i]);
                array_push($parentes_array,
                    array(  'nome' => $nome,
                            'cpf' => $cpf
                    ));
            }
            $retorno['parentes']= $parentes_array;
        }
        if (preg_match_all("/<veiculos>([^^]*)<\/veiculos>/",$dados,$arr)){
            $veiculos_array = array();
            $veiculos = $arr[1][0];
            preg_match_all("/<placa>([^<]{1,})<\/placa>/",$veiculos,$placas);
            preg_match_all("/<renavan>([^<]{1,})<\/renavan>/",$veiculos,$renavans);
            preg_match_all("/<chassi>([^<]{1,})<\/chassi>/",$veiculos,$classis);
            preg_match_all("/<anofab>([^<]{1,})<\/anofab>/",$veiculos,$anofabs);
            preg_match_all("/<anomod>([^<]{1,})<\/anomod>/",$veiculos,$anomods);
            preg_match_all("/<modelo>([^<]{1,})<\/modelo>/",$veiculos,$modelos);
            preg_match_all("/<tipo>([^<]{1,})<\/tipo>/",$veiculos,$tipos);
            preg_match_all("/<especie>([^<]{1,})<\/especie>/",$veiculos,$especies);
            preg_match_all("/<combustivel>([^<]{1,})<\/combustivel>/",$veiculos,$combustiveis);
            for ($i=0;$i<sizeof($placas[1]);$i++)
            {
                $placa = trim($placas[1][$i]);
                $renavan = trim($renavans[1][$i]);
                $classi = trim($classis[1][$i]);
                $anofab = trim($anofabs[1][$i]);
                $anomod = trim($anomods[1][$i]);
                $modelo = trim($modelos[1][$i]);
                $tipo = trim($tipos[1][$i]);
                $especie = trim($especies[1][$i]);
                $combustivel = trim($combustiveis[1][$i]);

                array_push($veiculos_array,
                    array(  'cpf' => $retorno['cadastro'][0]['cpf'],
                            'placa' => $placa,
                            'renavan' => $renavan,
                            'chassi' => $classi,
                            'anofab' => $anofab,
                            'anomod' => $anomod,
                            'modelo' => $modelo,
                            'tipo' => $tipo,
                            'especie' => $especie,
                            'combustivel' => $combustivel
                    ));
            }
            $retorno['veiculos']= $veiculos_array;
        }
        if (preg_match_all("/<vizinhos>([^^]*)<\/vizinhos>/",$dados,$arr)){
            $vizinhos_array = array();
            $vizinhos = $arr[1][0];
            preg_match_all("/<nome>([^<]{1,})<\/nome>/",$vizinhos,$nomes);
            preg_match_all("/<cpf>([^<]{1,})<\/cpf>/",$vizinhos,$cpfs);
            preg_match_all("/<tipo>([^<]{1,})<\/tipo>/",$vizinhos,$tipos);
            preg_match_all("/<logradouro>([^<]{1,})<\/logradouro>/",$vizinhos,$logradouros);
            preg_match_all("/<numero>([^<]{1,})<\/numero>/",$vizinhos,$numeros);
            preg_match_all("/<cep>([^<]{1,})<\/cep>/",$vizinhos,$ceps);
            preg_match_all("/<bairro>([^<]{1,})<\/bairro>/",$vizinhos,$bairros);
            preg_match_all("/<cidade>([^<]{1,})<\/cidade>/",$vizinhos,$cidades);
            preg_match_all("/<uf>([^<]{1,})<\/uf>/",$vizinhos,$ufs);
            preg_match_all("/<complemento>([^<]{1,})<\/complemento>/",$vizinhos,$complementos);
            for ($i=0;$i<sizeof($nomes[1]);$i++)
            {
                $nome = trim($nomes[1][$i]);
                $cpf = trim($cpfs[1][$i]);
                $tipo = trim($tipos[1][$i]);
                $logradouro = trim($logradouros[1][$i]);
                $numero = trim($numeros[1][$i]);
                $cep = trim($ceps[1][$i]);
                $bairro = trim($bairros[1][$i]);
                $cidade = trim($cidades[1][$i]);
                $uf = trim($ufs[1][$i]);;
                $complemento = trim($complementos[1][$i]);

                array_push($vizinhos_array,
                    array(  'nome' => $nome,
                            'cpf' => $cpf,
                            'tipo' => $tipo,
                            'logradouro' => $logradouro,
                            'numero' => $numero,
                            'cep' => $cep,
                            'bairro' => $bairro,
                            'cidade' => $cidade,
                            'uf' => $uf,
                            'complemento' => $complemento
                    ));
            }
            $retorno['vizinhos']= $vizinhos_array;
        }
        if (preg_match_all("/<parsocietaria>([^^]*)<\/parsocietaria>/",$dados,$arr)){
            $participacao_array = array();
            $participacao = $arr[1][0];
            preg_match_all("/<nome>([^<]{1,})<\/nome>/",$participacao,$nomes);
            preg_match_all("/<cnpj>([^<]{1,})<\/cnpj>/",$participacao,$cnpjs);
            preg_match_all("/<quali>([^<]{1,})<\/quali>/",$participacao,$qualis);
            for ($i=0;$i<sizeof($nomes[1]);$i++)
            {
                $nome = trim($nomes[1][$i]);
                $cnpj = trim($cnpjs[1][$i]);
                $quali = trim($qualis[1][$i]);

                array_push($participacao_array,
                    array(  'nome' => $nome,
                            'cnpj' => $cnpj,
                            'qualificacao' => $quali
                    ));
            }
            $retorno['empresas']= $participacao_array;
        }
        if (preg_match_all("/<emails>([^^]*)<\/emails>/",$dados,$arr)){
            $email_array = array();
            $email = $arr[1][0];
            preg_match_all("/<email>([^<]{1,})<\/email>/",$email,$emails);
            for ($i=0;$i<sizeof($emails[1]);$i++)
            {
                $email = trim($emails[1][$i]);

                array_push($email_array,
                    array( 'email' => $email,
                           'cpf' => $retorno['cadastro'][0]['cpf']));
            }
            $retorno['emails']= $email_array;
        }
    }

    //echo $dados;
    echo json_encode($retorno);
    //echo json_encode(array('dadospessoais' => $cadastros_array ,'enderecos' => $enderecos_array, 'telefones' => $telefones_array));




?>