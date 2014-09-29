(function (willy) {
    'use strict';

    var BranchNBound = function (solver) {

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
        this.distances = [];

        var pts = solver.points;

        for(var i = 0; i < pts.length; i++) {
            this.distances[i] = [];
            for (var j = i + 1; j < pts.length; j++) {
                this.distances[i][j - i - 1] = willy.distance(pts[i],pts[j]);
            }
        }

        var bnn = willy.getAlgorithm("BestNearestNeighbor");
        if (bnn)
            this.nn = new bnn(solver);
    };

    BranchNBound.prototype.solve = function () {

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

    BranchNBound.prototype.backup = function() {
        this.depth--;
        if(this.depth >= 0) {
            this.possible.splice(this.indexes[this.depth], 0, this.solution.pop());
            this.indexes[this.depth]++;
            this.currentDistance -= this.distances.pop();
        }
    };

    BranchNBound.prototype.lookupDistance = function (index1, index2) {
        var first = Math.min(index1, index2),
            second = Math.max(index1, index2);
        return this.distances[first][second - first - 1];
    };

    BranchNBound.prototype.getBestGuess = function() {

        var bestGuess = 0.0,
            minFirstHop = Number.MAX_VALUE,
            minLastHop = Number.MAX_VALUE,
            firstIndex = this.solution[0],
            lastIndex = this.solution[this.solution.length - 1],
            maxDistance = 0.0,
            minDistance = Number.MAX_VALUE;

        this.possible.forEach(function (i) {

            minFirstHop = Math.min(minFirstHop, this.lookupDistance(firstIndex, i));
            minLastHop = Math.min(minLastHop, this.lookupDistance(lastIndex, i));

            minDistance = Number.MAX_VALUE
            this.possible.forEach(function (j) {
                if(i !== j)
                    minDistance = Math.min(minDistance, this.lookupDistance(i, j));
            }, this);

            if (minDistance < maxDistance) {
                bestGuess += minDistance;
            }
            else {
                bestGuess += maxDistance;
                maxDistance = minDistance;
            }

        }, this);

        return bestGuess + minFirstHop + minLastHop;
    };

    willy.register({
        key: 'BranchNBound',
        name: 'Branch And Bound (sorta)',
        BranchNBound: BranchNBound
    });

})(WillyLoman);

