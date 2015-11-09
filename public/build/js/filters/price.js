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

