angular.module('app.controllers')
    .controller('ClienteExcluirController', ['$scope', '$location', '$routeParams', 'Cliente',function($scope,$location,$routeParams,Cliente){
        $scope.clientes = new Cliente.get({id: $routeParams.id});

        $scope.remove = function(){
            $scope.clientes.$delete().then(function(){
                $location.path('/clientes');
            });
        }
    }]);