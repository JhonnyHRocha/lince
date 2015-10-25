angular.module('app.controllers')
    .controller('ClienteListaController', ['$scope','Cliente',function($scope,Cliente){
        $scope.clientes = Cliente.query();

        $scope.selecionaId = function(parm) {
            $scope.IdSelecionado = parm;
        }
    }]);

