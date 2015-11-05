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

        //SE HOUVER ALTERACAO NA PAGINA, EXIBE OS RESULTADOS DA MESMA
        $scope.pageChanged = function(newPage){
            getResultsPage(newPage);
        };

        $scope.exibirCliente = function (cliente) {
            $scope.cliente = cliente;

            $scope.usuarios = Usuario.query({
               id: $scope.cliente.id
            },function (data) {
                $scope.usuarios = data;
            });
        };

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


        // SESSÃO REFERENTE AOS USUARIOS
        //MODAL
        function atualizarUsuarios(){
            $scope.usuarios = Usuario.query({
                id: $scope.cliente.id
            },function (data) {
                $scope.usuarios = data;
            });
        }

        //ABRE UM MODAL COM A TELA DE EDICAO DO USUARIO
        $scope.editUser = function(item) {
            $scope.usuarioEditar = new Usuario.get({id: $scope.cliente.id, idUsuario: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/usuario/editar.html',
                controller: 'ModalInstanceCtrl',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                atualizarUsuarios();
            });
        };

        $scope.editCliente = function(item) {
            $scope.clienteEditar = new Cliente.get({id: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/cliente/editar.html',
                controller: 'ModalInstanceCtrl',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {

            });
        };

        //FUNÇAO DE SALVAR O USUARIO
        $scope.save = function(){
            if($scope.form.$valid){
                Usuario.update({id: $scope.cliente.id, idUsuario: $scope.usuarioEditar.id}, $scope.usuarioEditar, function(){
                    modalInstance.dismiss('close');
                    toastr.success('O usuário foi atualizado com êxito!','Notificação de sistema');
                });
            }
        };

        //EXCLUSAO DO USUARIO
        $scope.excluirUsu= function(id_usu){
            swal({
                    title: "Exclusão de Usuário",
                    text: "Tem certeza que dezeja deletar o usuário \n"+$scope.usuarioEditar.name,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, deletar!",
                    cancelButtonText: "Não, cancelar!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        swal("Deletado!", "O Usuário foi deletado com sucesso!", "success");
                        $scope.cadastro = new Usuario();
                        $scope.cadastro.$delete({id: $scope.cliente.id, idUsuario: id_usu}).then(function(){
                            atualizarUsuarios();
                        });
                    } else {
                        swal("Cancelado", "O Usuário continua em sua base de dados ", "error");
                    }
                });
        };

        //ABRE UM MODAL COM A TELA DE ALTERACAO DA SENHA DO USUARIO
        $scope.updatePass = function(item) {
            $scope.usuarioEditar = new Usuario.get({id: $scope.cliente.id, idUsuario: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/usuario/novaSenha.html',
                controller: 'ModalInstanceCtrl',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {

            }, function() {
                atualizarUsuarios();
            });
        };

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

    }]);

//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalInstanceCtrl', function ($scope,Cliente,$modalInstance) {

    $scope.ok = function () {
        $modalInstance.close($scope.usuarioEditar.id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //FUNÇAO DE SALVAR O CLIENTE
    $scope.saveCliente = function(){
        if($scope.form.$valid){
            $scope.clienteEditar.cpf_cnpj = $scope.clienteEditar.cpf_cnpj.replace(".","").replace(".","").replace("/","").replace("-","");
            Cliente.update({id: $scope.clienteEditar.id}, $scope.clienteEditar, function(){
                $modalInstance.dismiss();
                toastr.success('O cliente foi atualizado com êxito!','Notificação de sistema');
            });
        }
    }
});