angular.module('app.controllers')
    .controller('ClienteDashboardController', ['$scope', '$route', '$location', '$routeParams', 'Cliente', 'Usuario',function($scope,$route,$location,$routeParams,Cliente,Usuario,$teste){
        //DADOS DE USUÁRIO
        $scope.usuarios = [];
        $scope.usuarioEditar = [];
        $scope.usuarioEditarOri = [];
        //DADOS DE CLIENTE
        $scope.cliente = [];
        $scope.totalClientes = 0;
        $scope.clientesPerPage = 10;

        $scope.maxSize = 5;
        $scope.bigTotalItems = 175;

        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function(newPage){
            getResultsPage(newPage);
        };

        $scope.exibirCliente = function (cliente) {
            $scope.cliente = cliente;

            $scope.usuarios = Usuario.query({
               id: $scope.cliente.id
            },function (data) {
                $scope.usuarios = data;
            });
        };

        $scope.excluirCliente = function(id_cliente){
            swal({
                    title: "Exclusão de Clientes",
                    text: "Tem certeza que dezeja deletar o cliente \n"+$scope.cliente.nome,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, deletar!",
                    cancelButtonText: "Não, cancelar!",
                    closeOnConfirm: false,
                    closeOnCancel: false },
                function(isConfirm){
                    if (isConfirm) {
                        swal("Deletado!", "O Cliente foi deletado com sucesso!", "success");
                        $scope.cadastro = new Cliente();
                        $scope.cadastro.$delete({id: id_cliente}).then(function(){
                            $route.reload();
                        });
                    } else {
                        swal("Cancelado", "O Cliente continua em sua base de dados ", "error");
                    }
                });
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

        //MODAL
        $('#data_1 .input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format: "dd/mm/yyyy"
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

        $scope.editItem = function(item) {
            $scope.usuarioEditar = item;
        };

        $scope.save = function(){
            if($scope.form.$valid){
                Usuario.update({id: $scope.cliente.id, idUsuario: $scope.usuarioEditar.id}, $scope.usuarioEditar, function(){
                    //$location.path('/clientes');
                });
            }
        }

        $scope.cancelEdit = function(){

        }

    }]);