(function() {
    'use strict';

    angular
        .module('ranking')
        .controller('RankingController', RankingController)

    RankingController.$inject = ['rankingService', '$mdDialog']

    function RankingController(rankingService, $mdDialog) {
        var self = this;
        self.ranks = [];
        self.loaded = false;
        rankingService
            .loadRanking()
            //.mockRankingData()
            .then(function(ranks) {
                self.ranks = [].concat(ranks);
                self.loaded = true;
            });

        self.percentualIgual = function(rank) {
            return Math.round(100 * rank.igual / (rank.total_votos_usuario - rank.neutro))
        }
        self.percenhtualDiferente = function(rank) {
            return Math.round(100 * rank.diferente / (rank.total_votos_usuario - rank.neutro))
        }
        self.percentualNeutro = function(rank) {
            return Math.round(100 * rank.indiferente / (rank.total_votos_usuario - rank.neutro))
        }

        /*
         *   Candidato Dialog
         */

        this.showCandidato = function(ev, rank) {
            $mdDialog.show({
                    locals: {
                        rank: rank
                    },
                    controller: DialogController,
                    controllerAS: 'ctrl',
                    templateUrl: '../../src/app/ranking/candidato-full.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true // Only for -xs, -sm breakpoints.
                })
                .then(function(answer) {
                    //console.log('You said the information was "' + answer + '".');
                }, function() {
                    //console.log('You cancelled the dialog.');
                });
        };

        DialogController.$inject = ['$scope', '$mdDialog', '$window', 'rank'];

        function DialogController($scope, $mdDialog, $window, rank) {
            $scope.ranking = self;
            $scope.rank = rank;
            $scope.loaded = false;
            $scope.candidato = {};
            $scope.votos = [];

            rankingService
                .loadCandidato(rank.parlamentar_id)
                .then(function(data) {
                    $scope.candidato = data.parlamentary;
                    $scope.rank = data.ranking[0];
                    $scope.votos = data.votes_propositions;
                    $scope.loaded = true;
                });

            $scope.submit = function(answer) {
                $mdDialog.hide();
            };

            $scope.$on("$locationChangeStart", function(evt) {
                evt.preventDefault();
                $mdDialog.hide();
            });
        };

    }

}());
