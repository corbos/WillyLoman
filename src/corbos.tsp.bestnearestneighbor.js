(function (willy) {
    'use strict';

    var BestNearestNeighbor = function (solver) {
        this.solver = solver;
        this.done = false;
        this.shortest = Number.MAX_VALUE;
        this.index = 0;
    };

    var nearestNeighborPath = function () {

        var distance = willy.distance;
        var possible = this.solver.getPossible();
        var pts = this.solver.points;
        var candidate = [possible[this.index]];
        possible.splice(this.index,1);

        while (possible.length > 0) {
            var min = Number.MAX_VALUE;
            var minIndex = 0;
            var compareIndex = candidate[candidate.length - 1];
            for (var i = 0; i < possible.length; i++) {
                var d = distance(pts[compareIndex], pts[possible[i]]);
                if (d < min) {
                    min = d;
                    minIndex = i;
                }
            }
            candidate.push(possible[minIndex]);
            possible.splice(minIndex,1);
        }

        return candidate;
    };

    BestNearestNeighbor.prototype.nearestNeighborPath = nearestNeighborPath;
    BestNearestNeighbor.prototype.solve = function () {

        if (this.index >= this.solver.points.length - 1)
            this.done = true;

        var candidate = this.nearestNeighborPath();

        var length = this.solver.pathDistance(candidate);
        if (length < this.shortest) {
            this.shortest = length;
            this.best = candidate;
        }

        this.index++;
        return this.best;
    };

    willy.register({
        key: 'BestNearestNeighbor',
        name: 'Best Nearest Neighbor',
        BestNearestNeighbor: BestNearestNeighbor
    });

})(WillyLoman);
