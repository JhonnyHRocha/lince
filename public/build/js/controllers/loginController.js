angular.module('app.controllers')
.controller('LoginController', ['$scope','$location', '$cookies', '$http', 'User', 'OAuth', '$timeout',function($scope,$location,$cookies,$http,User,OAuth,$timeout){
        $scope.user = {
            username: '',
            password: ''
        };

        $scope.error = {
            message: '',
            descritivo: '',
            error: false
        };

        $scope.login = function(){
            //SETA O CAMPO DE ERRO COMO FALSO PARA PODER APAGAR DA TELA A MENSAGEM DE ERRO E SE FOR O CASO SERA EXIBIDA DE NOVO
            //CASO VENHA A APRESENTAR ALGUM PROBLEMA NA HORA DE FAZER O LOGIN
            $scope.error.error = false;

            if($scope.form.$valid) {
                //VERIFICA SE O USUARIO ESTA LOGADO NO SISTEMA ANTES DE LIBERAR A CRIACAO DE UM TOKEN PARA O MESMO
                var request = $http({
                    method: "post",
                    url: '/user/checkSession',
                    data: { us : $scope.user.password,
                            pw : $scope.user.username },
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });

                request.success(function (data) {
                    if (data === '1') {
                        $scope.error.error = true;
                        $scope.error.descritivo = "Ocorreram erros durante a tentativa de login.";
                        $scope.error.message = "Usuário já logado no sistema.";
                    } else {
                        OAuth.getAccessToken($scope.user).then(function (retorno) {
                            //console.log(retorno);
                            User.authenticated({}, {}, function (data) {
                                //VERIFICA A DATA DE VALIDADE DO USUARIO, BLOQUEANDO ELE DE ACESSAR OU NAO
                                if (data.data_validade !== null && GetFormattedDate() > data.data_validade) {
                                    $scope.error.error = true;
                                    $scope.error.descritivo = "Ocorreram erros durante a tentativa de login.";
                                    $scope.error.message = "Usuário expirado. Contate seu usuário master ou vendedor.";
                                } else if (data.status === 3) {
                                    $scope.error.error = true;
                                    $scope.error.descritivo = "Ocorreram erros durante a tentativa de login.";
                                    $scope.error.message = "Necessário verificar o e-mail para poder logar-se no sistema.";
                                } else {
                                    $cookies.putObject('user', data);

                                    if (data.tipo_usuario === 1)
                                        $location.path('inicio'); else if (data.tipo_usuario === 2)
                                        $location.path('inicio_revendedor'); else if (data.tipo_usuario === 3)
                                        $location.path('inicio_cliente'); else if (data.tipo_usuario === 4)
                                        $location.path('consultas');
                                    else
                                        console.log(data);
                                }
                            });
                        }, function (data) {
                            $scope.error.error = true;
                            $scope.error.descritivo = "Ocorreram erros durante a tentativa de login.";
                            $scope.error.message = data.data.error_description;
                        });
                    }
                });
            }
        }
        
        $scope.esqueceuSenha = function () {
            if($scope.user.username === '' || $scope.user.username === undefined){
                toastr.options.progressBar = true;
                toastr.options.closeDuration = 500;
                toastr.error("Preencha o campo 'Usuário' com o usuário a ter sua senha recuperada!",'Notificação de sistema');
            } else {
                $scope.error.error = true;
                $scope.error.descritivo = "Enviando e-mail...";

                $http.get("/email/senha?usuario="+$scope.user.username).success(function(response) {
                    $scope.resultado = response;
                    //console.log($scope.resultado);

                    $scope.error.error = true;
                    if($scope.resultado.mensagem.indexOf("Foi enviado um e-mail") > -1)
                        $scope.error.descritivo = "Informação do sistema";
                    else
                        $scope.error.descritivo = "Ocorreram erros na solicitação.";

                    $scope.error.message = $scope.resultado.mensagem;ßß
                });
            }
        }

        function GetFormattedDate() {
            var todayTime = new Date();
            var month = todayTime .getMonth() + 1;
            var day = ("00"+todayTime .getDate()).slice(-2);
            var year = todayTime .getFullYear();
            return year +"-"+ month + "-" + day  ;
        }

    }]);