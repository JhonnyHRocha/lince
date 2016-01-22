angular.module('app.controllers')
    .controller('InicioAdministradorController', ['$scope','$cookies','$http','$uibModal','InicioUltimosMeses','InicioClienteStatus','Venda','InicioRankingVendas',
    function($scope,$cookies,$http,$uibModal,InicioUltimosMeses,InicioClienteStatus,Venda,InicioRankingVendas){
        //console.log($cookies.getObject('user').email);
        $scope.vendas = Venda.get();
        $scope.filtroStatusVendas = 2;
        $scope.ranking = InicioRankingVendas.query({id: $cookies.getObject('user').id});

        //SELECT PARA EXIBICAO DOS USUARIOS POR STATUS
        $scope.clienteStatus = InicioClienteStatus.query({id: $cookies.getObject('user').id});

        //GRAFICO DE VENDAS DOS ULTIMOS 6 MESES
        $scope.myModel = InicioUltimosMeses.query();
        $scope.xkey = 'mes';
        $scope.ykeys = ['pago', 'aguardando'];
        $scope.labels = ['Total de Vendas R$', 'Total de Despesas R$'];


        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO STATUS DA VENDA, PASSANDO O ID DA MESMA
        $scope.statusVenda = function(item) {
            $scope.vendaEditar = new Venda.query({id: item});
            $scope.atualiza = 0;
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/financeiro/financeiroStatusVenda.html',
                controller: 'ModalStatusVenda',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                Venda.get(function (response) {
                    $scope.vendas = response;
                });
                $scope.ranking = InicioRankingVendas.query({id: $cookies.getObject('user').id});
                $scope.myModel = InicioUltimosMeses.query();
            });
        };
    }]);


//  -------------------------------------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------------------------------------------------------------------------------------------------

angular.module('app.controllers')
    .controller('InicioRevendedorController', ['$scope','$cookies',function($scope,$cookies){
        //console.log($cookies.getObject('user').email);
    }]);





//  -------------------------------------------------------------------------------------------------------------------------------------------
//  -------------------------------------------------------------------------------------------------------------------------------------------

angular.module('app.controllers')
    .controller('InicioClienteController', ['$scope','$cookies','$window','$uibModal','InicioHistoricoVendas','InicioDadosGerals','InicioConsultasUsuarios','InicioUltimosMeses','InicioUltimasConsultas',
    function($scope,$cookies,$window,$uibModal,InicioHistoricoVendas,InicioDadosGerals,InicioConsultasUsuarios,InicioUltimosMeses,InicioUltimasConsultas){
        $scope.vendas = InicioHistoricoVendas.query({id: $cookies.getObject('user').id_cliente});
        $scope.dadosGeral = InicioDadosGerals.query({id: $cookies.getObject('user').id_cliente});
        $scope.ultimasConsultas = InicioUltimasConsultas.query({id: $cookies.getObject('user').id_cliente});

        $scope.geraBoleto = function($id_venda) {
            $window.open('boleto/' + $id_venda, '_blank');
        };

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO STATUS DA VENDA, PASSANDO O ID DA MESMA
        $scope.novaCompra = function() {
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/painel/inicioClienteVenda.html',
                controller: 'ModalNovaVenda',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                $scope.vendas = InicioHistoricoVendas.query({id: $cookies.getObject('user').id_cliente});
            });
        };


        //ABRE O MODAL CHAMANDO A TELA DE ADICAO DO USUARIO
        $scope.usuarioAdicional = function() {
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/painel/inicioClienteVendaAdicional.html',
                controller: 'ModalNovaVendaUsuarioAdicional',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                $scope.vendas = InicioHistoricoVendas.query({id: $cookies.getObject('user').id_cliente});
            });
        };

        //GRAFICO DE CONSULTAS POR USUARIOS
        //$scope.myModel = InicioConsultasUsuarios.query({id: $cookies.getObject('user').id_cliente});
        //$scope.xkey = 'consultas';
        //$scope.ykeys = ['nome','consultas'];
        //$scope.labels = ['Consultas realizadas','Consultas'];

    }]);





//  -------------------------------------------------------------------------------------------------------------------------------------------

//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalStatusVenda', function ($scope,$window,VendasCliente,Venda,$modalInstance,$filter,$http,$cookies,$location,appConfig,Valores,InicioRankingVendas) {
        $scope.user = $cookies.getObject('user');
        $scope.tipo_pagamento = appConfig.financeiro.tipo_pagamento;
        $scope.status_pagamento = appConfig.financeiro.status_pagamento;

        $scope.ok = function () {
            $modalInstance.close($scope.usuarioEditar.id);
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.refresh = function(){
            $scope.vendas = Venda.get();
            $scope.valores = Valores.query();
        }

        //FUNÇAO DE SALVAR O CLIENTE E APOS CONCLUIDO FECHA O MODAL
        $scope.salvarVenda = function(){
            if($scope.form.$valid){
                Venda.update({id: $scope.vendaEditar.id_venda}, $scope.vendaEditar, function(){
                    $modalInstance.dismiss();
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.success('A venda foi atualizada com êxito!','Notificação de sistema');

                    if($scope.vendaEditar.id_pacote === 1){
                        if($scope.vendaEditar.status_pagamento === 1 ){
                            var data = new Date();
                            var request = $http({
                                method: "put",
                                url: 'venda/credito/'+ $scope.vendaEditar.id_cliente,
                                data: {
                                    data_liberacao: data,
                                    data_expiracao: data.addDays(30),
                                    quantidade_usuarios: $scope.vendaEditar.quantidade_usuarios,
                                    quantidade_consultas: 10000,
                                    valor: $scope.vendaEditar.valor
                                },
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            });
                            request.success(function (data) {

                            });
                        }
                    } else if($scope.vendaEditar.id_pacote === 2){
                        if($scope.vendaEditar.status_pagamento === 1 ){
                            var data = new Date();
                            var request = $http({
                                method: "put",
                                url: 'venda/credito/'+ $scope.vendaEditar.id_cliente,
                                data: {
                                    id_pacote: 2,
                                    data_liberacao: data,
                                    data_expiracao: data.addDays(30),
                                    quantidade_usuarios: $scope.vendaEditar.quantidade_usuarios,
                                    quantidade_consultas: 10000,
                                    valor: $scope.vendaEditar.valor
                                },
                                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                            });
                            request.success(function (data) {

                            });
                        }
                    }

                });
            }
        }

        Date.prototype.addDays = function(days)
        {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        }
    });


//  -------------------------------------------------------------------------------------------------------------------------------------------
//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalNovaVenda', function ($scope,$window,Venda,$modalInstance,$filter,$http,$cookies) {
        $scope.user = $cookies.getObject('user');

        //DECLARA AS VARIAVEIS QUE SERAO UTILIZADAS PARA CHEGAR AO VALOR FINAL DA VENDA
        $scope.quantidade_usuarios = 1;
        $scope.valorUsuario = 100;

        //APLICA O FILTRO MONETARIO NA MULTIPLICACAO DA QUANTIDADE DE USUARIOS COM O VALOR DO PACOTE
        $scope.$watch('quantidade_usuarios', function() {
            $scope.totalVenda = $filter("currency")($scope.quantidade_usuarios * $scope.valorUsuario);
            $scope.totalVenda = $scope.totalVenda.replace("$","R$ ");
        });

        $scope.ok = function () {
            $modalInstance.close();
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss('');
        };

        //FUNÇAO DE SALVAR O CLIENTE E APOS CONCLUIDO FECHA O MODAL
        $scope.salvarCompra = function(){
            $scope.vendasNovo = new Venda();
            if($scope.form.$valid){
                var request = $http({
                    method: "post",
                    url: '/venda',
                    data: {
                        id_cliente: $scope.user.id_cliente,
                        id_pacote: pacote.value,
                        data_venda: new Date(),
                        id_vendedor: 0,
                        quantidade_usuarios: $scope.quantidade_usuarios,
                        quantidade_consultas: 10000,
                        status_pagamento: 2,
                        valor: valor.value.replace("R$ ","").replace(".","").replace(",",".")
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                request.success(function (data) {
                    $modalInstance.dismiss('');
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.success('Plano renovado! Aguardando confirmação de pagamento.','Notificação de sistema');
                });
            }
        };
    });


//  -------------------------------------------------------------------------------------------------------------------------------------------
//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalNovaVendaUsuarioAdicional', function ($scope,$window,Venda,$modalInstance,$filter,$http,$cookies) {
        $scope.user = $cookies.getObject('user');

        var diasExpira = $scope.dadosGeral[0].dias_expiracao;

        //DECLARA AS VARIAVEIS QUE SERAO UTILIZADAS PARA CHEGAR AO VALOR FINAL DA VENDA
        $scope.quantidade_usuarios = 1;
        $scope.valorUsuario = 100.00*diasExpira/30.00;

        //APLICA O FILTRO MONETARIO NA MULTIPLICACAO DA QUANTIDADE DE USUARIOS COM O VALOR DO PACOTE
        $scope.$watch('quantidade_usuarios', function() {
            $scope.totalVenda = $filter("currency")($scope.quantidade_usuarios * $scope.valorUsuario);
            $scope.totalVenda = $scope.totalVenda.replace("$","R$ ");
        });

        $scope.ok = function () {
            $modalInstance.close();
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss('');
        };

        //FUNÇAO DE SALVAR O CLIENTE E APOS CONCLUIDO FECHA O MODAL
        $scope.salvarCompra = function(){
            $scope.vendasNovo = new Venda();
            if($scope.form.$valid){
                var request = $http({
                    method: "post",
                    url: '/venda',
                    data: {
                        id_cliente: $scope.user.id_cliente,
                        id_pacote: pacote.value,
                        data_venda: new Date(),
                        id_vendedor: 0,
                        quantidade_usuarios: $scope.quantidade_usuarios,
                        quantidade_consultas: 10000,
                        status_pagamento: 2,
                        valor: valor.value.replace("R$ ","").replace(".","").replace(",",".")
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                request.success(function (data) {
                    $modalInstance.dismiss('');
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 1000;
                    toastr.success('Perfeito, estamos aguardando a confirmação do pagamento para liberar seus usuários.','Notificação de sistema');
                });
            }
        };
    });


