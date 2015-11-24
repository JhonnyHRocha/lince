angular.module('app.directives')
    .directive('areachart', function ($window) {

        return {
            restrict: 'E',
            template: '<div></div>',
            replace: true,
            link: function ($scope, element, attrs) {
                var morris;
                angular.element($window).bind('resize', function () {
                    if (morris) {
                        morris.redraw();
                    }
                });

                attrs.$observe('value', function (val) {
                    if (!morris) {
                        morris = Morris.Bar({
                            element: element,
                            data: angular.fromJson(val),
                            xkey: $scope[attrs.xkey],
                            ykeys: $scope[attrs.ykeys],
                            labels: $scope[attrs.labels],
                            hideHover: 'auto',
                            resize: true,
                            barColors: ['#1AB394', '#ED5565'],
                        });
                    } else {
                        morris.setData(angular.fromJson(val));
                    }
                });
            }
        };
    });