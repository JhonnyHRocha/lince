angular.module('app.controllers')
.controller('LoginController', ['$scope','$location', '$cookies', 'User', 'OAuth',function($scope,$location,$cookies,User,OAuth){

        $scope.user = {
            username: '',
            password: ''
        };

        $scope.error = {
            message: '',
            error: false
        };

        $scope.login = function(){
            if($scope.form.$valid){
                OAuth.getAccessToken($scope.user).then(function() {
                    User.authenticated({},{}, function(data){
                        $cookies.putObject('user',data);

                        if(data.tipo_usuario === 1)
                            $location.path('inicio');
                        else if(data.tipo_usuario === 2)
                            $location.path('inicio_revendedor');
                        else if(data.tipo_usuario === 3)
                            $location.path('inicio_cliente');
                        else
                            console.log(data);


                    });
                }, function(data2){
                    $scope.error.error = true;
                    $scope.error.message = data2.data.error_description;
                });
            }
        };
    }]);