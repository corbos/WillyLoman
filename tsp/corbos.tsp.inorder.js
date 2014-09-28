(function(willy){

    var InOrder = function(solver){
        this.solver = solver;       
        this.done = true;
    }; 
   
    InOrder.prototype.solve = function(){
        return this.solver.getPossible();
    };

    willy.register({
        key: 'InOrder',
        name: 'In Order Traversal',
        InOrder: InOrder
    });

})(WillyLoman);

