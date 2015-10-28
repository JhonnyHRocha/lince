angular.module('app.controllers')
    .controller('usuarioDashboardController', ['$scope', '$location', '$routeParams', 'User',function($scope,$location,$routeParams,User){
        $scope.usuario = [];
        $scope.totalUsuarios = 0;
        $scope.usuariosPerPage = 15;

        $scope.maxSize = 5;

        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function(newPage){
            getResultsPage(newPage);
        };

        $scope.exibirCliente = function (usuario) {
            $scope.usuario = usuario;
        };

        function getResultsPage(pageNumber){
            Cliente.query({
                page: pageNumber,
                orderBy: 'name',
                sortedBy: 'desc',
                limit: $scope.clientesPerPage
            }, function (response) {
                $scope.usuarios = response.data;
                $scope.totalUsuarios = response.meta.pagination.total;
            });
        }

        getResultsPage(1);
    }]);