(function(willy){

    var TwoOptFirst = function(solver){
        this.solver = solver;       
        this.done = false;
        this.best = this.randomSolution();
    };    
   
    willy.extendAlgorithm(TwoOptFirst, 'OneRandom', 'randomSolution');

    TwoOptFirst.prototype.solve = function(){
          
        var pts = this.solver.points;
        var pl = pts.length;
        var path = this.best;
        var running = true;
        var distance = willy.distance;

        for(var i = 0; i < pl && running; i++) {

            var after = i + 1;
            if(i == pl - 1) after = 0;

            for(var j = 0; j < pl && running; j++) {
                if(j == i) continue;

                var jAfter = j + 1;
                if(j == pl - 1) jAfter = 0;

                var edgeDistance = distance(pts[path[i]], pts[path[after]])
                    + distance(pts[path[j]], pts[path[jAfter]]);

                var changedDistance = distance(pts[path[i]], pts[path[j]])
                    + distance(pts[path[after]], pts[path[jAfter]]);

                if(changedDistance < edgeDistance) {

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
                    running = false;
                    this.best = candidate;                          
                }                      
            }
        }
        if(running)
            this.done = true;
        return this.best;
    };

    willy.register({
        name: '2 Opt - First Improvement',
        TwoOptFirst: TwoOptFirst
    });

})(WillyLoman);
