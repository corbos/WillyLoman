(function(willy){
    'use strict';

    var GA = function(solver){
        this.solver = solver;

        var population = [];
        for(var i = 0;i < 100; i++)
            population.push(this.randomIndividual());
        population.sort(this.sortDistance);

        this.population = population;
    };

    willy.extendAlgorithm(GA, 'OneRandom', 'randomSolution');

    GA.prototype.sortDistance = function(a,b) { return a.distance - b.distance; };

    GA.prototype.randomIndividual = function () {
        var individual = { gene: this.randomSolution() };
        individual.distance = this.solver.pathDistance(individual.gene);
        return individual;
    };

    GA.prototype.getSurvivors = function (lotteryNumbers) {
        var survivors = [];
        for(var i = 0; i < lotteryNumbers.length; i++)
            survivors.push(this.population[lotteryNumbers[i]]);
        return survivors;
    };

    GA.prototype.mutate = function (individual, mutationCount) {
        var gene = individual.gene.slice(0);
        for(var i = 0; i < mutationCount; i++) {
            var mutateIndex = willy.randomInt(gene.length - 1);
            var index = gene[mutateIndex];
            gene.splice(mutateIndex, 1);
            gene.splice(willy.randomInt(gene.length - 1), 0, index);
        }
        var mutant = { gene: gene };
        mutant.distance = this.solver.pathDistance(mutant.gene);
        return mutant;
    };

    GA.prototype.crossover = function (parent1, parent2) {

        var gene = [];
        var gl = parent1.gene.length;
        var remains = parent2.gene.slice(0);

        var start = willy.randomInt(gl - 1);
        var end = willy.randomInt(gl - 1);
        while(start === end)
            end = willy.randomInt(gl - 1);

        while(start !== end) {
            var index = parent1.gene[start];
            gene.push(index);
            remains.splice(remains.indexOf(index), 1);
            if(++start === gl)
                start = 0;
        }

        for(var i = 0; i < remains.length; i++)
            gene.push(remains[i]);

        var child = { gene : gene };
        child.distance = this.solver.pathDistance(gene);
        return child;
    };

    GA.prototype.solve = function () {

        var survivors = this.getSurvivors([0 ,1, 2, 4, 10, 25, 35, 55, 95]);
        var sl = survivors.length;
        var i = 0, j = 0, child;

        for(i = 0; i < sl; i++) {
            for(j = 0; j < sl; j++) {
                if(i !== j) {
                    child = this.crossover(survivors[i], survivors[j]);
                    child = this.mutate(child, willy.randomInt(2));
                    survivors.push(child);
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
        name: 'Genetic Algorithm',
        GA: GA
    });

})(WillyLoman);

