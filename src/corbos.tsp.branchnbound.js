(function (willy) {
    'use strict';

    var BranchNBound = function (solver) {
        this.solver = solver;
        this.possible = solver.getPossible();
        this.solution = [this.possible[0]];
        this.candidates = [];
        this.depth = 0;
        this.currentDistance = 0.0;
        this.bestDistance = Number.MAX_VALUE;
        this.best = [];
        this.initDistances();
        this.setUpCandidates();
    };
    
    BranchNBound.prototype.initDistances = function() {
        this.distances = [];
        var pts = this.solver.points;
        for(var i = 0; i < pts.length; i++) {
            this.distances[i] = [];
            for (var j = i + 1; j < pts.length; j++) {
                this.distances[i][j - i - 1] = willy.distance(pts[i],pts[j]);
            }
        } 
    };

    BranchNBound.prototype.sortDistanceDesc = function(a,b) { return b.distance - a.distance; };

    BranchNBound.prototype.setUpCandidates = function() {
        var parent = this.solution[this.solution.length - 1];
        var sortable = [];
        this.possible.forEach(function(i) {
            if (this.solution.indexOf(i) === -1) {
                sortable.push({
                    index:i,
                    distance: this.lookupDistance(parent, i)
                });
            }
        }, this);
        sortable.sort(this.sortDistanceDesc);
        this.candidates.push(sortable.map(function(i) { return i.index; }));
    };

    BranchNBound.prototype.solve = function () {

        var count = 0;
        var pts = this.solver.points;
        var solution = this.solution;      
        var d = 0.0,
            candidates,
            c;

        while(count++ < 1000) {

            candidates = this.candidates[this.candidates.length - 1];
           
            // no more options at this depth
            if(candidates.length === 0) {
                this.backup();
                if(this.depth < 0) {
                    this.done = true;
                    break;
                }
            }
            else if(this.depth === pts.length - 2) { // leaf node

                c = candidates[0];

                d = willy.distance(pts[solution[solution.length - 1]], pts[c]) +
                    willy.distance(pts[solution[0]], pts[c]);

                if(d + this.currentDistance < this.bestDistance) {
                    this.bestDistance = d + this.currentDistance;
                    this.best = solution.slice(0);
                    this.best.push(c);
                }

                this.backup();
            }
            else {

                c = candidates.pop();

                d = willy.distance(pts[solution[solution.length - 1]], pts[c]);
                solution.push(c);
                this.currentDistance += d;

                var lowerBound = this.getLowerBound(candidates);

                if(this.currentDistance + lowerBound >= this.bestDistance) {
                    this.currentDistance -= d;
                    solution.pop();
                }
                else {
                    this.distances.push(d);
                    this.depth++;
                    this.setUpCandidates();
                }
            }
        }

        return this.best;
    };

    BranchNBound.prototype.backup = function() {
        this.depth--;
        if(this.depth >= 0) {
            this.candidates.pop();
            this.solution.pop();
            this.currentDistance -= this.distances.pop();
        }
    };

    BranchNBound.prototype.lookupDistance = function (index1, index2) {
        var first = Math.min(index1, index2),
            second = Math.max(index1, index2);
        return this.distances[first][second - first - 1];
    };

    BranchNBound.prototype.getLowerBound = function(candidates) {

        var lowerBound = 0.0,
            minFirstHop = Number.MAX_VALUE,
            minLastHop = Number.MAX_VALUE,
            firstIndex = this.solution[0],
            lastIndex = this.solution[this.solution.length - 1],
            maxDistance = 0.0,
            minDistance = Number.MAX_VALUE;

        candidates.forEach(function (i) {

            minFirstHop = Math.min(minFirstHop, this.lookupDistance(firstIndex, i));
            minLastHop = Math.min(minLastHop, this.lookupDistance(lastIndex, i));

            minDistance = Number.MAX_VALUE
            candidates.forEach(function (j) {
                if(i !== j)
                    minDistance = Math.min(minDistance, this.lookupDistance(i, j));
            }, this);

            if (minDistance < maxDistance) {
                lowerBound += minDistance;
            }
            else {
                lowerBound += maxDistance;
                maxDistance = minDistance;
            }

        }, this);

        return lowerBound + minFirstHop + minLastHop;
    };

    willy.register({
        key: 'BranchNBound',
        name: 'Branch And Bound (not really)',
        BranchNBound: BranchNBound
    });

})(WillyLoman);

