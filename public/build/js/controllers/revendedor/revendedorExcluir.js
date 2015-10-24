angular.module('app.controllers')
    .controller('RevendedoresExcluirController', ['$scope', '$location', '$routeParams', 'Revendedores',function($scope,$location,$routeParams,Revendedores){
        $scope.revendedores = new Revendedores.get({id: $routeParams.id});

        $scope.remove = function(){
            $scope.revendedores.$delete().then(function(){
                $location.path('/revendedores');
            });
        }
    }]);