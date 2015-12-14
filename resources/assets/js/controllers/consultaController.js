angular.module('app.controllers')
    .controller('ConsultaController', ['$scope','$cookies','$http','$uibModal',
    function($scope,$cookies,$http,$uibModal){
        //TABS
        $scope.tabs = [{
            title: "one",
            content: '<h1>tab one</h1>'
        }, {
            title: "two",
            content: '<h1>tab two</h1>'
        }, {
            title: "three",
            content: '<h1>tab three</h1>'
        }];
        $scope.removeTab = function (index) {
            $scope.tabs.splice(index, 1);
        };




        //MASCARAS DOS CAMPOS DE CONSULTA
        var SPMask = function (val) {
            return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
        },
        spOptions = {
            onKeyPress: function(val, e, field, options) {
                field.mask(SPMask.apply({}, arguments), options);
            }
        };

        var CPF_CNPJMask = function (val) {
            return val.replace(/\D/g, '').length > 11 ? '00.000.000/0000-00' : '000.000.000-009999';
        },
        spOptions = {
            onblur: function(val, e, field, options) {
                field.mask(CPF_CNPJMask.apply({}, arguments), options);
            }
        };

        $('#telefone').mask(SPMask, spOptions);
        $('#cpf_cnpj').mask(CPF_CNPJMask, spOptions);
        $('#placa').mask('AAA-0000', spOptions);
        $('#cep').mask('00000-000', spOptions);
        $('#uf').mask('AA', spOptions);
        $('#cep2').mask('00000-000', spOptions);
        $('#uf2').mask('AA', spOptions);


        //VALIDAR CPF / CNPJ
        function validarCNPJ(cnpj) {
            cnpj = cnpj.replace(/[^\d]+/g,'');

            if(cnpj == '') return false;

            if (cnpj.length != 14)
                return false;

            // Elimina CNPJs invalidos conhecidos
            if (cnpj == "00000000000000" ||
                cnpj == "11111111111111" ||
                cnpj == "22222222222222" ||
                cnpj == "33333333333333" ||
                cnpj == "44444444444444" ||
                cnpj == "55555555555555" ||
                cnpj == "66666666666666" ||
                cnpj == "77777777777777" ||
                cnpj == "88888888888888" ||
                cnpj == "99999999999999")
                return false;

            // Valida DVs
            tamanho = cnpj.length - 2;
            numeros = cnpj.substring(0,tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0))
                return false;

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2)
                    pos = 9;
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if(resultado != digitos.charAt(1))
                return false;

            return true;
        }

    }]);