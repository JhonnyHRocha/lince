angular.module('app.controllers')
    .controller('ClienteEditarController', ['$scope', '$location', '$routeParams' ,'Cliente',function($scope,$location,$routeParams,Cliente){
        $scope.clientes = new Cliente.get({id: $routeParams.id});

        $scope.save = function(){
            if($scope.form.$valid){
                Cliente.update({id: $scope.clientes.id}, $scope.clientes, function(){
                    $location.path('/clientes');
                });
            }
        }
    }]);