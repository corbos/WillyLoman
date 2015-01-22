(function(willy){
    'use strict';

    var GAMutation = function(solver){
        this.solver = solver;

        var population = [];
        for(var i = 0;i < 100; i++)          
            population.push(this.randomIndividual());        
        population.sort(this.sortDistance);

        this.population = population;
    };

    willy.extendAlgorithm(GAMutation, 'OneRandom', 'randomSolution');
    willy.extendAlgorithm(GAMutation, 'GA', 'sortDistance');
    willy.extendAlgorithm(GAMutation, 'GA', 'randomIndividual');
    willy.extendAlgorithm(GAMutation, 'GA', 'getSurvivors');
    willy.extendAlgorithm(GAMutation, 'GA', 'mutate');   

    GAMutation.prototype.solve = function () {
        var survivors = this.getSurvivors([0 ,1, 2, 4, 10, 15, 25, 35, 55, 95]);
        var sl = survivors.length;
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < sl; j++) {
                survivors.push(this.mutate(survivors[j], willy.randomInt(5) + 1));
            }
        }
        survivors.sort(this.sortDistance);
        this.population = survivors;
        return survivors[0].gene;
    };

    willy.register({
        name: 'Genetic Algorithm - Mutation Only',
        GAMutation: GAMutation
    });

})(WillyLoman);
