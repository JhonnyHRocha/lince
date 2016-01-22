angular.module('app.controllers')
    .controller('RevendedoresNovoController', ['$scope', '$location', 'Revendedores',function($scope,$location,Revendedores){
        $scope.revendedores = new Revendedores();

        $scope.save = function(){
            if($scope.form.$valid){
                $scope.revendedores.$save().then(function(){
                    $location.path('/revendedores');
                });
            }
        }

    }]);