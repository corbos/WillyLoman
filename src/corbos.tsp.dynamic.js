(function (willy) {
    'use strict';

    var Dynamic = function (solver) {
        this.solver = solver;
        this.done = true;
        this.distances = [];
        this.cache = {};
        this.initDistances();
    };

    willy.extendAlgorithm(Dynamic, 'BranchNBound', 'initDistances');
    willy.extendAlgorithm(Dynamic, 'BranchNBound', 'lookupDistance');

    var sortInt = function (a, b) { return a - b; };

    var getKey = function (indexes) {
        indexes.sort(sortInt);
        return indexes.join("_");
    };

    Dynamic.prototype.minDistance = function (start, rest) {

        var best = {
                distance: Number.MAX_VALUE,
                path:[]
            },
            next,
            len = rest.length,
            result,
            key,
            d = 0.0;

        if (len === 1) {
            return {
                distance: this.lookupDistance(start, rest[0]) + this.lookupDistance(0, rest[0]),
                path: [rest[0], start]
            };
        }

        key = start.toString() + '_' + getKey(rest);
        if (this.cache[key] !== undefined)
            return this.cache[key];

        for (var i = 0; i < len; i++) {
            next = rest.slice(0, i).concat(rest.slice(i + 1));
            result = this.minDistance(rest[i], next);
            d = this.lookupDistance(start, rest[i]) + result.distance;
            if (d < best.distance) {
                best.distance = d;
                best.path = result.path.concat(start);
            }
        };

        this.cache[key] = best;

        return best;
    };

    Dynamic.prototype.solve = function () {
        var result = this.minDistance(0, this.solver.getPossible().slice(1));
        return result.path;
    };

    willy.register({
        key: 'Dynamic',
        name: 'Dynamic Programming',
        Dynamic: Dynamic
    });

})(WillyLoman);
