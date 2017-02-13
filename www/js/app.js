'use strict';

 /**
 * @class angular_module.myApp
 * @memberOf angular_module 
 */
angular.module('myApp', [
  'ngRoute',
  'ngStorage',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  'tb-color-picker'
])

.run(function($rootScope, $location, Operation) {
    
    $rootScope.$on('$stateChangeStart', function(){
        $rootScope.broadcast('$routeChangeStart');
    });

    $rootScope.$on("$routeChangeStart", function(event, next, current) { 
        if(next.$$route) {
            var nextPath = next.$$route.originalPath;
            if(nextPath == '/home' && Operation.getOperation() != null)  $location.url('/dashboard');
            if(nextPath == '/dashboard' && Operation.getOperation() == null)  $location.url('/home');
        }
    });
});


document.addEventListener("deviceready", onDeviceReady, false);

/**
* Cordova callback
*/
function onDeviceReady() {
    console.log('deviceready');
    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 50);
}
