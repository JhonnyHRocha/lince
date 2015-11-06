angular.module('app.controllers')
    .controller('ClienteDashboardController', ['$scope','$uibModal','$cookies','$route', '$location', '$routeParams', 'Cliente', 'Usuario','ClienteDashboard'
        ,function($scope,$uibModal,$cookies,$route,$location,$routeParams,Cliente,Usuario,ClienteDashboard){

        //DECLARACAO DA VARIAVEL QUE IRA GUARDAR A INSTANCIA DO MODAL DE EXIBICAO
        var modalInstance = [];

        //DADOS DE USUÁRIO
        $scope.usuarios = [];

        //DADOS E CONFIGURACOES PARA EXIBICAO DO CLIENTE
        $scope.cliente = [];
        $scope.totalClientes = 0;
        $scope.clientesPerPage = 13;
        $scope.maxSize = 5;
        $scope.bigTotalItems = 100000;

        //INICIA A VIEW COM A PAGINA 1 SENDO A PRINCIPAL
        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function(newPage){
            getResultsPage(newPage);
        };

        //PEGO O USUARIO QUE ESTA CONECTADO NO SISTEMA E PASSO COMO PARAMETRO O ID PARA IDENTIFICAR O TIPO DE USUARIO E TRAZER A QUERY
        //DE ACORDO COM O SEU TIPO
        function getResultsPage(pageNumber){
            $scope.tipo_usuario = $cookies.getObject('user');
            ClienteDashboard.query({
                id: $scope.tipo_usuario.id,
                page: pageNumber,
                orderBy: 'nome',
                sortedBy: 'desc',
                limit: $scope.clientesPerPage
            }, function (response) {
                $scope.clientes = response.data;
                $scope.totalClientes = response.total;
            });
        }
        getResultsPage(1);

        //MODAL COM A OPCAO DE CONFIRMAR A EXCLUSAO DO CLIENTE OU CANCELAR A MESMA
        $scope.excluirCliente = function(cliente){
            swal({
                    title: "Exclusão de Clientes",
                    text: "Tem certeza que dezeja deletar o cliente \n"+cliente.nome,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, deletar!",
                    cancelButtonText: "Não, cancelar!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm){
                    if (isConfirm) {
                        swal("Deletado!", "O Cliente foi deletado com sucesso!", "success");
                        $scope.cadastro = new Cliente();
                        $scope.cadastro.$delete({id: cliente.id}).then(function(){
                            $route.reload();
                        });
                    } else {
                        swal("Cancelado", "O Cliente continua em sua base de dados ", "error");
                    }
                }
            );
        };

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO CLIENTE E PASSANDO O ID DO CLIENTE A SER EDITADO
        $scope.editCliente = function(item) {
            $scope.clienteEditar = new Cliente.get({id: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/cliente/editar.html',
                controller: 'ClienteEditar',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                getResultsPage(1);
            });
        };

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO CLIENTE E PASSANDO O ID DO CLIENTE A SER EDITADO
        $scope.editVendas = function(item) {
            $scope.clienteEditar = new Cliente.get({id: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/cliente/vendas.html',
                controller: 'ClienteVendasSistema',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {});
        };

        //FUNCAO EM JS REFERENTE AO FILTRO DE SELECAO DO STATUS DO CLIENTE
        $(".selecionarFiltro").select2({
            placeholder: "Selecione o cliente",
            allowClear: true
        });

        var config = {
            '.chosen-select'           : {},
            '.chosen-select-deselect'  : {allow_single_deselect:true},
            '.chosen-select-no-single' : {disable_search_threshold:10},
            '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
            '.chosen-select-width'     : {width:"95%"}
        };
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }
            $('.footable').footable();

    }]);


//  -------------------------------------------------------------------------------------------------------------------------------------------

//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ClienteEditar', function ($scope,Cliente,$modalInstance,appConfig) {

    $scope.status = appConfig.cliente.status;

    $scope.ok = function () {
        $modalInstance.close($scope.usuarioEditar.id);
    };

    //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //FUNÇAO DE SALVAR O CLIENTE E APOS CONCLUIDO FECHA O MODAL
    $scope.saveCliente = function(){
        if($scope.form.$valid){
            $scope.clienteEditar.cpf_cnpj = $scope.clienteEditar.cpf_cnpj.replace(".","").replace(".","").replace("/","").replace("-","");
            Cliente.update({id: $scope.clienteEditar.id}, $scope.clienteEditar, function(){
                $modalInstance.dismiss();

                toastr.options.progressBar = true;
                toastr.options.closeDuration = 300;
                toastr.success('O cliente foi atualizado com êxito!','Notificação de sistema');
            });
        }
    }
        $('.footable').footable();
});

//  -------------------------------------------------------------------------------------------------------------------------------------------

//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ClienteVendasSistema', function ($scope,Cliente,$modalInstance) {
        $scope.quantidade_usuarios = 1;

        $scope.ok = function () {
            $modalInstance.close($scope.usuarioEditar.id);
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        //FUNÇAO DE SALVAR O CLIENTE E APOS CONCLUIDO FECHA O MODAL
        $scope.saveCliente = function(){
            if($scope.form.$valid){
                $scope.clienteEditar.cpf_cnpj = $scope.clienteEditar.cpf_cnpj.replace(".","").replace(".","").replace("/","").replace("-","");
                Cliente.update({id: $scope.clienteEditar.id}, $scope.clienteEditar, function(){
                    $modalInstance.dismiss();
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.success('O cliente foi atualizado com êxito!','Notificação de sistema');
                });
            }
        }

        $('.footable').footable();
    });