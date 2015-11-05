angular.module('app.controllers')
.controller('CadastroController', ['$scope','$rootScope','$location', '$http', 'Cadastro', 'Cliente', 'User', 'OAuth',function($scope,$rootScope,$location,$http,Cadastro,Cliente,User,OAuth){
        $scope.usuarioExistente = 'form-group';

        $scope.user = {
            username: '',
            password: ''
        };

        $scope.error = {
            message: '',
            error: false
        };

        $scope.clientes = new Cliente();
        $scope.save = function(){
            if($scope.form.$valid){
                $http.get("cliente/usuario/" + usuario.value).success(function(response) {
                    if(response.id === "true"){
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.error('Usuário já cadastrado no sistema, escolha outro usuário','Erro no cadastro');
                        $scope.usuarioExistente = 'form-group has-error';
                    } else {
                        var request = $http({
                            method: "post",
                            url: '/cliente/novo',
                            data: {
                                nome: razao_social.value,
                                cpf_cnpj: cnpj.value.replace(".","").replace(".","").replace("/","").replace("-",""),
                                tipo_pessoa: 'PJ',
                                contato: contato.value,
                                logradouro: endereco.value,
                                bairro: bairro.value,
                                cidade: municipio.value,
                                uf: uf.value,
                                cep: cep.value.replace(".","").replace("-",""),
                                telefone_1: numero_telefone_celular.value,
                                telefone_2: numero_telefone_fixo.value,
                                email_cobranca: email.value,
                                numero_usuarios: '3',
                                status: '1',
                                id_revendedor: '0',
                                consultas_disponiveis: '50'
                            },
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        });

                        request.success(function (data) {
                            var requestUser = $http({
                                method: "post",
                                url: '/cliente/'+data.id+'/novo_usuario',
                                data: {
                                    name: usuario.value,
                                    email: usuario.value,
                                    password: senha.value,
                                    id_cliente: data.id, //ID DO CLIENTE PEGO APÓS A CRIAÇÃO DO MESMO
                                    status: '1', //STATUS DO USUARIO MARCADO COMO ATIVO
                                    tipo_usuario: '3' //USUÁRIO CLIENTE-MASTER
                                },
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            });

                            requestUser.success(function (dataUser) {
                                $location.path('login');
                                toastr.options.progressBar = true;
                                toastr.options.closeDuration = 300;
                                toastr.success('Cliente/Usuario cadastrados com sucesso. Já é possível fazer login no sistema e testar nossa ferramenta!','Mensagem do Sistema');
                            });
                        });
                    }
                });
            }

        }

        $scope.verificaCNPJ = function (){
            $rootScope.cnpj = cpf_cnpj.value;
            var valor = cpf_cnpj.value;
            valor = valor.replace(/[^\d]+/g,"");
            if(valor.length < 14){
                toastr.error('Preencha corretamente o campo CNPJ!','Erro no cadastro');
                return false;
            }
            else{
                var resultado = validarCNPJ(valor);
                if(resultado == true){
                    $http.get("/cliente/cnpj/" + valor).success(function(response) {
                        $scope.verificaExiste = response;
                        if($scope.verificaExiste.cpf_cnpj === valor ){
                            toastr.error('CNPJ já cadastrado na base de dados','Erro no cadastro');
                        } else {
                            getCaptcha();
                            $('#myModal').modal('show');
                        }
                    });
                }
                else{
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error('CNPJ: '+cpf_cnpj.value+' incorreto ou inexistente','Erro no cadastro');
                    cpf_cnpj.value = ""
                }
            }
        };

        $scope.atualizaCaptcha = function(){
            getCaptcha();
        };

        function getCaptcha(){
            $('#spinner').show();
            $http.get('build/views/cadastro/cadastro_receita.php').
                success(function(response) {
                    if(response.erro){
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.error(response.erro+'.\nContate nosso suporte!','Erro no cadastro');
                    } else {
                        $scope.imagem = response.captchaBase64;
                        $scope.cookie = response.cookie;
                    }
                });
            $('#spinner').hide();
        }

        $scope.getInformacoes = function (){

            $('#spinner').show();
            var request = $http({
                method: "post",
                url: 'build/views/cadastro/cadastro_receita.php',
                data: {
                    cnpj: $scope.cnpj,
                    captcha: captcha_cnpj.value,
                    cookie: $scope.cookie
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            request.success(function (data) {
                if(data != ""){
                    $rootScope.resultadoPesquisa = data;
                    $('.btn2').click();
                    //console.log($rootScope.resultadoPesquisa);
                    $location.path('cadastro_concluir');
                } else {
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error('Captcha digitado incorretamente, preencha o campo com os caracteres da nova imagem!','Erro no cadastro');
                    getCaptcha();
                    captcha_cnpj.value = '';
                }
            });
            $('#spinner').hide();
        };


        function validarCNPJ(cnpj) {
            cnpj = cnpj.replace(/[^\d]+/g,'');

            if(cnpj == '') return false;

            if (cnpj.length != 14)
                return false;

            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" ||
                cnpj == "11111111111111" ||
                cnpj == "22222222222222" ||
                cnpj == "33333333333333" ||
                cnpj == "44444444444444" ||
                cnpj == "55555555555555" ||
                cnpj == "66666666666666" ||
                cnpj == "77777777777777" ||
                cnpj == "88888888888888" ||
                cnpj == "99999999999999")
                return false;

            // Valida DVs
            tamanho = cnpj.length - 2;
            numeros = cnpj.substring(0,tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if(resultado != digitos.charAt(1))
                return false;

            return true;
        }

        /*
        $(document).ready(function(){
            $("#form").validate({
                rules: {
                    senha: {
                        required: true,
                        minlength: 6
                    }
                }
            });
        });*/
    }]);