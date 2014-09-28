(function(WillyLoman){
    'use strict';

    var CIRCLE_RADIUS = 4.0;
    var LINE_COLOR = 'rgb(0,0,255)';  
    var LINE_WIDTH = 1.0;  

    var UI = function(canvas, notify) {

        var ui = this;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        var uiNotify = function() {
            // only draw if things have improved.
            if(ui.improvements != ui.solver.improvements) {
                ui.draw();
                ui.improvements = ui.solver.improvements;
            }
            notify(ui.solver.distance, ui.solver.iteration, ui.solver.improvements);
        };
        this.solver = new WillyLoman.Solver(uiNotify);      

        canvas.addEventListener('mousedown', function(e) {         
            var x = e.clientX - this.offsetLeft + (window.pageXOffset||document.body.scrollLeft||document.documentElement.scrollLeft);
            var y = e.clientY - this.offsetTop + (window.pageYOffset||document.body.scrollTop||document.documentElement.scrollTop);
            ui.solver.solution = [];
            ui.solver.addPoint(x,y);
            ui.draw();
        });
    };

    UI.prototype = {

        draw: function() {

            var pts = this.solver.points;
            var pl = pts.length;
            var solution = this.solver.solution;
            var ctx = this.ctx;
            var fullCircle = Math.PI * 2;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
           
            for(var i = 0; i < pl; i++){
                ctx.beginPath();
                ctx.arc(pts[i].x, pts[i].y, CIRCLE_RADIUS, 0, fullCircle, true);
                ctx.fill();
            }

            if(pl > 1 && solution.length > 1){
                ctx.save();
                ctx.strokeStyle = LINE_COLOR;
                ctx.lineWidth = LINE_WIDTH;              
                ctx.moveTo(pts[solution[0]].x, pts[solution[0]].y);
                for(var i = 1; i < pl; i++)
                      ctx.lineTo(pts[solution[i]].x, pts[solution[i]].y);
                ctx.lineTo(pts[solution[0]].x, pts[solution[0]].y);    
                ctx.stroke(); 
                ctx.restore();              
            }
        },

        addRandom: function(n){
            this.solver.solution = [];
            var count = parseInt(n);
            if(!isNaN(count)) { 
                var pts = this.solver.points;
                for(var i = 0; i < count; i++){
                    this.solver.addPoint(WillyLoman.rand(this.canvas.width), WillyLoman.rand(this.canvas.height));                    
                }
                this.draw();             
            }
        },

        solve: function(algo){
            this.improvements = 0;
            this.solver.solve(algo);
        },

        clear: function(){
            this.solver.clear();
            this.draw();
        },

        stop: function() {
            this.solver.stop();
        }
    };

    WillyLoman.UI = UI;

})(WillyLoman);
