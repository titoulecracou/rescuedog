'use strict';

/**
 * @ngdoc controllers
 * @memberof avalanche
 * @name EditVictimeCtrl
 * @param $scope {service} native controller scope
 * @param $routeParams {service} native routeParams service
 * @param $location {service} native location service
 * @param Operation {service} Avalanche Operation service
 * @param Parametres {service} Avalanche Parametres service
 * @param Translation {service} Avalanche Translation service
 */
angular.module('myApp').controller('EditVictimeCtrl', function($scope, $routeParams, $location, Operation, Parametres, Translation) {
    Translation.getTranslation($scope);

    /**
     * Initialise le scope du controller.
     * @memberof EditVictimeCtrl
     * @function init
     */
    function init() {
        $scope.victime = Operation.getVictime($routeParams.num);
        $scope.victimeStatus = Parametres.getVictimeStatus();
        $scope.victimeSituations = Parametres.getVictimeSituations();
        console.log($scope.victime.status, $scope.victimeStatus);
    }
    init();

    /**
     * Passe l'état de la victime à évacuer
     * @memberof EditVictimeCtrl
     * @function evacuateVictime
     */
    $scope.evacuateVictime = function() {
        navigator.notification.confirm(
            $scope.translation.victimes.editVictime.evacuateConfirm1 + ' ' + $scope.victime.numero 
            + ' ' + $scope.translation.victimes.editVictime.evacuateConfirm2,
            function(buttonIndex) {
                if(buttonIndex == 1) {
                    Operation.evacuateVictime($scope.victime);
                    $location.url('/dashboard');
                    toast($scope.translation.victimes.number2 + $scope.victime.numero + ' ' + $scope.translation.evacuatedFemale);
                    $scope.$apply();  
                }
            }, 
            'Évacuer une victime', 
            ['Évacuer', 'Annuler']
        );
    }

    /**
     * Enregistre les modifications de statut et/ou situation apportées à la victime.
     * @memberof EditVictimeCtrl
     * @function checkSituation
     */
    $scope.checkSituation = function() {
        // TODO : ajouter confirmation
        // TODO : vérifier unicité de l'ID
        navigator.notification.confirm("La victime a été mise à jour.", null, 'Mise à jour victime', "OK");
        if($scope.victime.situation == 'Évacuée') {
          Operation.evacuateVictime($scope.victime);  
        }
    }

    /**
     * Supprime la victime.
     * @memberof EditVictimeCtrl
     * @function deleteVictime
     */
    $scope.deleteVictime = function() {
        navigator.notification.confirm(
            'Souhaitez-vous vraiment supprimer la victime ' + $scope.victime.numero + ' ?',
            function(buttonIndex) {
                if(buttonIndex == 1) {
                    Operation.removeVictime($scope.victime);
                    $location.url('/dashboard');
                    $scope.$apply();
                }
            }, 
            'Supprimer une victime', 
            ['Supprimer', 'Annuler']
        );
    }
    
    /**
     * Met à jour l'opération dans le scope lorsque le local storage est modifié 
     */
    $scope.$on('operationUpdated', function(event) {
        $scope.operation = Operation.getOperation();
    });

    /**
     * Ecoute les évenements clavier pour cacher afficher les boutons flottants
     */
    window.addEventListener('native.keyboardshow', function(e) {
        $scope.keyboardVisible = true;
        $scope.$apply();        
    });

    window.addEventListener('native.keyboardhide', function(e) {
        $scope.keyboardVisible = false;
        $scope.$apply();
    });

    
});
