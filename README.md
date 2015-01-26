#WillyLoman

Helps you run and visualize algorithms that solve the [Travelling Salesman Problem](https://en.wikipedia.org/wiki/Travelling_salesman_problem).

###To get started, create a constructor:

```javascript
var MyAlgorithm = function (solver) {
    this.solver = solver;
}
```

The argument `solver` is a reference to the WillyLoman.Solver that will run your algorithm. It contains, among other things,
an array of WillyLoman.Points that represent the x and y coordinates of each city in your tour. They live in `solver.points`.
(Be careful not to change them.)

###Add a `solve` function:

```javascript
MyAlgorithm.prototype.solve = function () {
    this.done = true;
    return this.solver.getPossible();
};
```

Things to note

1. The solver will call your algorithm's `solve` function repeatedly until you indicate it's finished. 
You do this by setting `this.done` to `true`.
2. Given most JavaScript runtimes' single thread of execution, you'll want to model your algorithm's `solve`
function as a single pass in an iteration. Save the state you need. If you try and solve everything in one shot, you'll
likely lock up the runtime.
3. `solve` should return an array of indexes. Each index is an index of the solver's `points` array. Each index must appear
once and only once. Anything else will cause problems. Include indexes in the order you want to visit each point/city.

###Register your algorithm with WillyLoman inside an object:

```javascript
WillyLoman.register({
    name: 'My splendid TSP algorithm',
    MyAlgorithm: MyAlgorithm
});
```

Notes

1. The object's `name` property is the only property allowed other than your constructor.
2. Any other property is assumed to be the algorithm constructor.
3. The name of your algorithm property is significant. It will be used to reference your algorithm. Make sure it's unique
across all algorithms WillyLoman has registered. Otherwise, bad things will happen.

###Run it:

```javascript
var solver = new WillyLoman.Solver(function () {
    // This is a callback that is invoked after each solution iteration.
    // Check how things are going.
});

solver.addPoint(0, 0);
solver.addPoint(100, 100);
//etc...

solver.solve("MyAlgorithm");  // Note that "MyAlgorithm" matches the registration object's constructor property.
```

###If you want to visualize what's going on, consider using WillyLoman.UI:

```javascript
var canvas = document.getElementById('myCanvas');

var notify = function (data) {
        someHtmlElementOne.innerHTML = data.distance;
        someHtmlElementTwo.innerHTML = data.iteration;
        someHtmlElementThree.innerHTML = data.improvements; 
};

var ui = new WillyLoman.UI(canvas, notify);

// After you add cities...
ui.solve("MyAlgorithm");
```

WillyLoman.UI expects a reference to an HTML canvas and a notification callback. The
callback isn't required.

It will

1. Handle mouse clicks on its canvas to add cities to your problem.
2. Let you add a bunch of random cities within the bounds of its canvas via `addRandom(number)`.
3. Draw the current solution on its canvas as the solver runs.

Full example of usage: <https://github.com/corbos/WillyLoman/blob/master/example.html>

or...

###Demo

<http://scatterbright.com/tsp.html>
