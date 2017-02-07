'use strict';

angular.module('myApp').controller('AddIntervenantCtrl', function($scope, $location, Operation, Parametres) {
	$scope.newIntervenant = {};
	//$scope.newIntervenant.numero = Operation.generateIntervenantNumber();

	//$scope.IntervenantStatus = Parametres.getIntervenantStatus();

	//$scope.IntervenantPhoto= null;

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
        console.log(imageData);
        storage.setItem('imageData', imageData);
        refreshImageContent(imageData);     
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



});
