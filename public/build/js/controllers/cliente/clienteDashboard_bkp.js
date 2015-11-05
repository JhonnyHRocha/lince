angular.module('app.controllers')
    .controller('ClienteDashboardController', ['$scope','$uibModal', '$route', '$location', '$routeParams', 'Cliente', 'Usuario',function($scope,$uibModal,$route,$location,$routeParams,Cliente,Usuario){
        //DADOS DE USUÁRIO
        $scope.usuarios = [];
        //DADOS DE CLIENTE
        $scope.cliente = [];
        $scope.totalClientes = 0;
        $scope.clientesPerPage = 13;

        $scope.maxSize = 5;
        $scope.bigTotalItems = 100000;

        $scope.pagination = {
            current: 1
        };
        var modalInstance = [];

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

        $scope.excluirCliente = function(cliente){
            swal({
                    title: "Exclusão de Clientes",
                    text: "Tem certeza que dezeja deletar o cliente \n"+cliente.nome,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, deletar!",
                    cancelButtonText: "Não, cancelar!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
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
                });
        };

        function getResultsPage(pageNumber){
            Cliente.query({
                page: pageNumber,
                orderBy: 'nome',
                sortedBy: 'desc',
                limit: $scope.clientesPerPage
            }, function (response) {
                $scope.clientes = response.data;
                $scope.totalClientes = response.meta.pagination.total;
            });
        }

        getResultsPage(1);

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