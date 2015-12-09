angular.module('app.controllers')
    .controller('MenuController', ['$scope','$cookies', '$location', '$uibModal', 'UsuariosEditar','Cliente',function($scope,$cookies,$location,$uibModal,UsuariosEditar,Cliente){
        $scope.user = $cookies.getObject('user');
        $scope.$location = $location;
        $scope.menuRelatorios = false;

        $scope.isAdmin = function isAdmin(){
            if($scope.user.tipo_usuario == 1)
                return true;
        };

        $scope.isDealer = function isAdmin(){
            if($scope.user.tipo_usuario == 2)
                return true;
        };

        $scope.isClient = function isAdmin(){
            if($scope.user.tipo_usuario == 3)
                return true;
        };

        $scope.isUser = function isAdmin(){
            if($scope.user.tipo_usuario == 4)
                return true;
        };

        $scope.isLogged = function(){
            if($scope.$location.$$path == "/login" || $scope.$location.$$path == "/cadastro" || $scope.$location.$$path == "/cadastro_concluir"
                || $scope.$location.$$path == "/confirmar_cadastro" || $scope.$location.$$path == "/redefinir_senha"){
                return false;
            }
            else{
                return true;
            }
        };

        $scope.ativaRelatorio = function () {
            if($scope.menuRelatorios === false)
                $scope.menuRelatorios = true;
            else
                $scope.menuRelatorios = false
        };

        $scope.desabilitaRelatorio = function () {
            if($scope.menuRelatorios === true)
                $scope.menuRelatorios = false;
        }

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO USUARIO, PASSANDO O ID DO MESMO
        $scope.editarSenha = function(item) {
            $scope.alterarSenhaUsuario = UsuariosEditar.query({id: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/usuario/usuariosNovaSenha.html',
                controller: 'ModalNovaSenha',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {

            });
        };

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO CLIENTE E PASSANDO O ID DO CLIENTE A SER EDITADO
        $scope.editCliente = function(item) {
            $scope.clienteEditar = new Cliente.get({id: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/cliente/clientesMenuEditar.html',
                controller: 'ModalClienteEditar',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                getResultsPage(1);
            });
        };
        
    }]);