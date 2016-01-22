angular.module('app.controllers')
    .controller('ConsultaController', ['$scope','$cookies','$http','$uibModal','ConsultaCPF_CNPJ','$filter',
        function($scope,$cookies,$http,$uibModal,ConsultaCPF_CNPJ,$filter){
            $scope.user = $cookies.getObject('user');
            $scope.resultados = "";
            $scope.resultadoPesquisa = null;
            $scope.sem_retorno = 0;
            $scope.vizinhos = null;
            $('#carregando').hide();

            $scope.limparResultado = function () {
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;
            };

            $scope.consultaCPFCNPJ = function($cpf_cnpj) {
                $scope.tabs = [];
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;
                $scope.vizinhos = null;
                $scope.imagem = null;

                //VERIFICA SE E UM CPF OU CNPJ VALIDO ANTES DE FAZER A NOVA CONSULTA NO BANCO DE DADOS
                if (!CPF.isValid($cpf_cnpj) && !CNPJ.isValid($cpf_cnpj)) {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error('CPF / CNPJ inválido!', 'Erro na consulta');
                } else {

                //VERIFICA SE O CPF_CNPJ JA FOI CONSULTADO NO CB
                //EM CASO POSITIVO IGNORA A CONSULTA DO MESMO E TRAZ A INFORMACAO DIRETO DO BANCO DE DADOS
                //CASO CONTRARIO FAZ A BUSCA E SALVA AS INFORMACOES NO BANCO DE DADOS
                    var request = $http({
                        method: "post",
                        url: '/consulta/verificaConsultaDados',
                        data: { cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14) },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                    request.success(function (data) {
                        $scope.verificaConsultaDados = data[0].contagem;

                        if($scope.verificaConsultaDados === 0){
                            $http.get("build/views/consulta/consultaDados.php?cpf="+$cpf_cnpj).success(function(response) {
                                var request = $http({
                                    method: "post",
                                    url: '/consulta/consultaDados',
                                    data: { array: response,
                                            cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14)},
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                });

                                request.success(function (data) {
                                    //ESPERA CONSULTA NO CCBUSCA PARA TRAZER AS INFORMACOES DO CPF / CNPJ
                                    var request = $http({
                                        method: "post",
                                        url: '/consulta/consultaCPFCNPJ',
                                        data: { cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14),
                                                usuario: $scope.user.id,
                                                cliente: $scope.user.id_cliente
                                              },
                                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                    });

                                    request.success(function (data) {
                                        if(data.length <= 0){
                                            $scope.sem_retorno = 1;
                                            $scope.resultados = "";
                                        } else{
                                            if(data.length >= 2)
                                                $scope.resultado = alasql('SELECT TOP 1 FROM ?',[data]);
                                            else
                                                $scope.resultados = data;
                                            console.log($scope.resultado);
                                            $scope.sem_retorno = 0;
                                        }
                                    });
                                });
                            });
                        } else {
                            var request = $http({
                                method: "post",
                                url: '/consulta/consultaCPFCNPJ',
                                data: { cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14),
                                        usuario: $scope.user.id,
                                        cliente: $scope.user.id_cliente
                                      },
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });

                            request.success(function (data) {
                                if(data.length <= 0){
                                    $scope.sem_retorno = 1;
                                    $scope.resultados = "";
                                } else{
                                    if(data.length >= 2)
                                        $scope.resultados = alasql('SELECT TOP 1 * FROM ?',[data]);
                                    else
                                        $scope.resultados = data;
                                    $scope.sem_retorno = 0;
                                }
                            });
                        }
                    });
                }
            };

            $scope.consultaEmail = function($email) {
                $scope.tabs = [];
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;

                if($email){
                    var request = $http({
                        method: "post",
                        url: '/consulta/consultaEmail',
                        data: { email: $email,
                                usuario: $scope.user.id,
                                cliente: $scope.user.id_cliente
                              },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                    request.success(function (data) {
                        if(data.length <= 0){
                            $scope.sem_retorno = 1;
                            $scope.resultados = "";
                        } else{
                            $scope.resultados = data;
                            $scope.sem_retorno = 0;
                        }
                    });
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 500;
                    toastr.error('Preencha o campo com o e-mail a ser localizado...', 'Erro na consulta');
                }
            };

            $scope.consultaTelefone = function($numeroTelefone) {
                $scope.tabs = [];
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;

                if($numeroTelefone){
                    var request = $http({
                        method: "post",
                        url: '/consulta/consultaTelefone',
                        data: { numero: $numeroTelefone.replace('(','').replace(' ','').replace(')','').replace('-',''),
                                usuario: $scope.user.id,
                                cliente: $scope.user.id_cliente
                              },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                    request.success(function (data) {
                        if(data.length <= 0){
                            $scope.sem_retorno = 1;
                            $scope.resultados = "";
                        } else{
                            $scope.resultados = data;
                            $scope.sem_retorno = 0;
                        }
                    });
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 500;
                    toastr.error('Preencha o campo com o número de telefone a ser localizado...', 'Erro na consulta');
                }
            };

            $scope.consultaVeiculo = function($placa, $renavan) {
                $scope.tabs = [];
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;

                if($placa || $renavan){
                    var request = $http({
                        method: "post",
                        url: '/consulta/consultaVeiculo',
                        data: { placa: $placa,
                                renavan: $renavan,
                                usuario: $scope.user.id,
                                cliente: $scope.user.id_cliente
                              },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                    request.success(function (data) {
                        if(data.length <= 0){
                            $scope.sem_retorno = 1;
                            $scope.resultados = "";
                        } else{
                            $scope.resultados = data;
                            $scope.sem_retorno = 0;
                        }
                    });
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 500;
                    toastr.error('Preencha a placa ou renavan para continuar a consulta...', 'Erro na consulta');
                }
            };

            $scope.consultaNome = function($nome,$cidade,$uf,$cep) {
                $scope.tabs = [];
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;

                if($nome){
                    var request = $http({
                        method: "post",
                        url: '/consulta/consultaNome',
                        data: { nome: $nome,
                                cidade: $cidade,
                                uf: $cidade,
                                cep: $cep,
                                usuario: $scope.user.id,
                                cliente: $scope.user.id_cliente
                              },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                    request.success(function (data) {
                        if(data.length <= 0){
                            $scope.sem_retorno = 1;
                            $scope.resultados = "";
                        } else{
                            $scope.resultados = data;
                            $scope.sem_retorno = 0;
                        }
                    });
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 500;
                    toastr.error('Necessário preencher o nome e mais um parâmetro para realizar esta consulta...', 'Erro na consulta');
                }
            };

            $scope.consultaEndereco = function($logradouro,$cidade,$uf,$cep) {
                $scope.tabs = [];
                $scope.resultados = null;
                $scope.resultadoPesquisa = null;

                if($logradouro || $cidade || $uf || $cep){
                    var request = $http({
                        method: "post",
                        url: '/consulta/consultaEndereco',
                        data: { logradouro: $logradouro,
                                cidade: $cidade,
                                uf: $cidade,
                                cep: $cep,
                                usuario: $scope.user.id,
                                cliente: $scope.user.id_cliente
                        },
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });

                    request.success(function (data) {
                        if(data.length <= 0){
                            $scope.sem_retorno = 1;
                            $scope.resultados = "";
                        } else{
                            $scope.resultados = data;
                            $scope.sem_retorno = 0;
                        }
                    });
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 500;
                    toastr.error('Preencha um dos campos para realizar esta consulta...', 'Erro na consulta');
                }
            };


            //PEGA AS INFORMACOES DE TELEFONE VINDAS DO BANCO DE DADOS
            $scope.vizualizarCadastro = function($cpf_cnpj){
                $scope.tabs.push({
                    title: $cpf_cnpj,
                    content: '<h1>$cpf_cnpj</h1>'
                })
            };

            $scope.removeTab = function (index) {
                $scope.tabs.splice(index, 1);
            };



            //MASCARAS DOS CAMPOS DE CONSULTA
            var SPMask = function (val) {
                    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
                },
                spOptions = {
                    onKeyPress: function(val, e, field, options) {
                        field.mask(SPMask.apply({}, arguments), options);
                    }
                };

            var CPF_CNPJMask = function (val) {
                    return val.replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-009999';
                },
                spOptions = {
                    onblur: function(val, e, field, options) {
                        field.mask(CPF_CNPJMask.apply({}, arguments), options);
                    }
                };

            $('#consulta_telefone').mask(SPMask, spOptions);
            $('#cpf_cnpj').mask(CPF_CNPJMask, spOptions);
            $('#consulta_veiculo_placa').mask('AAA-0000', spOptions);
            $('#consulta_veiculo_renavan').mask('0000000000', spOptions);
            $('#cep').mask('00000-000', spOptions);
            $('#uf').mask('AA', spOptions);
            $('#cep2').mask('00000-000', spOptions);
            $('#uf2').mask('AA', spOptions);





//-------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------- CONSULTAS SECUNDARIAS -----------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------
        $scope.resultado = "";
        $scope.vizinhos = "";
        $scope.cpf_cnpj = "";
        $scope.carregando = false;
        $scope.carregando2 = false;
        $scope.tabs = [];

        //CONSULTA GERAL POR CPF_CNPJ QUE TRAZ TODAS AS INFORMACOES
        $scope.consulta_cpf_cnpj = function($cpf_cnpj){
            //ZERA AS VARIAVEIS PARA LIMPAR A TELA ANTES DA EXIBICAO
            $scope.dadosPessoais = null;
            $scope.dadosMae = null;
            $scope.enderecos = null;
            $scope.telefones = null;
            $scope.emails = null;
            $scope.veiculos = null;


            $scope.cpf_cnpj = $cpf_cnpj;
            $scope.imagem = null;

            //VERIFICA SE O CPF_CNPJ JA FOI CONSULTADO NO CB
            //EM CASO POSITIVO IGNORA A CONSULTA DO MESMO E TRAZ A INFORMACAO DIRETO DO BANCO DE DADOS
            //CASO CONTRARIO FAZ A BUSCA E SALVA AS INFORMACOES NO BANCO DE DADOS
            var request = $http({
                method: "post",
                url: '/consulta/verificaConsultaDados',
                data: { cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14) },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
            request.success(function (data) {
                $scope.verificaConsultaDados = data[0].contagem;

                if($scope.verificaConsultaDados === 0){
                    $http.get("build/views/consulta/consultaDados.php?cpf="+$cpf_cnpj).success(function(response) {
                        var request = $http({
                            method: "post",
                            url: '/consulta/consultaDados',
                            data: { array: response,
                                cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14)},
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });

                        request.success(function (data) {
                            //ESPERA CONSULTA NO CCBUSCA PARA TRAZER AS INFORMACOES DO CPF / CNPJ
                            var request = $http({
                                method: "post",
                                url: '/consulta/consultaCPFCNPJ',
                                data: {cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14)},
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });

                            request.success(function (data) {
                                pegarDadosGeralCadastro($scope.cpf_cnpj);
                            });
                        });
                    });
                } else {
                    pegarDadosGeralCadastro($scope.cpf_cnpj);
                    $scope.vizinhos = null;
                    $scope.imagem = null;
                    $scope.carregando = false;
                    $scope.carregando2 = false;
                }
            });
        };

        //CONSULTA VIZINHOS
        $scope.pesquisarVizinhos = function($cep){
            possiveisVizinhos($scope.cpf_cnpj, $cep);
        };

        //VISUALIZA CADASTRO DE UM TERCEIRO ATRAVES DO VIGENTE
        $scope.vizualizarCadastroTerceiro = function($cpf_cnpj){
            $scope.tabs.splice(0, 1);
            vizualizarCadastro($cpf_cnpj);
        };


        //CONSULTA OPERADORA
        $scope.pesquisarOperadora = function(){
            toastr.options.progressBar = true;
            toastr.options.closeDuration = 300;
            toastr.info('Atualizando, favor aguardar...','Atualização das Operadoras');
            angular.forEach($scope.resultado.dados_telefone, function(value, key) {
                //this.push(key + ': ' + value);
                //console.log(value.id, value.telefoneddd);
                $scope.url = "build/views/consulta/consulta_operadora.php?tel="+value.telefoneddd;
                $http.get($scope.url).success(function(response) {
                    $scope.index = response.indexOf("resultado");
                    $scope.parcial1 = response.substring($scope.index,$scope.index+220);
                    $scope.operadora = $scope.parcial1.substring($scope.parcial1.indexOf("<p>")+3,$scope.parcial1.indexOf("</p>")).replace('Brt','OI');

                    if($scope.parcial1.indexOf("NÃo portado"))
                        $scope.portabilidade = 'Não portado';
                    else if ($scope.parcial1.indexOf("Portado"))
                        $scope.portabilidade = 'Portado';

                    var request = $http({
                        method: "post",
                        url: '/consulta/atualizaOperadora',
                        data: { cpf_cnpj: ("00000000000000"+CNPJ.strip(value.cpf_cnpj)).slice(-14),
                                telefone: value.telefoneddd,
                                operadora: $scope.operadora,
                                portabilidade: $scope.portabilidade},
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                });
            });

            //CHAMA A FUNÇAO QUE IRA ATUALIZAR A TABELA DE TELEFONES
            setTimeout(function () {
                $scope.$apply(function () {
                    pegarDadosTelefone($scope.cpf_cnpj);
                });
            }, 5000);
        };

        //CONSULTA WHATSAPP
        $scope.pesquisarWhats = function(){
            var contador = 0;
            //APAGA O ESCOPO E GUARDA OS TELEFONES EM UMA VARIAVEL
            var telefones = $scope.telefones;
            $scope.telefones = null;
            //EXIBE O SPINNER DE AGUARDANDO...
            $scope.carregandoTelefone = true;
            $('#carregandoTelefone').show();

            angular.forEach(telefones, function(value, key) {
                $scope.url = "build/views/consulta/consulta_whats.php?number=55"+value.telefoneddd;
                var request = $http.get($scope.url).success(function(response) {

                    var index = response.indexOf("Result: ");
                    var resultado = response.substring(index+8,index+220);
                    var possuiWhats = null;

                    if(resultado === 'yes')
                        possuiWhats = 'SIM';
                    else if (resultado === 'no')
                        possuiWhats = 'NÃO';
                    else if (resultado === 'timeout'){
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.error('Falha ao consultar','Verificando WhatsAPP');
                    }

                    $http({
                        method: "post",
                        url: '/consulta/consultaWhats',
                        data: { cpf_cnpj: ("00000000000000"+CNPJ.strip(value.cpf_cnpj)).slice(-14),
                            telefone: value.telefoneddd,
                            retorno: possuiWhats},
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });
                });

                request.success(function (data) {
                    contador ++;
                    if ($scope.resultado.dados_telefone.length === contador){
                        $scope.carregandoTelefone = false;
                        $('#carregandoTelefone').hide();
                        pegarDadosTelefone($scope.cpf_cnpj);
                    }
                });
            });
        };

        //CONSULTAR CPF NA RECEITA FEDERAL
        $scope.consultarCPF = function(){
            $scope.imagem = null;
            getCaptcha();
            $('#captchaSituacaoCPF').show();
        };

        //GERA O CAPTCHA
        function getCaptcha(){
            captcha_cpf.value = '';
            $('#botaoSituacaoCPF').hide();
            $scope.carregando = true;
            $('#carregando').show();
            $http.get('build/views/consulta/cadastro_receita_cpf.php').
                then(function(response) {
                    if(response.erro){
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.error(response.erro+'.\nContate nosso suporte!','Erro na consulta');
                    } else {
                        $('#carregando').hide();
                        $scope.carregando = false;
                        $scope.imagem = response.data.captchaBase64;
                        $scope.cookie = response.data.cookie;
                    }
                });
        }

        //ATUALIZA O CAPTCHA
        $scope.atualizaCaptcha = function(){
            $scope.imagem = null;
            getCaptcha();
        };


        //CONSULTAR CNPJ NA RECEITA FEDERAL
        $scope.consultarCNPJ = function(){
            getCaptchaCNPJ();
            $('#captchaSituacaoCNPJ').show();
        };

        //ATUALIZA O CAPTCHA DO CNPJÍ
        $scope.atualizaCaptchaCNPJ = function(){
            getCaptcha();
        };

        //GERA O CAPTCHA
        function getCaptchaCNPJ(){
            captcha_cnpj.value = '';
            $scope.imagem = null;
            $('#botaoSituacaoCNPJ').hide();
            $scope.carregando2 = true;
            $('#carregando2').show();
            $http.get('build/views/consulta/cadastro_receita_cnpj.php').
            then(function(response) {
                if(response.erro){
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error(response.erro+'.\nContate nosso suporte!','Erro na consulta');
                } else {
                    $('#carregando2').hide();
                    $scope.carregando2 = false;
                    $scope.imagem = response.data.captchaBase64;
                    $scope.cookie = response.data.cookie;
                }
            });
        }

        //ATUALIZA O CAPTCHA
        $scope.atualizaCaptchaCNPJ = function(){
            $scope.imagem = null;
            getCaptchaCNPJ();
        };

        //ENVIA O CAPTCHA JUNTO AO CPF E DATA DE NASCIMENTO PARA CONFERENCIA DOS DADOS
        $scope.situacaoCPF = function (){
            //FAZ UM POST NO ARQUIVO PHP PARA VERIFICAR O RETORNO DA SITUACAO DO CADASTRO
            var request = $http({
                method: "post",
                url: 'build/views/consulta/cadastro_receita_cpf.php',
                data: {
                    cpf: ("00000000000" + parseInt($scope.cpf_cnpj, 10)).slice(-11),
                    data_nascimento: $filter('date')($scope.dadosPessoais.datanascimento, "ddMMyyyy"),
                    captcha: captcha_cpf.value,
                    cookie: $scope.cookie
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            request.success(function (data) {

                //VERIFICA O RETORNO PARA IDENTIFICAR SE ACONTECEU ALGUM ERRO
                if(data.indexOf('Fatal error') > 0){
                    $scope.imagem = null;
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error('Houve um erro na consulta, tente novamente!','Erro no cadastro');
                    getCaptcha();
                    captcha_cpf.value = '';
                } else {
                    //QUANDO ENCONTRADO, SERIALIZA O QUE FOI RETORNADO PELO SCRIP E ATUALIZA AS INFORMACOES NO BANCO DE DADOS
                    $scope.situacao = angular.fromJson(data);
                    var request2 = $http({
                        method: "post",
                        url: '/consulta/sitacaoCPF',
                        data: {
                            cpf_cnpj: ("00000000000000"+$scope.situacao.cpf).slice(-14),
                            nome: $scope.situacao.nome,
                            situacao_cadastral: $scope.situacao.situacao_cadastral,
                            digito_verificador: $scope.situacao.digito_verificador,
                            data_inscricao: $filter('dateBD')($scope.situacao.situacao_cadastral_data.replace('anterior a ','')),
                            comprovante: $scope.situacao.comprovante_codigo,
                            data_consulta: $filter('date')(new Date(), "yyyy-MM-dd HH:mm:ss")
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    });

                    //EXIBE MENSAGEM INFORMANDO QUE A ATUALIZACAO FOI REALIZADA COM SUCESSO
                    request2.success(function (data2) {
                        $('#captchaSituacaoCPF').hide();
                        $('#botaoSituacaoCPF').show();
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.success('Situação do CPF atualizada com sucesso!','Situação do CPF');
                        pegarDadosGeralCadastro($scope.cpf_cnpj);
                    });
                };
            });
        };

        //ENVIA O CAPTCHA JUNTO AO CPF E DATA DE NASCIMENTO PARA CONFERENCIA DOS DADOS
        $scope.situacaoCNPJ = function (){
            $scope.imagem = null;
            $scope.carregando2 = true;
            $('#carregando2').show();
            //FAZ UM POST NO ARQUIVO PHP PARA VERIFICAR O RETORNO DA SITUACAO DO CADASTRO
            var request = $http({
                method: "post",
                url: 'build/views/consulta/cadastro_receita_cnpj.php',
                data: {
                    cnpj: ("00000000000000" + parseInt($scope.cpf_cnpj, 10)).slice(-14),
                    captcha: captcha_cnpj.value,
                    cookie: $scope.cookie
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            request.success(function (data) {
                $('#carregando2').hide();
                $scope.carregando2 = false;
                if(data != ""){
                    $scope.dataConsultaCNPJ = new Date();
                    $scope.resultadoPesquisa = data;
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error('Houve um erro na consulta, tente novamente!','Erro no cadastro');
                    getCaptchaCNPJ();
                    captcha_cnpj.value = '';
                }
            });
        };


        //-------------------------------------------------------------------------------------------------------------------------------------------------
        //--------------------------------------------------- FUNCOES -------------------------------------------------------------------------------------
        //-------------------------------------------------------------------------------------------------------------------------------------------------
        //PEGA AS INFORMAÇOES COMPLETAS VINDAS DO BANCO DE DADOS
        function pegarDadosGeralCadastro($cpf_cnpj) {
            var request = $http({
                method: "post",
                url: '/consulta/cpf_cnpj',
                data: {cpf_cnpj: ("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14)},
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

            request.success(function (data) {
                //if(data.dados_pessoais[0].cpf_cnpj.replace(/^(0+)(\d)/g,"$2").length < 14)
                //console.log(data.dados_pessoais[0].cpf_cnpj.replace(/^(0+)(\d)/g,"$2"));
                if (data.dados_pessoais.length && $filter('removeZero')(data.dados_pessoais[0].cpf_cnpj, 11).length === 11) {
                    $scope.tipo_cadastro = 0; //CPF
                } else if (data.dados_pessoais.length && $filter('removeZero')(data.dados_pessoais[0].cpf_cnpj, 11).length > 11) {
                    $scope.tipo_cadastro = 1; //CNPJ
                }

                $scope.resultado = data;

                //FORMATA A DATA DE CONSULTA DA SITUACAO DO CPF PARA PODER SER EXIBIDA NO DISPLAY CORRETAMENTE
                if(data.dados_pessoais[0].data_consulta != null)
                    data.dados_pessoais[0].data_consulta = new Date(data.dados_pessoais[0].data_consulta);

                $scope.dadosPessoais = data.dados_pessoais[0];
                $scope.dadosMae = data.dados_mae;
                $scope.enderecos = data.dados_endereco;
                $scope.telefones = data.dados_telefone;
                $scope.emails = data.dados_email;
                $scope.veiculos = data.dados_veiculo;
            });
        }

        //PROCURA POSSIVEIS VIZINHOS
        function possiveisVizinhos($cpf_cnpj, $cep) {
            $scope.vizinhos = null;
            var request = $http({
                method: "post",
                url: '/consulta/possiveisVizinhos',
                data: { cpf_cnpj: (("00000000000000" + CNPJ.strip($cpf_cnpj)).slice(-14)),
                        cep: $cep },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });

            request.success(function (data) {
                //console.log(data);
                $scope.vizinhos = data;
            });
        }

        //PEGA AS INFORMACOES DE TELEFONE VINDAS DO BANCO DE DADOS
        function pegarDadosTelefone($cpf_cnpj){

            var request = $http({
                method: "post",
                url: '/consulta/telefones',
                data: { cpf_cnpj: ("00000000000000"+CNPJ.strip($cpf_cnpj)).slice(-14) },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            request.success(function (retorno) {
                $scope.telefones = retorno;

                toastr.options.progressBar = true;
                toastr.options.closeDuration = 300;
                toastr.success('Telefones atualizados com sucesso','Atualização das Operadoras');
            });
        }

        //PEGA AS INFORMACOES DE TELEFONE VINDAS DO BANCO DE DADOS
        function vizualizarCadastro($cpf_cnpj){
            $scope.tabs.push({
                title: $cpf_cnpj,
                content: '<h1>$cpf_cnpj</h1>'
            })
        }

        $scope.removeTab = function (index) {
            $scope.tabs.splice(index, 1);
        };

    }]);