angular.module('starter.directives', [])
  .directive('focusMe', function ($timeout) {
    return {
      link: function(scope, element, attrs) {

        $timeout(function() {
          element[0].focus();
        });
      }
    };
  })

  .directive('randomAvatar', function() {
    var images = [
      'img/adam.png',

    ]

    return {
      restrict: 'AE',
      link: function(scope, el) {
        angular.element(el).attr('src', images[Math.round(Math.random(1)*(images.length - 1))]);
      }
    }
  })

  .directive('elastic', function() {
    return {
      restric: 'A',
      link: function(scope, el, attr) {
        scope.$on('elastic:resize', function(event, element, oldHeight, newHeight) {
          newHeight = Math.max(44, newHeight);
          el[0].style.height = newHeight + 'px';
        });
      }
    }
  })

  .directive('randomBackground', function() {
    return {
      restrict: 'A',
      link: function(scope, el, attrs) {
        var colors = [
          '#F44336',
          '#E91E63',
          '#9C27B0',
          '#673AB7',
          '#3F51B5',
          '#2196F3',
          '#039BE5',
          '#0097A7',
          '#009688',
          '#43A047',
          '#689F38',
          '#FDD835',
          '#EF6C00',
          '#FF5722',
          '#323F4B',
        ];
        angular.element(el).css({'background-color': colors[Math.round(Math.random(1)*(colors.length - 1))]})
      }
    }
  })
