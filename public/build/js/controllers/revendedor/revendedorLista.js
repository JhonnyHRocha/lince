angular.module('app.controllers')
    .controller('RevendedoresListaController', ['$scope','Revendedores',function($scope,Revendedores){
        $scope.revendedores = Revendedores.query();
    }]);