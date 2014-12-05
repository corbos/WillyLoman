(function (willy) {
    'use strict';

    var BranchNBound = function (solver) {
        this.init(solver);
        this.initCachedDistances();
        this.setUpCandidates();
    };

    willy.extendAlgorithm(BranchNBound, 'BruteForce', 'init');
    willy.extendAlgorithm(BranchNBound, 'BruteForce', 'solve');
    willy.extendAlgorithm(BranchNBound, 'BruteForce', 'backup');

    BranchNBound.prototype.initCachedDistances = function() {
        this.cachedDistances = [];
        var pts = this.solver.points;
        for(var i = 0; i < pts.length; i++) {
            this.cachedDistances[i] = [];
            for (var j = i + 1; j < pts.length; j++) {
                this.cachedDistances[i][j - i - 1] = willy.distance(pts[i],pts[j]);
            }
        }
    };

    var sortDistanceDesc = function(a,b) { return b.distance - a.distance; };

    BranchNBound.prototype.setUpCandidates = function() {
        var parent = this.solution[this.solution.length - 1];
        var sortable = this.possible
            .filter(function(i) {
                return this.solution.indexOf(i) === -1
            }, this)
            .map(function(i) {
                return {
                    index: i,
                    distance: this.lookupDistance(parent, i)
                };
            }, this);
        sortable.sort(sortDistanceDesc);
        this.candidates.push(sortable.map(function(i) {
            return i.index;
        }));
    };

    BranchNBound.prototype.lookupDistance = function (index1, index2) {
        var first = Math.min(index1, index2),
            second = Math.max(index1, index2);
        return this.cachedDistances[first][second - first - 1];
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
                if(i !== j) {
                    minDistance = Math.min(minDistance, this.lookupDistance(i, j));
                }
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

