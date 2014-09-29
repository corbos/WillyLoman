(function(willy){

    var OneRandom = function(solver){
        this.solver = solver;       
        this.done = true;
    };

    OneRandom.prototype.randomSolution = function() {
        var result = [];
        var possible = this.solver.getPossible();
        while(possible.length > 0){
            var index = willy.rand(possible.length - 1);
            result.push(possible[index]);
            possible.splice(index, 1);
        }      
        return result;
    };
    OneRandom.prototype.solve = function(){
        return this.randomSolution();
    };

    willy.register({
        key: 'OneRandom',
        name: 'One Random Solution',
        OneRandom: OneRandom
    });

})(WillyLoman);
