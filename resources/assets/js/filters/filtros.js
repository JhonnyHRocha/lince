//FORMATA TELEFONE PARA O FORMATO DE SAO PAULO
angular.module('app.filters').filter('telefone',['$filter', function($filter){
    return function (input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        if (str.length === 11) {
            str = str.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
            str = str.replace(/^(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return str;
    };
}]);

//FORMATA SEXO
angular.module('app.filters').filter('sexo', function () {
    return function (input) {
        if(input === 'M')
            return "MASCULINO";
        else if(input === 'F')
            return "FEMININO";
    };
});

//FORMATA CEP
angular.module('app.filters').filter('cep', function () {
    return function (input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d{3})(\d)/, '$1.$2-$3');
        return str;
    };
});

//FORMATA CNPJ
angular.module('app.filters').filter('cnpj', function () {
    return function (input) {
        // regex créditos Matheus Biagini de Lima Dias
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/^(\d{2})(\d)/, '$1.$2');
        str = str.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        str = str.replace(/\.(\d{3})(\d)/, '.$1/$2');
        str = str.replace(/(\d{4})(\d)/, '$1-$2');
        return str;
    };
});

//FORMATA CPF
angular.module('app.filters').filter('cpf', function () {
    return function (input) {
        var str = input + '';
        str = str.replace(/\D/g, '');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d)/, '$1.$2');
        str = str.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return str;
    };
});

//FORMATA DATA PARA BR
angular.module('app.filters').filter('dateBr',['$filter', function($filter){
    return function(input) {
        if(input === '0000-00-00')
            return null;
        return $filter('date')(input, 'dd/MM/yyyy');
    };
}]);


//FORMATA DATA PARA PADRAO BANCO DE DADOS
angular.module('app.filters').filter('dateBD',['$filter', function($filter){
    return function(input) {
        var parts = input.split("/");
        return new Date(parts[2], parts[1] - 1, parts[0]);
    };
}]);



//REMOVE ZEROS A ESQUERDA DO NUMERO - UTILIZADO PARA IDENTIFICAR SE E CPF OU CNPJ
angular.module('app.filters').filter('removeZero',['$filter', function($filter){
    return function (n, len) {
        var num = parseInt(n, 10);
        len = parseInt(len, 10);
        if (isNaN(num) || isNaN(len)) {
            return n;
        }
        num = ''+num;
        while (num.length < len) {
            num = '0'+num;
        }
        return num;
    };
}]);

//REMOVE ZEROS A ESQUERDA DO NUMERO - UTILIZADO PARA IDENTIFICAR SE E CPF OU CNPJ
angular.module('app.filters').filter('signo',['$filter', function($filter){
    return function (input) {
        if(input === undefined)
            return false;

        var nascimento = input;
        nascimento = input.split('-');

        $ano = nascimento[0];
        $mes = nascimento[1];
        $dia = nascimento[2];

        //Áries	21 de março - 20 de abril
        if($mes === '03' && $dia >= 21)
            return "ÁRIES";
        else if($mes === '04' && $dia <= 20)
            return "ÁRIES";

        //Touro	21 de abril - 20 de maio
        else if($mes === '04' && $dia >= 21)
            return "TOURO";
        else if($mes === '05' && $dia <= 20)
            return "TOURO";

        //Gémeos	21 de maio - 20 de junho
        else if($mes === '05' && $dia >= 21)
            return "GÊMEOS";
        else if($mes === '06' && $dia <= 20)
            return "GÊMEOS";

        //Câncer	21 de junho - 21 de julho
        else if($mes === '06' && $dia >= 21)
            return "CÂNCER";
        else if($mes === '07' && $dia <= 20)
            return "CÂNCER";

        //Leão	22 de julho - 22 de agosto
        else if($mes === '07' && $dia >= 22)
            return "LEÃO";
        else if($mes === '08' && $dia <= 22)
            return "LEÃO";

        //Virgem	23 de agosto - 22 de setembro
        else if($mes === '08' && $dia >= 23)
            return "VIRGEM";
        else if($mes === '09' && $dia <= 22)
            return "VIRGEM";

        //Libra	23 de setembro - 22 de outubro
        else if($mes === '09' && $dia >= 23)
            return "LIBRA";
        else if($mes === '10' && $dia <= 22)
            return "LIBRA";

        //Escorpião	23 de outubro - 21 de novembro
        else if($mes === '10' && $dia >= 23)
            return "ESCORPIÃO";
        else if($mes === '11' && $dia <= 21)
            return "ESCORPIÃO";

        //Sagitário	22 de novembro - 21 de dezembro
        else if($mes === '11' && $dia >= 22)
            return "SAGITÁRIO";
        else if($mes === '12' && $dia <= 21)
            return "SAGITÁRIO";

        //Capricórnio	22 de dezembro - 20 de janeiro
        else if($mes === '12' && $dia >= 22)
            return "CAPRICÓRNIO";
        else if($mes === '01' && $dia <= 20)
            return "CAPRICÓRNIO";

        //Aquário	21 de janeiro - 19 de fevereiro
        else if($mes === '01' && $dia >= 21)
            return "AQUÁRIO";
        else if($mes === '02' && $dia <= 19)
            return "AQUÁRIO";

        //Peixes	20 de fevereiro - 20 de março
        else if($mes === '02' && $dia >= 20)
            return "PEIXES";
        else if($mes === '03' && $dia <= 20)
            return "PEIXES";

    };
}]);

//FORMATA IDADE
angular.module('app.filters').filter('idade', function () {
    return function (input) {
        if(input === undefined || input === '0000-00-00'){
            return null;
        }

        $m = ' meses';
        //Data Nascimento
        var nascimento = input;
        nascimento = input.split('-');

        $ano = nascimento[0];
        $mes = nascimento[1];
        $dia = nascimento[2];

        $dia1 = $dia;
        $mes1 = $mes;
        $ano1 = $ano;

        var dataAtual = new Date();
        $dia2 = dataAtual.getDate();
        $mes2 = dataAtual.getMonth()+1;
        $ano2 = dataAtual.getFullYear();

        $dif_ano = $ano2 - $ano1;
        $dif_mes = $mes2 - $mes1;
        $dif_dia = $dia2 - $dia1;

        if ($dif_dia < 0){
            $dif_mes--;
        }

        if ($dif_mes < 0) {
            $dif_ano--;
            $dif_mes +=12;
        }

        if ($dif_mes == 1) {
            $m = ' mês';
        }

        return $dif_ano + ' anos - ' + $dif_mes + $m;
    };
});



//FORMATA VALORES MONETARIOS
angular.module('app.filters').filter('priceFormat',['$filter', function($filter){
    var is_number = /[0-9]/;
    var prefix = ''
    var suffix = ''
    var centsSeparator = ','
    var thousandsSeparator = '.'
    var limit = false
    var centsLimit = 2
    var clearPrefix = false
    var clearSufix = false
    var allowNegative = false
    var insertPlusSign = false
    if (insertPlusSign) allowNegative = true;

    function to_numbers(str) {
        var formatted = '';
        for (var i = 0; i < (str.length); i++) {
            char_ = str.charAt(i);
            if (formatted.length == 0 && char_ == 0) char_ = false;
            if (char_ && char_.match(is_number)) {
                if (limit) {
                    if (formatted.length < limit) formatted = formatted + char_
                } else {
                    formatted = formatted + char_
                }
            }
        }
        return formatted
    }

    function fill_with_zeroes(str) {
        while (str.length < (centsLimit + 1)) str = '0' + str;
        return str
    }

    return function (str) {
        var formatted = fill_with_zeroes(to_numbers(str));
        var thousandsFormatted = '';
        var thousandsCount = 0;
        if (centsLimit == 0) {
            centsSeparator = "";
            centsVal = ""
        }
        var centsVal = formatted.substr(formatted.length - centsLimit, centsLimit);
        var integerVal = formatted.substr(0, formatted.length - centsLimit);
        formatted = (centsLimit == 0) ? integerVal : integerVal + centsSeparator + centsVal;
        if (thousandsSeparator || $.trim(thousandsSeparator) != "") {
            for (var j = integerVal.length; j > 0; j--) {
                char_ = integerVal.substr(j - 1, 1);
                thousandsCount++;
                if (thousandsCount % 3 == 0) char_ = thousandsSeparator + char_;
                thousandsFormatted = char_ + thousandsFormatted
            }
            if (thousandsFormatted.substr(0, 1) == thousandsSeparator) thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
            formatted = (centsLimit == 0) ? thousandsFormatted : thousandsFormatted + centsSeparator + centsVal
        }
        if (allowNegative && (integerVal != 0 || centsVal != 0)) {
            if (str.indexOf('-') != -1 && str.indexOf('+') < str.indexOf('-')) {
                formatted = '-' + formatted
            } else {
                if (!insertPlusSign) formatted = '' + formatted;
                else formatted = '+' + formatted
            }
        }
        if (prefix) formatted = prefix + formatted;
        if (suffix) formatted = formatted + suffix;
        return formatted
    };
}]);

