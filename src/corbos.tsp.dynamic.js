(function (willy) {
    'use strict';

    var sortInt = function (a, b) { return a - b; };

    var getKey = function (indexes) {
        indexes.sort(sortInt);
        return indexes.join("_");
    };

    var InstructionState = function (start, rest) {
        this.start = start;
        this.rest = rest;
        this.path = [];
        this.key = start.toString() + "_" + getKey(rest);
        this.distance = Number.MAX_VALUE;
    };

    var InstructionSet = function () {
        this.toDo = [];
        this.inProgress = [];
        this.done = [];
    };

    var Dynamic = function (solver) {
        this.solver = solver;
        this.distances = [];
        this.cache = {};
        this.initCachedDistances();
        var instructionSet = new InstructionSet();
        instructionSet.toDo.push(new InstructionState(0, solver.getPossible().slice(1)));
        this.instructions = [instructionSet];
    };

    willy.extendAlgorithm(Dynamic, 'BranchNBound', 'initCachedDistances');
    willy.extendAlgorithm(Dynamic, 'BranchNBound', 'lookupDistance');

    Dynamic.prototype.solve = function () {

        var current, toDo, count = 0, i, cached,
            len, inProgress, d, instructionSet;

        while (count++ < 1000) {

            current = this.instructions[this.instructions.length - 1];
            toDo = current.toDo.pop();

            if (toDo) {
                len = toDo.rest.length;
                if (len === 1) {
                    toDo.distance = this.lookupDistance(toDo.start, toDo.rest[0]) + this.lookupDistance(0, toDo.rest[0]);
                    toDo.path = [toDo.rest[0], toDo.start];
                    current.done.push(toDo);
                } else if ((cached = this.cache[toDo.key]) !== undefined) {
                    current.done.push(cached);
                } else {
                    current.inProgress.push(toDo);
                    instructionSet = new InstructionSet();
                    for (i = 0; i < len; i++) {
                        instructionSet.toDo.push(
                                new InstructionState(
                                    toDo.rest[i],
                                    toDo.rest.slice(0, i).concat(toDo.rest.slice(i + 1))
                                    )
                                );
                    }
                    this.instructions.push(instructionSet);
                }
            } else if (this.instructions.length === 1) {
                this.done = true;
                return current.done[0].path;
            } else {
                this.instructions.pop();
                inProgress = this.instructions[this.instructions.length - 1].inProgress.pop();
                current.done.forEach(function (item) {
                    d = this.lookupDistance(inProgress.start, item.start) + item.distance;
                    if (d < inProgress.distance) {
                        inProgress.distance = d;
                        inProgress.path = item.path.concat(inProgress.start);
                    }
                }, this);
                this.cache[inProgress.key] = inProgress;
                this.instructions[this.instructions.length - 1].done.push(inProgress);
            }
        }

        return this.solver.getPossible();
    };

    willy.register({
        name: 'Dynamic Programming',
        Dynamic: Dynamic
    });

})(WillyLoman);
