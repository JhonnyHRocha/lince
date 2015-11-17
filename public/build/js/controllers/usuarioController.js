angular.module('app.controllers')
    .controller('UsuarioController', ['$scope','$filter','$http','appConfig','ListagemUsuariosClientes','Usuarios','UsuariosEditar','ClienteListagem',
    function($scope,$filter,$http,appConfig,ListagemUsuariosClientes,Usuarios,UsuariosEditar,ClienteListagem){
        $scope.listagemClientes = ListagemUsuariosClientes.query();
        $scope.usuarios = new Usuarios();
        $scope.clientes = ClienteListagem.get();
        $scope.status = appConfig.usuario.status;
        $scope.idClienteSelecionado = null;
        $scope.habilitaAdicao = false;
        $scope.habilitaEdicao = false;
        $scope.habilitaBotaoAdicao = false;
        $scope.habilitaNovaSenha = false;
        $scope.exibeUsuariosMensagem = true;
        $scope.usuariosDisponiveis = 0;
        $scope.usuarioExistente = 'form-group';

        $scope.exibirUsuarios = function(idCliente, nomeCliente, usuariosDisponiveis){
            $scope.exibeUsuarios = true;
            $scope.exibeUsuariosMensagem = false;
            $scope.habilitaEdicao = false;
            $scope.habilitaAdicao = false;
            $scope.habilitaNovaSenha = false;
            $scope.usuariosDisponiveis = usuariosDisponiveis;

            $scope.listagemUsuarios = Usuarios.query({id: idCliente});
            $scope.idClienteSelecionado = idCliente;
            $scope.nomeCliente = nomeCliente;

            if(usuariosDisponiveis > 0)
                $scope.habilitaBotaoAdicao = true;
            else
                $scope.habilitaBotaoAdicao = false;
        };

        $scope.editarUsu = function(usuario){
            if($scope.habilitaEdicao != true)
                $scope.habilitaEdicao = true;
            if($scope.habilitaAdicao = true)
                $scope.habilitaAdicao = false;

            //AJUSTA A DATA DE VELIDADE PARA O FORMATO BRASILEIRO
            usuario.data_validade = $filter('date')(usuario.data_validade, 'dd/MM/yyyy');
            $scope.editarUsuario = usuario;
        };

        $scope.cancelarEdicao = function(){
            $scope.habilitaEdicao = false;
            setTimeout(function () {
                $scope.$apply(function () {
                    $scope.listagemUsuarios = Usuarios.query({id: $scope.idClienteSelecionado});
                    $scope.habilitaEdicao = false;
                });
            }, 500);
        };

        $scope.salvarEdicao = function(){
            if($scope.form.$valid){
                Usuarios.update({id: $scope.editarUsuario.id}, $scope.editarUsuario, function(){
                    $scope.habilitaEdicao = false;
                    $scope.listagemUsuarios = Usuarios.query({id: $scope.idClienteSelecionado});

                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.success('O usuário foi atualizado com êxito!','Notificação de sistema');
                    //$route.reload();//$location.path('/clientes');
                });
            }
        };

        //REFERENTE A ADIÇÃO DE UM NOVO USUARIO
        $scope.adicionarUsu = function(){
            if($scope.habilitaAdicao != true)
                $scope.habilitaAdicao = true;
            if($scope.habilitaEdicao = true)
                $scope.habilitaEdicao = false;
        };

        $scope.cancelarAdicao= function(){
            $scope.habilitaAdicao = false;
            //limpa os campos do formulário, pegando o campo pelo ID
            nomeAdicao.value = "";
            loginAdicao.value = "";
            passwordAdicao.value = "";
            validadeAdicao.value = "";
        };

        $scope.salvarAdicao = function(){
            if($scope.formAdicao.$valid){
                $http.get("cliente/usuario/" + loginAdicao.value).success(function(response) {
                    if (response.id === "true") {
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.error('Login já cadastrado no sistema, escolha outro nome de acesso para este usuário.', 'Erro no cadastro');
                        $scope.usuarioExistente = 'form-group has-error';
                    } else {
                        //CONVERTE A DATA PARA O FORMATO ACEITADO PELO BANCO DE DADOS
                        if(validadeAdicao.value == ""){
                            $scope.data_validade = null;
                        } else {
                            var dateArray = validadeAdicao.value.split('/'),
                                month = dateArray[1] - 1;
                            $scope.data_validade = new Date(dateArray[2],month,dateArray[0]);
                        }


                        var requestUser = $http({
                            method: "post",
                            url: '/cliente/' + $scope.idClienteSelecionado + '/novo_usuario',
                            data: {
                                name: nomeAdicao.value.toUpperCase(),
                                email: loginAdicao.value,
                                password: passwordAdicao.value,
                                id_cliente: $scope.idClienteSelecionado,
                                data_validade: $scope.data_validade,
                                status: '1', //STATUS DO USUARIO MARCADO COMO ATIVO
                                tipo_usuario: '4' //TIPO DE USUARIO MARCADO COMO 'USUARIO'
                            },
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        });

                        requestUser.success(function (dataUser) {
                            //faz o refresh das tabelas
                            $scope.exibirUsuarios($scope.idClienteSelecionado,$scope.nomeCliente,$scope.usuariosDisponiveis-1);
                            $scope.listagemClientes = ListagemUsuariosClientes.query();
                            //exibe mensagem de sucesso do cadastro do usuário
                            toastr.options.progressBar = true;
                            toastr.options.closeDuration = 300;
                            toastr.success('Usuário cadastrado com sucesso.', 'Mensagem do Sistema');
                            //esconde o formulario de adição do usuário
                            $scope.cancelarAdicao();
                        });
                    }
                });
            }
        };

        //MODAL COM A OPCAO DE CONFIRMAR A EXCLUSAO DO USUARIO OU CANCELAR A MESMA
        $scope.excluirUsuario = function(usuario){
            swal({
                    title: "Exclusão de Usuário",
                    text: "Tem certeza que dezeja deletar o usuário \n"+usuario.nome,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",confirmButtonText: "Sim, deletar!",
                    cancelButtonText: "Não, cancelar!",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function(isConfirm){
                    if (isConfirm) {
                        swal("Deletado!", "O Cliente foi deletado com sucesso!", "success");
                        $scope.cadastro = new UsuariosEditar();
                        $scope.cadastro.$delete({id: usuario.id}).then(function(){
                            $scope.exibirUsuarios($scope.idClienteSelecionado,$scope.nomeCliente,$scope.usuariosDisponiveis+1);
                            $scope.listagemClientes = ListagemUsuariosClientes.query();
                        });
                    } else {
                        swal("Cancelado", "O Cliente continua em sua base de dados ", "error");
                    }
                }
            );
        };

        $scope.habilitaAlterarSenha = function(usuario){
            $scope.habilitaNovaSenha = true;
            $scope.alterarSenhaUsuario = usuario;
            $scope.alterarSenhaUsuario.password = "";
        };

        $scope.cancelarAlterarSenha = function () {
            $scope.habilitaNovaSenha = false;
        };

        $scope.salvarSenha = function (idUsuario) {
            var requestUser = $http({
                method: "put",
                url: '/usuario/atualiza_senha/' + idUsuario,
                data: {
                    password: password.value
                },
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            });
        };



        //FILTROS QUE UTILIZAM CAMPO SELECT (CLIENTE)
        $("#selectFiltroCliente").change(function () {
            if(!$(this).val()){
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.filtro.nome = "";
                    });
                }, 500);
            }
        });

        $('.input-group.date').datepicker({
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
    }]);