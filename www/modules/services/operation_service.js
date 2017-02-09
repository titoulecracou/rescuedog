angular.module('myApp').service('Operation', function($localStorage, $rootScope, $location, $filter) {
    
    this.getOperation = function() {
        return $localStorage.operation;
    }

    this.createOperation = function() {
        if($localStorage.operation == null) {
            $localStorage.operation = {
                nom: 'Avalanche du ',
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

    this.terminate = function() {
        $localStorage.operation.endDate = new Date();
        this.pushHistorique($localStorage.operation);
        $localStorage.operation = null;
        $rootScope.$broadcast('operationUpdated');
    }

    this.addTmpPersonnel = function(personnel) {
        this.tmpPersonnel = personnel;
    }

    this.getTmpPersonnel = function() {
        if(!this.tmpPersonnel) return null;
        return this.tmpPersonnel;
    }

    this.addPersonnel = function() {
        if($localStorage.operation.personnels.indexOf(this.tmpPersonnel) !== -1) {
            console.log("Error : operation already contains this personnel");
        } else {
            $localStorage.operation.personnels.push(this.tmpPersonnel);
            $rootScope.$broadcast('operationUpdated');
        }
    }

    this.removePersonnel = function(personnel) {
        var index = $localStorage.operation.personnels.indexOf(personnel);
        if(index == -1) console.log("Error : Operation does not contain this personnel");
        else {
            $localStorage.operation.personnels.splice(index, 1);   
            $rootScope.$broadcast('operationUpdated');
        }
    }

    /* Retourne la liste des personnels du métier passé en paramètre */
    this.getPersonnelsByMetier = function(libMetier) {
        let personnels = [];
        let pers = $localStorage.operation.personnels;
        for(let i = 0; i < pers.length; i++) {
            if(pers[i].metier.libelle == libMetier) personnels.push(pers[i]);
        }
        return personnels;
    }

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

    this.evacuateVictime = function(victime) {
        victime.situation = 'Évacuée';
        victime.endDate = new Date();
        $rootScope.$broadcast('operationUpdated');
    }

    this.removeVictime = function(victime) {
        var index = $localStorage.operation.victimes.indexOf(victime);
        if(index == -1) console.log("Cette victime n'a pas été trouvée : elle ne peut pas être supprimée.");
        else {
            $localStorage.operation.victimes.splice(index, 1);
            $rootScope.$broadcast('operationUpdated');
        }
    }

    /* Génère un numéro inexistant pour une victime */
    this.generateVictimeNumber = function() {
        if($localStorage.operation.victimes.length == 0) {
            return 1;
        } else {
            var nextNumber = $localStorage.operation.victimes[0].numero + 1;
            for(let v of $localStorage.operation.victimes)
                nextNumber = v.numero > nextNumber ? v.numero + 1 : nextNumber;
            return nextNumber;
        }
    }

    this.isVictimeNumberAvailable = function(num) {
        for(let v of $localStorage.operation.victimes)
            if(v.numero == num) return false;
        return true;
    }

    /* Retourne une victime à partir de son numéro */
    this.getVictime = function(numero) {
        for(let i = 0; i < $localStorage.operation.victimes.length; i++) {
            var victime = $localStorage.operation.victimes[i];
            if(victime.numero == numero) return victime; 
        }
    }

    this.getJournaux = function() {
        var journaux = [];

        if($localStorage.historique) {
            for(var i = 0; i < $localStorage.historique.length; i++) {
                journaux.push(this.getJournal($localStorage.historique[i]));            
            }
        }
        return journaux;
    }

    /*********************************
     *       ToDO
     *       RAJOUTER LE METIER
     *********************************/
    this.getJournal = function(operation) {
        var journal = {
            nom: operation.nom,
            beginDate: operation.beginDate,
            endDate: operation.endDate,
            nbVictimes: operation.victimes.length,
            nbPersonnels : operation.personnels.length,
            evenements: []
        };
        for(var i = 0; i < operation.victimes.length; i++) {
            var v = operation.victimes[i];
            
            var evDebut = {
                date: v.beginDate,
                texte: 'La victime n°' + v.numero + ' a été découverte à ' + $filter('date')(v.beginDate, 'hh:mm le dd/MM/yyyy') + '.',
                type: 'entrée'
            };
            journal.evenements.push(evDebut);

            if(v.endDate != null) {
                var evFin = {
                    date: v.endDate,
                    texte: 'La victime n°' + v.numero + ' a été évacuée à ' + $filter('date')(v.endDate, 'hh:mm le dd/MM/yyyy') + '.',               
                    type: 'sortie'
                };
                journal.evenements.push(evFin);
            }
            
        }
        for(var i = 0; i < operation.personnels.length; i++) {
            var p = operation.personnels[i];

            var evDebut = {
                date : v.entryDate,
                texte : 'Le ' + /**** METIER ****/ ' numéro ' + p.numero + ' est entré sur zone à ' + $filter('date')(p.entryDate, 'hh:mm le dd/MM/yyyy') + '.',
                type: 'entrée'  
            };
            journal.evenements.push(evDebut);

            if(p.exitDate != null) {
                var evFin = {
                    date : v.exitDate,
                    texte : 'Le ' + /**** METIER ****/ ' numéro ' + p.numero + ' est sortie de la zone à ' + $filter('date')(p.exitDate, 'hh:mm le dd/MM/yyyy') + '.',
                    type: 'sortie'
                }
                journal.evenements.push(evFin);
            }
        }
        return journal;
    }

    this.pushHistorique = function(operation) {
        if(!$localStorage.historique) {
            $localStorage.historique = [];
        }
        $localStorage.historique.push(operation);
        $rootScope.$broadcast('operationUpdated');
    }
});
