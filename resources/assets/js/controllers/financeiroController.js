angular.module('app.controllers')
    .controller('FinanceiroController', ['$scope','$cookies','$window','$uibModal','Venda','ClienteListagem','Vendedor','Valores', function($scope,$cookies,$window,$uibModal,Venda,ClienteListagem,Vendedor,Valores){
        $scope.vendas = Venda.get();
        $scope.clientes = ClienteListagem.get();
        $scope.vendedores = Vendedor.get();
        $scope.valores = Valores.query();

        $scope.geraBoleto = function($id_venda) {
            $window.open('boleto/' + $id_venda, '_blank');
        };

        //FILTROS QUE UTILIZAM CAMPO SELECT (CLIENTE / VENDEDOR)
        $("#selectFiltroCliente").change(function () {
            if(!$(this).val()){
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.filtroCliente = "";
                    });
                }, 500);
            }
        });

        $("#selectFiltroVendedor").change(function () {
            if(!$(this).val()){
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.filtroVendedor = "";
                    });
                }, 500);
            }
        });

        //CAMPO DATA PARA FILTRAGEM DA DATA DE VENDA
        $('#data_1').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format: "yyyy-mm-dd"
        });

        //FUNCAO EM JS REFERENTE AO FILTRO DE SELECAO DO STATUS DO CLIENTE
        $(".selecionarFiltro").select2({
            placeholder: "Selecione o cliente",
            allowClear: true
        });

        var config = {
            '.chosen-select'           : {},
            '.chosen-select-deselect'  : {allow_single_deselect:true},
            '.chosen-select-no-single' : {disable_search_threshold:10},
            '.chosen-select-no-results': {no_results_text:'Nenhum resultado encontrado'},
            '.chosen-select-width'     : {width:"95%"}
        };
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO STATUS DA VENDA, PASSANDO O ID DA MESMA
        $scope.statusVenda = function(item) {
            $scope.vendaEditar = new Venda.query({id: item});
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
                Valores.query(function (response) {
                    $scope.valores = response;
                });
            });
        };

    }]);

//  -------------------------------------------------------------------------------------------------------------------------------------------

//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalStatusVenda', function ($scope,$window,VendasCliente,Venda,$modalInstance,$filter,$http,$cookies,$location,appConfig,Valores) {
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
                });
            }
        }
    });


//  -------------------------------------------------------------------------------------------------------------------------------------------

//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('FinanceiroNovaVenda', function ($scope,Venda,$filter,$http,$cookies,$location,ClienteListagem) {
        $scope.user = $cookies.getObject('user');
        $scope.clientes = ClienteListagem.get();

        //DECLARA AS VARIAVEIS QUE SERAO UTILIZADAS PARA CHEGAR AO VALOR FINAL DA VENDA
        $scope.quantidade_usuarios = 1;
        $scope.valorUsuario = 100;


        //APLICA O FILTRO MONETARIO NA MULTIPLICACAO DA QUANTIDADE DE USUARIOS COM O VALOR DO PACOTE
        $scope.$watch('quantidade_usuarios', function() {
            $scope.totalVenda = $filter("currency")($scope.quantidade_usuarios * $scope.valorUsuario);
            $scope.totalVenda = $scope.totalVenda.replace("$","R$ ");
        });

        $scope.ok = function () {
            $modalInstance.close($scope.usuarioEditar.id);
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        //FUNÇAO DE SALVAR O CLIENTE E APOS CONCLUIDO FECHA O MODAL
        $scope.salvarVenda = function(){
            $scope.vendasNovo = new Venda();
            console.log($scope.clientes.id);
            if($scope.form.$valid){
                var request = $http({
                    method: "post",
                    url: '/venda',
                    data: {
                        id_cliente: $scope.clientes.id,
                        id_pacote: pacote.value,
                        data_venda: new Date(),
                        id_vendedor: $scope.user.id,
                        quantidade_usuarios: $scope.quantidade_usuarios,
                        quantidade_consultas: 10000,
                        status_pagamento: 2,
                        valor: valor.value.replace("R$ ","").replace(",","")
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });

                request.success(function (data) {
                    $location.url("/financeiro");
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.success('Venda adicionada com sucesso! Aguardando confirmação de pagamento.','Notificação de sistema');
                });
            }
        }

        //FUNCAO EM JS REFERENTE AO FILTRO DE SELECAO DO STATUS DO CLIENTE
        $(".selecionarFiltro").select2({
            placeholder: "Selecione o cliente",
            allowClear: true
        });

        var config = {
            '.chosen-select'           : {},
            '.chosen-select-deselect'  : {allow_single_deselect:true},
            '.chosen-select-no-single' : {disable_search_threshold:10},
            '.chosen-select-no-results': {no_results_text:'Nenhum resultado encontrado'},
            '.chosen-select-width'     : {width:"95%"}
        };
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }
    });