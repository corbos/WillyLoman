(function (willy) {
    'use strict';

    var BruteForce = function (solver) {
        this.solver = solver;
        this.possible = solver.getPossible();
        this.solution = [];
        this.solution.push(this.possible.pop());
        this.indexes = [];
        this.distances = [];
        for(var i = 0; i < this.possible.length; i++)
            this.indexes[i] = 0;
        this.depth = 0;
        this.currentDistance = 0.0;
        this.bestDistance = Number.MAX_VALUE;
        this.best = [];
        this.minDistances = [];

        var pts = solver.points,
            d = 0.0,
            min = Number.MAX_VALUE;

        for(var i = 0; i < pts.length; i++) {
            min = Number.MAX_VALUE;
            for (var j = 0; j < pts.length; j++) {
                if(i !== j) {
                    d = willy.distance(pts[i],pts[j]);
                    min = Math.min(d, min);
                }
            }
            this.minDistances[i] = min;
        }
        var bnn = willy.getAlgorithm("BestNearestNeighbor");
        if (bnn)
            this.nn = new bnn(solver);
    };

    BruteForce.prototype.solve = function () {

        if(this.nn && !this.nn.done) {
            var result = this.nn.solve();
            var pd = this.solver.pathDistance(result);
            if(pd < this.bestDistance) {
                this.bestDistance = pd;
                this.best = result;
            }
            return result;
        }

        var count = 0;
        var pts = this.solver.points;
        var solution = this.solution;
        var possible = this.possible;
        var d = 0.0;

        while(count++ < 1000) {

            if(this.possible.length === 1) { // leaf node

                d = willy.distance(pts[solution[solution.length - 1]], pts[possible[0]]) +
                    willy.distance(pts[solution[0]], pts[possible[0]]);

                if(d + this.currentDistance < this.bestDistance) {
                    this.bestDistance = d + this.currentDistance;
                    this.best = solution.slice(0);
                    this.best.push(possible[0]);
                }

                this.backup();
            }
            // no more options at this depth
            else if(this.indexes[this.depth] >= this.possible.length) {
                this.backup();
                if(this.depth < 0) {
                    this.done = true;
                    break;
                }
            }
            else {

                d = willy.distance(pts[solution[solution.length - 1]], pts[possible[this.indexes[this.depth]]]);
                solution.push(possible.splice(this.indexes[this.depth], 1)[0]);
                this.currentDistance += d;

                var bestGuess = this.getBestGuess();

                if(this.currentDistance + bestGuess >= this.bestDistance) {
                    this.currentDistance -= d;
                    possible.splice(this.indexes[this.depth], 0, solution.pop());
                    this.indexes[this.depth]++;
                }
                else {
                    this.distances.push(d);
                    this.indexes[this.depth + 1] = 0;
                    this.depth++;
                }
            }
        }

        return this.best;
    };

    BruteForce.prototype.backup = function() {
        this.depth--;
        if(this.depth >= 0) {
            this.possible.splice(this.indexes[this.depth], 0, this.solution.pop());
            this.indexes[this.depth]++;
            this.currentDistance -= this.distances.pop();
        }
    };

    BruteForce.prototype.getBestGuess = function() {

        var bestGuess = 0.0,
            lastHop = 0.0,
            minLastHop = Number.MAX_VALUE,
            possible = this.possible,
            solution = this.solution,
            pts = this.solver.points;

        possible.forEach(function (item) {
            bestGuess += this.minDistances[item];
            lastHop = willy.distance(pts[solution[0]], pts[item]);
            minLastHop = Math.min(lastHop, minLastHop);
        }, this);

        bestGuess += minLastHop;

        return bestGuess;
    };

    willy.register({
        key: 'BruteForce',
        name: 'Brute Force',
        BruteForce: BruteForce
    });

})(WillyLoman);
