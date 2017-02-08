'use strict';

angular.module('myApp').controller('AddIntervenantCtrl', function($scope, $location, Operation, Parametres) {
	$scope.newIntervenant = {};
    $scope.metiers = Parametres.getMetiers();

  	$scope.addIntervenant = function() {
  		$scope.newIntervenant.beginDate = new Date();
  		$scope.newIntervenant.endDate = null;
  		Operation.addPersonnel($scope.newIntervenant);
  		$location.url('/dashboard');
  	}

     $scope.launchCamera = function() {
        console.log(navigator.camera);
        if(navigator.camera !== undefined) {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.DATA_URL });
        }
    }
    
    function onSuccess(imageData) {
        console.log('image : onSuccess');
        $scope.imageInt = imageData;
        console.log(imageData);
        //refreshImageContent(imageData);     
    }
    
    function onFail(message) {
        console.log('image : onFail');
    }

    function refreshImageContent(imageData) {
        if(imageData != undefined) {
            var image = document.getElementById('imagePreview') ;
            image.src = "data:image/jpeg;base64," + imageData;
        }
    }

    window.addEventListener('native.keyboardshow', keyboardShowHandler);
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardShowHandler(e) {
        $scope.keyboardVisible = true;
        $scope.$apply();
    }

    function keyboardHideHandler(e) {
        $scope.keyboardVisible = false;
        $scope.$apply();
    }

});
