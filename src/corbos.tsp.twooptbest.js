(function(willy){

    var TwoOptBest = function(solver){
        this.solver = solver;       
        this.done = false;
        this.best = this.randomSolution();
    };

    willy.extendAlgorithm(TwoOptBest, 'OneRandom', 'randomSolution');

    TwoOptBest.prototype.solve = function() {          
          
        var pts = this.solver.points;
        var pl = pts.length;           
        var largestDelta = 0.0;
        var path = this.best; 
        var distance = willy.distance;

        for(var i = 0; i < pl; i++) {

            var after = i + 1;
            if(after == pl) after = 0;

            var iDistance = distance(pts[path[i]], pts[path[after]]);

            for(var j = i + 1; j < pl; j++) {              

                var jAfter = j + 1;
                if(j == pl - 1) jAfter = 0;

                var edgeDistance = iDistance + distance(pts[path[j]], pts[path[jAfter]]);

                var changedDistance = distance(pts[path[i]], pts[path[j]])
                    + distance(pts[path[after]], pts[path[jAfter]]);

                var delta = edgeDistance - changedDistance;

                if(delta > largestDelta) {

                    largestDelta = delta;

                    var candidate = [];
                    var a = after;
                    while((a % pl) != jAfter) {
                        candidate.push(path[a % pl]);
                        a++;
                    } 
                   
                    a = i;
                    while((a % pl) != j) {
                        candidate.push(path[a % pl]);
                        a--;
                        if(a < 0)
                            a = pl - 1;
                    }                           
                    this.best = candidate;                           
                }
            }
        }

        if(largestDelta <= 0.0)              
            this.done = true;

        return this.best;
    };

    willy.register({
        name: '2 Opt - Best Improvement',
        TwoOptBest: TwoOptBest
    });

})(WillyLoman);
