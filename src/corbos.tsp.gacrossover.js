(function(willy){
    'use strict';

    var GACrossover = function(solver){
        this.solver = solver;

        var population = [];
        for(var i = 0;i < 100; i++)
            population.push(this.randomIndividual());
        population.sort(this.sortDistance);

        this.population = population;
    };
  
    willy.extendAlgorithm(GACrossover, 'OneRandom', 'randomSolution');
    willy.extendAlgorithm(GACrossover, 'GA', 'sortDistance');
    willy.extendAlgorithm(GACrossover, 'GA', 'randomIndividual');
    willy.extendAlgorithm(GACrossover, 'GA', 'getSurvivors');
    willy.extendAlgorithm(GACrossover, 'GA', 'crossover');     

    GACrossover.prototype.solve = function () {

        var survivors = this.getSurvivors([0 ,1, 2, 4, 10, 15, 25, 55, 95]);
        var sl = survivors.length;

        for(var i = 0; i < sl; i++) {
            for(var j = 0; j < sl; j++) {
                if(i !== j) {
                    survivors.push(this.crossover(survivors[i], survivors[j]));
                    if(i === 0)
                        survivors.push(this.crossover(survivors[i], survivors[j]));
                }
            }
        }

        while(survivors.length < 100)
            survivors.push(this.randomIndividual());

        survivors.sort(this.sortDistance);
        this.population = survivors;
        return survivors[0].gene;
    };

    willy.register({
        name: 'Genetic Algorithm - Crossover Only',
        GACrossover: GACrossover
    });

})(WillyLoman);
