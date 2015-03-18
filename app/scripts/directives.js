'use strict';

/* Directives */


angular.module('mftApp.directives', [])
  .directive('contentEditable', function(){
	return {
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
			ngModel.$render = function() {
				element.html(ngModel.$viewValue || '');
			};
			element.on('blur keyup change', function() {
				scope.$apply(read);
			});
			read();
			function read() {
				ngModel.$setViewValue(html);
			}
		}
	};
  })



  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);

