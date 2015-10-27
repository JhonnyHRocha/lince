angular.module('app.controllers')
    .controller('ClienteDashboardController', ['$scope', '$location', '$routeParams' ,'Cliente',function($scope,$location,$routeParams,Cliente){
        $scope.cliente = [];
        $scope.totalClientes = 0;
        $scope.clientesPerPage = 15

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;

        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function(newPage){
            getResultsPage(newPage);
        }


        $scope.exibirCliente = function (cliente) {
            $scope.cliente = cliente;
        };

        function getResultsPage(pageNumber){
            Cliente.query({
                page: pageNumber,
                orderBy: 'nome',
                sortedBy: 'desc',
                limit: $scope.clientesPerPage
            }, function (response) {
                $scope.clientes = response.data;
                $scope.totalClientes = response.meta.pagination.total;
            });
        }

        getResultsPage(1);
    }]);






/*
angular.module('app.controllers')
    .controller('ClienteDashboardController', ['$scope', '$location', '$routeParams' ,'Cliente',function($scope,$location,$routeParams,Cliente){
        $scope.cliente = [];
        $scope.totalClientes = 0;
        $scope.clientesPerPage = 15

        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function(newPage){
            getResultsPage(newPage);
        }

        function getResultsPage(pageNumber){
            Cliente.query({
                page: pageNumber
                orderBy: 'nome',
                sortedBy: 'desc',
                limit: $scope.clientesPerPage
            }, function (response) {
                $scope.clientes = response.data;
                $scope.totalClientes = response.meta.pagination.total;
            });
        }

        $scope.exibirCliente = function (cliente) {
            $scope.cliente = cliente;
        };

        getResultsPage(1);
    }]);*/