angular.module('app.controllers')
    .controller('UsuarioEditarController', ['$scope','$location', '$routeParams' ,'Usuario',function($scope,$location,$routeParams,Usuario){
        //$scope.usuarios = new Usuario.get({id: $routeParams.id, idUsuario: $routeParams.idUsuario});

        $scope.save = function(){
            if($scope.form.$valid){
                Usuario.update({id: $scope.cliente.id, idUsuario: $scope.usuarioEditar.id}, $scope.usuarioEditar, function(){
                    $route.reload();//$location.path('/clientes');
                });
            }
        };

    }]);