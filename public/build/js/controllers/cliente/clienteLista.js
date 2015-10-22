angular.module('app.controllers')
    .controller('ClienteListaController', ['$scope','Cliente',function($scope,Cliente){
        $scope.clientes = [];
        $scope.clientes = Cliente.query();
    }]);