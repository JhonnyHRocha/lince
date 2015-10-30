angular.module('app.controllers')
    .controller('ClienteNovoController', ['$scope', '$cookies', '$location', 'Cliente',function($scope,$cookies,$location,Cliente){
        $scope.user = $cookies.getObject('user');
        $scope.clientes = new Cliente();

        $scope.save = function(){
            if($scope.form.$valid){
                $scope.clientes.$save().then(function(){
                    $location.path('/clientes');
                });
            }
        }

        $scope.cancel = function(){
            $location.path('/clientes');
        }

    }]);