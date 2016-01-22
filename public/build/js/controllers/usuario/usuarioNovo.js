angular.module('app.controllers')
    .controller('UsuarioNovoController', ['$scope', '$location', 'Usuario', 'Cliente',function($scope,$location,Usuario,Cliente){
        $scope.usuarios = new Usuario();

        $scope.clientes = Cliente.query({
            limit: 99999999
        }, function (data) {
            $scope.clientes = data.data;
            $scope.totalClientes = data.meta.pagination.total;
        });

        $scope.save = function(){
            if($scope.form.$valid){
                $scope.usuarios.$save().then(function(){
                    $location.path('/usuarios');
                });
            }
        };

        $scope.cancel = function(){
            $location.path('/usuarios');
        };

        $('#data_1 .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true
        });

        $(".selecionarFiltro").select2({
            placeholder: "Selecione o cliente",
            allowClear: true
        });

        var config = {
            '.chosen-select'           : {},
            '.chosen-select-deselect'  : {allow_single_deselect:true},
            '.chosen-select-no-single' : {disable_search_threshold:10},
            '.chosen-select-no-results': {no_results_text:'Oops, nothing found!'},
            '.chosen-select-width'     : {width:"95%"}
        };
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }

    }]);