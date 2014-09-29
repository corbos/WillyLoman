WillyLoman = (function(){
    'use strict';

    var WillyLoman = {

        Point: function(x,y){
            this.x = x;
            this.y = y;
        },

        rand:function(u){
            return Math.floor(Math.random() * (u + 1));
        },

        distance: function(pt1, pt2) {
            var xDelta = pt1.x - pt2.x;
            var yDelta = pt1.y - pt2.y;
            return Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));
        }, 

        algorithms:{},
        register: function(algo) {
           this.algorithms[algo.key] = algo;
        },
        getAlgorithm: function(key) {
            var algo = this.algorithms[key];
            if(algo !== undefined)
                return algo[algo.key]; // return the constructor
        },
        extendAlgorithm: function (destination, srcKey, propertyKey) {
            var algo = this.getAlgorithm(srcKey);
            if(algo !== undefined)
                destination.prototype[propertyKey] = algo.prototype[propertyKey];
        }
    };

    var Solver =  function(notify) {
        this.notify = notify;
        this.points = [];
        this.solution = [];
        this.timeout = 0;
    };

    Solver.prototype.addPoint = function(x,y){
        this.points.push(new WillyLoman.Point(x,y));
    };

    Solver.prototype.solve = function(algoKey) {

        if(this.timeout > 0 || this.points.length == 0) return;

        this.iteration = 0;
        this.improvements = 0;
        this.distance = Number.MAX_VALUE;
        var algo = WillyLoman.getAlgorithm(algoKey);
        if(algo === undefined)
            throw "Algorithm [" + algoKey + "] not found.";
        else {
            this.algo = new algo(this);
            var tsp = this;
            this.timeout = setTimeout(function() { tsp.iterate(); }, 0);
        }
    };

    Solver.prototype.iterate = function() {
        var solution = this.algo.solve();
        var distance = this.pathDistance(solution);
        if(distance < this.distance) {
            this.distance = distance;
            this.solution = solution;
            this.improvements++;
        }
        this.iteration++;
        this.notify();
        if(!this.algo.done) {
            var tsp = this;
            this.timeout = setTimeout(function() { tsp.iterate(); }, 0);
        }
        else {
            this.timeout = 0;
        }
    };

    Solver.prototype.stop = function(){
        clearTimeout(this.timeout);
        this.timeout = 0;
    };

    Solver.prototype.clear = function(){
        this.stop();
        this.points = [];
        this.solution = [];
    };

    Solver.prototype.getPossible = function(){
        var result = [];
        var pl = this.points.length;
        for(var i = 0; i < pl; i++) {
            result.push(i);
        }
        return result;
    };

    Solver.prototype.pathDistance = function(indexes){
        var pts = this.points;
        var l = pts.length;
        var distance = WillyLoman.distance;
        var d = distance(pts[indexes[0]], pts[indexes[l - 1]]);
        for(var i = 1; i < l; i++)
            d += distance(pts[indexes[i]], pts[indexes[i - 1]]);
        return d;
    };

    WillyLoman.Solver = Solver;

    return WillyLoman;

})();
