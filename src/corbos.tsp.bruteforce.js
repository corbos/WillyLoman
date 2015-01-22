(function (willy) {
    'use strict';

    var BruteForce = function (solver) {
        this.init(solver);
        this.setUpCandidates();
    };

    BruteForce.prototype.init = function (solver) {
        this.solver = solver;
        this.possible = solver.getPossible();
        this.solution = [this.possible[0]];
        this.candidates = [];
        this.distances = [];
        this.depth = 0;
        this.currentDistance = 0.0;
        this.bestDistance = Number.MAX_VALUE;
        this.best = [];
    };

    BruteForce.prototype.setUpCandidates = function() {
        this.candidates.push(this.possible.filter(function (item) {
            return this.solution.indexOf(item) === -1;
        }, this));
    }

    BruteForce.prototype.solve = function () {

        var count = 0,
            pts = this.solver.points,
            solution = this.solution,
            d = 0.0,
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
                    this.best = solution.slice();
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

    BruteForce.prototype.backup = function() {
        this.depth--;
        if(this.depth >= 0) {
            this.candidates.pop();
            this.solution.pop();
            this.currentDistance -= this.distances.pop();
        }
    };

    BruteForce.prototype.getLowerBound = function() {
        return 0.0;
    };

    willy.register({
        name: 'Vanilla Brute Force',
        BruteForce: BruteForce
    });

})(WillyLoman);
