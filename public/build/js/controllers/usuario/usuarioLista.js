angular.module('app.controllers')
    .controller('ClienteListaController',
    ['$scope', '$routeParams','Cliente',function($scope,$routeParams,Cliente){
        $scope.clientes = [];
        $scope.totalClientes = 0;
        $scope.clientesPerPage = 15;

        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function(newPage) {
            getResultsPage(newPage);
        };

        function getResultsPage(pageNumber) {
            Cliente.query({
                page: pageNumber,
                limit: $scope.clientesPerPage
            }, function (data) {
                $scope.clientes = data.data;
                $scope.totalClientes = data.meta.pagination.total;
            });
        }

        getResultsPage(1);
    }]);







