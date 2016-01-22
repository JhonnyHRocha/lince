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
            if($scope.habilitaNovaSenha = true)
                $scope.habilitaNovaSenha = false;

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
            if($scope.habilitaNovaSenha != true)
                $scope.habilitaNovaSenha = false;
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
            if($scope.habilitaAdicao = true)
                $scope.habilitaAdicao = false;
            if($scope.habilitaEdicao = true)
                $scope.habilitaEdicao = false;
            if($scope.habilitaNovaSenha != true)
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

//CONTROLER DA TELA DE USUARIOS PELA VISUALIZACAO DO CLIENTE
angular.module('app.controllers')
    .controller('UsuarioClienteController', ['$scope','$filter','$http','$cookies','$uibModal','appConfig','Usuarios','UsuariosDisponiveis','UsuariosEditar',
    function($scope,$filter,$http,$cookies,$uibModal,appConfig,Usuarios,UsuariosDisponiveis,UsuariosEditar){
        $scope.usuarios = Usuarios.query({id: $cookies.getObject('user').id_cliente});
        $scope.quantidadeUsuariosDisponiveis = UsuariosDisponiveis.query({id: $cookies.getObject('user').id_cliente});

        $scope.editar = function (idUsuario) {
            //console.log(idUsuario);

        }

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
                            $scope.usuarios = Usuarios.query({id: $cookies.getObject('user').id_cliente});
                            $scope.quantidadeUsuariosDisponiveis = UsuariosDisponiveis.query({id: $cookies.getObject('user').id_cliente});
                        });
                    } else {
                        swal("Cancelado", "O usuário continua em sua base de dados ", "error");
                    }
                }
            );
        };

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO USUARIO, PASSANDO O ID DO MESMO
        $scope.editarUsuario = function(item) {
            $scope.usuarioEditar = UsuariosEditar.query({id: item});
            $scope.quantidadeConsultas = $scope.usuarioEditar.limite_consultas;

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/usuario/usuariosEditar.html',
                controller: 'ModalEditarUsuario',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                $scope.usuarios = Usuarios.query({id: $cookies.getObject('user').id_cliente});
                $scope.quantidadeUsuariosDisponiveis = UsuariosDisponiveis.query({id: $cookies.getObject('user').id_cliente});
            });
        };

        //ABRE O MODAL CHAMANDO A TELA DE EDICAO DO USUARIO, PASSANDO O ID DO MESMO
        $scope.editarSenha = function(item) {
            $scope.alterarSenhaUsuario = UsuariosEditar.query({id: item});

            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/usuario/usuariosNovaSenha.html',
                controller: 'ModalNovaSenha',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                $scope.usuarios = Usuarios.query({id: $cookies.getObject('user').id_cliente});
            });
        };

        //ABRE O MODAL CHAMANDO A TELA DE ADICAO DO USUARIO
        $scope.novoUsuario = function() {
            modalInstance = $uibModal.open({
                animation: true,
                templateUrl:'build/views/usuario/usuariosNovo.html',
                controller: 'ModalNovoUsuario',
                scope: $scope //passa o escopo deste controller para o novo controller, não sendo preciso um novo select no banco de dados
            });

            modalInstance.result.then(function(selectedItem) {
            }, function() {
                $scope.usuarios = Usuarios.query({id: $cookies.getObject('user').id_cliente});
                $scope.quantidadeUsuariosDisponiveis = UsuariosDisponiveis.query({id: $cookies.getObject('user').id_cliente});
            });
        };

    }]);


//  -------------------------------------------------------------------------------------------------------------------------------------------
//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalEditarUsuario', function ($scope,$window,$modalInstance,UsuariosEditar,appConfig) {
        $scope.status = appConfig.usuario.status;

        //REMOVE A OPCAO DE CONFIRMAR EMAIL
        var indexConfE = $scope.status.map(function(d) { return d['label']; }).indexOf('Confirmar E-Mail');
        if(indexConfE != -1)
            $scope.status.splice(indexConfE,1);


        //CASO A QUANTIDADE DE USUARIOS CONTRATADOS E DISPONIVEIS PARA USO
        //TENHA EXCEDIDO O LIMITE, REMOVE TAMBEM A OPÇÃO DE USUARIO ATIVO
        $scope.ok = function () {
            $modalInstance.close($scope.usuarioEditar.id);
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.save = function(){
            if($scope.form.$valid){
                if($scope.usuarioEditar.status === 1 && $scope.quantidadeUsuariosDisponiveis[0].usuarios_disponiveis === 0){
                    $modalInstance.dismiss();
                    toastr.options.progressBar = true;
                    toastr.options.closeDuration = 300;
                    toastr.error('Não existem mais usuários disponíveis para este cliente.', 'Mensagem do Sistema');
                } else {
                    if($scope.usuarioEditar.teste === false)
                        $scope.usuarioEditar.limite_consultas = 0;

                    UsuariosEditar.update({id: $scope.usuarioEditar.id}, $scope.usuarioEditar, function(){
                        $modalInstance.dismiss();
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.success('Usuário atualizado com sucesso.', 'Mensagem do Sistema');
                    });
                }
            }
        };
    });


//  -------------------------------------------------------------------------------------------------------------------------------------------
//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalNovaSenha', function ($scope,$window,$http,$modalInstance,UsuariosEditar,appConfig) {
        $scope.status = appConfig.usuario.status;

        $scope.ok = function () {
            $modalInstance.close($scope.usuarioEditar.id);
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss();
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

            requestUser.success(function (dataUser) {
                $modalInstance.dismiss();

                //exibe mensagem de sucesso do cadastro do usuário
                toastr.options.progressBar = true;
                toastr.options.closeDuration = 300;
                toastr.success('Usuário atualizado com sucesso.', 'Mensagem do Sistema');
            });

        };
    });

//  -------------------------------------------------------------------------------------------------------------------------------------------
//CONTROLLER DO MODAL QUE E ABERTO COM AS TELAS DE EDICAO DE USUARIO / TROCA DE SENHA / EDICAO DE CLIENTE
angular.module('app.controllers')
    .controller('ModalNovoUsuario', function ($scope,$window,$http,$cookies,$modalInstance,appConfig,Usuario) {
        $scope.usuarios = new Usuario();
        $scope.status = appConfig.usuario.status;
        $scope.usuarioExistente = 'form-group';

        $scope.ok = function () {
            $modalInstance.close($scope.usuarioEditar.id);
        };

        //SE APERTADO O BOTAO CANCELAR, DA UM DISMISS NO MODAL QUE ESTA ABERTO
        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.save = function(){
            if($scope.form.$valid){
                $http.get("cliente/usuario/" + $scope.usuarios.email).success(function(response) {
                    if (response.id === "true") {
                        toastr.options.progressBar = true;
                        toastr.options.closeDuration = 300;
                        toastr.error('Login já cadastrado no sistema, escolha outro nome de acesso para este usuário.', 'Erro no cadastro');
                        $scope.usuarioExistente = 'form-group has-error';
                    } else {
                        $scope.usuarios.id_cliente = $cookies.getObject('user').id_cliente;
                        $scope.usuarios.status = 2;

                        $scope.usuarios.$save().then(function(){
                            $modalInstance.dismiss();
                            //exibe mensagem de sucesso do cadastro do usuário
                            toastr.options.progressBar = true;
                            toastr.options.closeDuration = 300;
                            toastr.success('Usuário cadastrado com sucesso.', 'Mensagem do Sistema');
                        });
                    }
                });
            }
        };

        $('.input-group.date').datepicker({
            todayBtn: "linked",
            keyboardNavigation: false,
            forceParse: false,
            calendarWeeks: true,
            autoclose: true,
            format: "dd/mm/yyyy"
        });
    });