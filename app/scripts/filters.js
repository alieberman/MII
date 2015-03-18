'use strict';

/* Filters */

angular.module('mftApp')
.filter('feedListFilter', function() {
  return function(text) {
    return String(text).replace(/\%VERSION\%/mg, version);
  }
});
