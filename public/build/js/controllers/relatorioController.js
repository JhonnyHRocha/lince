angular.module('app.controllers')
    .controller('RelatorioConsultasController', ['$scope','$cookies','$http','appConfig','ClienteListagem',
    function($scope,$cookies,$http,appConfig,ClienteListagem){
        $scope.clientes = ClienteListagem.get();
        $scope.parametroTipoConsulta = appConfig.relatorios.tipo_consulta;
        $scope.relatorios = "";

        //SETAR DATA PARA O PARAMETRO DE INICIO E FIM DE PERIODO
        var data = new Date();
        $scope.parametroDataInicial = data.getDate()+'/'+data.getMonth()+'/'+data.getFullYear();
        $scope.parametroDataFinal = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();



        //GERAR RELATORIO
        $scope.gerarRelatorio = function () {
            var i = $scope.parametroDataInicial.slice(0, 10).split('/');
            var f = $scope.parametroDataFinal.slice(0, 10).split('/');
            var e = document.getElementById("tipoConsulta");
            var tipoConsulta = e.options[e.selectedIndex].value;

            var query = "inicio="+i[2] +'-'+ i[1] +'-'+ ("00"+i[0]).slice(-2) + "&fim=" + f[2] +'-'+ f[1] +'-'+ ("00"+f[0]).slice(-2);
            if($scope.parametroUsuario)
                query = query + "&usuario=" + $scope.parametroUsuario;
            if($scope.parametroCliente)
                query = query + "&cliente=" + $scope.parametroCliente;
            if(tipoConsulta !== "? object:31 ?" & tipoConsulta !== "")
                query = query + "&tipo_consulta" + tipoConsulta;

            $http.get("/relatorio/consultas?" + query).success(function(response) {
                $scope.relatorios = response;
            });
        };


        //JAVASCRIPT REFERENTE AO PERIODO QUE O RELATORIO VAI SER GERADO
        $('#data_5 .input-daterange').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format: "dd/mm/yyyy"
        });

        //FUNCAO EM JS REFERENTE AO FILTRO DE SELECAO DO STATUS DO CLIENTE
        $(".selecionarFiltro").select2({
            placeholder: "Selecione o cliente",
            allowClear: true
        });

        var config = {
            '.chosen-select'           : {},
            '.chosen-select-deselect'  : {allow_single_deselect:true},
            '.chosen-select-no-single' : {disable_search_threshold:10},
            '.chosen-select-no-results': {no_results_text:'Nenhum resultado encontrado'},
            '.chosen-select-width'     : {width:"95%"}
        };
        for (var selector in config) {
            $(selector).chosen(config[selector]);
        }

        //CHECKBOX
        $('.i-checks').iCheck({
            checkboxClass: 'icheckbox_square-green',
            radioClass: 'iradio_square-green',
        });
    }]);



// ------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------CONTROLLER REFERENTE AO RELATORIO DE VENDAS--------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------

angular.module('app.controllers')
    .controller('RelatorioVendasController', ['$scope','$cookies','$http','appConfig','ClienteListagem','Vendedor',
        function($scope,$cookies,$http,appConfig,ClienteListagem,Vendedor){
            $scope.clientes = ClienteListagem.get();
            $scope.vendedores = Vendedor.get();
            $scope.parametroTipoConsulta = appConfig.relatorios.tipo_consulta;
            $scope.relatorios = "";

            //SETAR DATA PARA O PARAMETRO DE INICIO E FIM DE PERIODO
            var data = new Date();
            $scope.parametroDataInicial = data.getDate()+'/'+data.getMonth()+'/'+data.getFullYear();
            $scope.parametroDataFinal = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();


            //GERAR RELATORIO
            $scope.gerarRelatorio = function () {
                var i = $scope.parametroDataInicial.slice(0, 10).split('/');
                var f = $scope.parametroDataFinal.slice(0, 10).split('/');

                var query = "inicio="+i[2] +'-'+ i[1] +'-'+ ("00"+i[0]).slice(-2) + "&fim=" + f[2] +'-'+ f[1] +'-'+ ("00"+f[0]).slice(-2);
                if($scope.parametroVendedor || $scope.parametroVendedor === 0)
                    query = query + "&vendedor=" + $scope.parametroVendedor;
                if($scope.parametroCliente)
                    query = query + "&cliente=" + $scope.parametroCliente;
                if($scope.parametroStatus)
                    query = query + "&status=" + $scope.parametroStatus;


                $http.get("/relatorio/vendas?" + query).success(function(response) {
                    $scope.relatorios = response;
                });
            };


            //JAVASCRIPT REFERENTE AO PERIODO QUE O RELATORIO VAI SER GERADO
            $('#data_5 .input-daterange').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true,
                format: "dd/mm/yyyy"
            });

            //FUNCAO EM JS REFERENTE AO FILTRO DE SELECAO DO STATUS DO CLIENTE
            $(".selecionarFiltro").select2({
                placeholder: "Selecione o cliente",
                allowClear: true
            });

            var config = {
                '.chosen-select'           : {},
                '.chosen-select-deselect'  : {allow_single_deselect:true},
                '.chosen-select-no-single' : {disable_search_threshold:10},
                '.chosen-select-no-results': {no_results_text:'Nenhum resultado encontrado'},
                '.chosen-select-width'     : {width:"95%"}
            };
            for (var selector in config) {
                $(selector).chosen(config[selector]);
            }

            //CHECKBOX
            $('.i-checks').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio_square-green',
            });
        }]);