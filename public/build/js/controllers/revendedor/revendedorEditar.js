angular.module('app.controllers')
    .controller('RevendedoresEditarController', ['$scope', '$location', '$routeParams' ,'Revendedores',function($scope,$location,$routeParams,Revendedores){
        $scope.revendedores = new Revendedores.get({id: $routeParams.id});

        $scope.save = function(){
            if($scope.form.$valid){
                Cliente.update({id: $scope.revendedores.id}, $scope.revendedores, function(){
                    $location.path('/revendedores');
                });
            }
        }
    }]);