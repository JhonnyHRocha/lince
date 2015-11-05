angular.module('app.controllers')
    .controller('ClienteEditarController', ['$scope', '$location', '$routeParams' ,'Cliente',function($scope,$location,$routeParams,Cliente, $modalInstance){
        $scope.clientes = new Cliente.get({id: $routeParams.id});

        $scope.save = function(){
            if($scope.form.$valid){
                Cliente.update({id: $scope.clientes.id}, $scope.clientes, function(){
                    $location.path('/clientes');
                });
            }
        }

        $scope.ok = function () {
            $modalInstance.close($scope.clienteEditar.id);
        };

        $scope.cancel = function () {
            console.log('teste');
            $modalInstance.close();
        };
    }]);