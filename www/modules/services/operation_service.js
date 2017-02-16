﻿'use strict';

/**
 * @memberof avalanche
 * @ngdoc services
 * @name Operation
 * @description 
 *   Service Operation
 */
angular.module('myApp').service('Operation', function($localStorage, $rootScope, $location, $filter) {
    
    /**
      * @memberof Operation
      * @func getOperation
      */
    this.getOperation = function() {
        return $localStorage.operation;
    }

    /**
      * @memberof Operation
      * @func createOperation
      */
    this.createOperation = function(nomOperation) {
        if($localStorage.operation == null) {
            $localStorage.operation = {
                nom: nomOperation,
                beginDate: new Date(),
                endDate: null,
                personnels: [],
                victimes: []
            };
            $rootScope.$broadcast('operationUpdated');
        } else {
            console.log('Création impossible : this.operation existe déjà.');
        }
    }

    /**
      * @memberof Operation
      * @func terminate
      */
    this.terminate = function() {
        $localStorage.operation.endDate = new Date();
        this.pushHistorique($localStorage.operation);
        $localStorage.operation = null;
        $rootScope.$broadcast('operationUpdated');
    }

    /**
      * @memberof Operation
      * @func addTmpPersonnel
      */
    this.addTmpPersonnel = function(personnel) {
        if(!this.isPersonnelNumberAvailable(personnel.numero)) {
            navigator.notification.alert('Il y a déjà un personnel portant ce numéro', null, 'Numéro déjà utilisé', 'OK');
        } else {
            this.tmpPersonnel = personnel;
            $location.url('/confirmIntervenant');
        }
    }

    /**
      * @memberof Operation
      * @func getTmpPersonnel
      */
    this.getTmpPersonnel = function() {
        if(!this.tmpPersonnel) return null;
        return this.tmpPersonnel;
    }

    /**
      * @memberof Operation
      * @func cancelTmpPersonnel
      */
    this.cancelTmpPersonnel = function() {
        delete this.tmpPersonnel;
    }

    /**
      * @memberof Operation
      * @func addPersonnel
      */
    this.addPersonnel = function() {
        if($localStorage.operation.personnels.indexOf(this.tmpPersonnel) !== -1) {
            console.log("Error : operation already contains this personnel");
        } else {
            $localStorage.operation.personnels.push(this.tmpPersonnel);
            delete this.tmpPersonnel;
            $rootScope.$broadcast('operationUpdated');
        }
    }

    /**
      * @memberof Operation
      * @func removePersonnel
      */
    this.removePersonnel = function(personnel) {
        if(!$localStorage.operation) {
            console.log("Error: Not ongoing operation")
            return;
        }
        var index = $localStorage.operation.personnels.indexOf(personnel);
        if(index == -1) console.log("Error : Operation does not contain this personnel");
        else {
            $localStorage.operation.personnels.splice(index, 1);   
            $rootScope.$broadcast('operationUpdated');
        }
    }

    /**
      * Retourne un personnel de l'opération courante à partir de son numéro
      * @memberof Operation
      * @func getPersonnel
      * @param {integer} numero Numéro de personnel
      */
    this.getPersonnel = function(numero) {
        if($localStorage.operation){
            for(let p of $localStorage.operation.personnels) {
                if(!p.endDate && p.numero == numero) return p; 
            }
        }
    }

    /**
      * @memberof Operation
      * @func getPersonnelsByMetier
      * @param {string} libMetier
      */
    this.getPersonnelsByMetier = function(libMetier) {
        let personnels = [];
        if(!$localStorage.operation) return personnels;
        let pers = $localStorage.operation.personnels;
        for(let i = 0; i < pers.length; i++) {
            if(pers[i].metier.libelle == libMetier) personnels.push(pers[i]);
        }
        return personnels;
    }

    /**
      * @memberof Operation
      * @func evacuatePersonnel
      * @param {integer} personnel
      */
    this.evacuatePersonnel = function(personnel) {
        personnel.endDate = new Date();
        $rootScope.$broadcast('operationUpdated');
    }

    /**
      * @memberof Operation
      * @func addVictime
      * @param {Victime} victime
      */
    this.addVictime = function(victime) {
        if($localStorage.operation.victimes.indexOf(victime) !== -1) console.log("Error : Operation already contains this victime")
        else if(!this.isVictimeNumberAvailable(victime.numero)) {
            navigator.notification.alert('Il y a déjà une victime portant ce numéro', null, 'Numéro déjà utilisé', 'OK');
        } else {
            $localStorage.operation.victimes.push(victime);
            $rootScope.$broadcast('operationUpdated');
            $location.url('/dashboard');
        }
    }

    /**
      * @memberof Operation
      * @func evacuateVictime
      * @param {Victime} victime
      */
    this.evacuateVictime = function(victime) {
        victime.situation = 'Évacuée';
        victime.endDate = new Date();
        $rootScope.$broadcast('operationUpdated');
    }

    /**
      * @memberof Operation
      * @func removeVictime
      * @param {Victime} victime
      */
    this.removeVictime = function(victime) {
        if($localStorage.operation){
            var index = $localStorage.operation.victimes.indexOf(victime);
            if(index == -1) console.log("Cette victime n'a pas été trouvée : elle ne peut pas être supprimée.");
            else {
                $localStorage.operation.victimes.splice(index, 1);
                $rootScope.$broadcast('operationUpdated');
            }
        }
    }

    /**
      * Génère un numéro inexistant pour une victime 
      * @memberof Operation
      * @func generateVictimeNumber
      */
    this.generateVictimeNumber = function() {
        if($localStorage.operation.victimes.length == 0) {
            return 1;
        } else {
            var max = 1;
            for(let v of $localStorage.operation.victimes){
                if (v.numero > max) max = v.numero;
            }
            return max + 1;
        }
    }

    /**
      *  
      * @memberof Operation
      * @func isVictimeNumberAvailable
      * @param {integer} num
      */
    this.isVictimeNumberAvailable = function(num) {
        for(let v of $localStorage.operation.victimes)
            if(v.numero == num) return false;
        return true;
    }

    /**
      *  
      * @memberof Operation
      * @func isPersonnelNumberAvailable
      * @param {integer} num
      */
    this.isPersonnelNumberAvailable = function(num) {
        for(let p of $localStorage.operation.personnels)
            if(p.numero == num && !p.endDate) return false;
        return true;
    }

    /**
      *  
      * Retourne une victime à partir de son numéro
      * @memberof Operation
      * @func getVictime
      * @param {integer} numero
      */
    this.getVictime = function(numero) {
        for(let victime of $localStorage.operation.victimes) {
            if(victime.numero == numero) return victime; 
        }
    }


    /****************************
     * HISTORISATION DES DONNEES *
     ***************************/

    /**
      *
      * @memberof Operation
      * @func getJournaux
      * @param {Scope} scope
      */
    this.getJournaux = function(scope) {
        var journaux = [];

        if($localStorage.historique) {
            for(let operation of $localStorage.historique) journaux.push(this.getJournal(operation, scope)); 
        }
        return journaux;
    }

    /**
      *
      * @memberof Operation
      * @func getCurrentJournal
      * @param {Scope} scope
      */
    this.getCurrentJournal = function(scope) {
        return this.getJournal(this.getOperation(), scope);
    }

    /**
      *
      * @memberof Operation
      * @func getJournal
      * @param {Scope} scope
      */
    this.getJournal = function(operation, scope) {
        console.log(scope);
        var journal = {
            nom: operation.nom,
            beginDate: operation.beginDate,
            endDate: operation.endDate,
            nbVictimes: operation.victimes.length,
            nbPersonnels: operation.personnels.length,
            evenements: []
        };

        for(let v of operation.victimes) {           
            var evDebut = {
                date: v.beginDate,
                texte: $filter('date')(v.beginDate, scope.translation.hourFormat) + ' : ' + scope.translation.historique.victim + v.numero + ' ' + scope.translation.historique.victimSaved + ' '+ v.status.libelle + ' ' + scope.translation.historique.situation + ' '+ v.situation +'.',
                type: 'entrée'
            };
            journal.evenements.push(evDebut);

            if(v.endDate != null) {
                var evFin = {
                    date: v.endDate,
                    texte: $filter('date')(v.endDate, scope.translation.hourFormat) + ' : ' + scope.translation.historique.victim + v.numero + ' ' + scope.translation.historique.evacuated + ' '+ v.status.libelle + '.',               
                    type: 'sortie'
                };
                journal.evenements.push(evFin);
            }
        }

        for(let p of operation.personnels) {
            var evDebut = {
                date: p.beginDate,
                texte: $filter('date')(p.beginDate, scope.translation.hourFormat) + ' : ' + scope.translation.historique.intervenant + p.numero + ' (' + $filter('lowerMetier')(p.metier.libelle) + ') ' + scope.translation.historique.enterZone + '.',
                type: 'entrée'  
            };
            journal.evenements.push(evDebut);

            if(p.endDate != null) {
                var evFin = {
                    date: p.endDate,
                    texte: $filter('date')(p.endDate, scope.translation.hourFormat) + ' : ' + scope.translation.historique.intervenant + p.numero + ' (' + $filter('lowerMetier')(p.metier.libelle) + ') ' + scope.translation.historique.leaveZone + '.',
                    type: 'sortie'
                }
                journal.evenements.push(evFin);
            }

            for(let m of p.missions) {
                var evMission = {
                    date: m.beginDate,
                    texte: $filter('date')(m.beginDate, scope.translation.hourFormat) + ' : ' + scope.translation.historique.intervenant + p.numero + ' (' + $filter('lowerMetier')(p.metier.libelle) + ') ' + scope.translation.historique.mission + ' ' + m.libelle +'.',
                    type: 'maj'
                };
                journal.evenements.push(evMission);
            }
        }
        
        journal.evenements = journal.evenements.sort(function(a, b) { return new Date(a.date) - new Date(b.date); });

        return journal;
    }

    /**
      *
      * @memberof Operation
      * @func pushHistorique
      * @param {Operation} operation
      */
    this.pushHistorique = function(operation) {
        if(!$localStorage.historique) {
            $localStorage.historique = [];
        }
        $localStorage.historique.push(operation);
        $rootScope.$broadcast('operationUpdated');
    }
});
