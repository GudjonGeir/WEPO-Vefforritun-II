// Constructor for tool settings
function ToolSettings() {
	this.shape = "pen";
	this.color = "#000000";
}

// Constructor for rectangle object
function Rectangle(x, y, w, h, fill) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fill = fill;
}

function Line(x, y, x2, y2, fill) {
	this.x = x;
	this.y = y;
	this.x2 = x2;
	this.y2 = y2;
	this.fill = fill;
}

function Pen(x, y, fill){
	this.x = x;
	this.y = y;
	this.fill = fill;
}

Pen.prototype.draw = function(ctx) {
	for(var i = 0; i < this.x.length - 1; i++) {
		console.log("i is " + i);
		ctx.beginPath(); 
		ctx.fillStyle = this.fill;
		ctx.moveTo(this.x[i], this.y[i]);
		ctx.lineTo(this.x[i + 1], this.y[i + 1]);
		ctx.closePath();
		ctx.stroke();
	}
}

  /*for(var i=0; i < clickX.length; i++) {		
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.stroke();
  }*/

Line.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.fillStyle = this.fill;
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x2, this.y2);
	ctx.stroke();
}

// Draw the rectangle
Rectangle.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.w, this.h, this.x - this.w, this.y - this.h);
}

function CanvasState(canvas) {
	this.canvas = canvas;
	this.width = canvas.width;
	this.height = canvas.height;
	this.ctx = canvas.getContext("2d");

	this.startX;
	this.startY;
	this.isDrawing = false;

	this.isValid = true;
	this.shapes = [];

	var drawInterval = 30;
}

CanvasState.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasState.prototype.draw = function() {

	if (!this.isValid) {
		this.clear();
		var length = this.shapes.length;
		for (var i = 0; i < length; i++) {
			this.shapes[i].draw(this.ctx);
		};

		this.isValid = true;
	};
}


$(document).ready(function() {
	var canvas = document.getElementById("myCanvas");
	var tools = new ToolSettings();
	var currentState = new CanvasState(canvas);

	setInterval(function() {
		currentState.draw();
	}, currentState.drawInterval);


	$("#myCanvas").mousedown(function(e) {
		// TODO: implement move

		currentState.isValid = false;
		currentState.isDrawing = true;

		if(tools.shape === "rect") {
			currentState.startX = e.pageX - this.offsetLeft;
			currentState.startY = e.pageY - this.offsetTop;
			currentState.shapes.push(new Rectangle(currentState.startX, currentState.startY, 0, 0, tools.color));
		} else if(tools.shape === "line") {
			currentState.startX = e.pageX - this.offsetLeft;
			currentState.startY = e.pageY - this.offsetTop;
			currentState.shapes.push(new Line(currentState.startX, currentState.startY, currentState.startX, currentState.startY, tools.color));
		} else if(tools.shape === "pen") {
			console.log(currentState.shapes.length);
			var x = new Array();
			var y = new Array();
			x.push(e.pageX - this.offsetLeft);
			y.push(e.pageY - this.offsetTop);
			currentState.shapes.push(new Pen(x, y, tools.color));
			console.log(currentState.shapes.length);

		}
	});

	$("#myCanvas").mousemove(function(e) {
		if (currentState.isDrawing) {

			if(tools.shape === "rect") {
				var currentShape = currentState.shapes.pop();
				currentShape.w = e.pageX - this.offsetLeft;
				currentShape.h = e.pageY - this.offsetTop;
				currentState.shapes.push(currentShape);
			} else if(tools.shape === "line") {
				var currentShape = currentState.shapes.pop();
				currentShape.x2 = e.pageX - this.offsetLeft;
				currentShape.y2 = e.pageY - this.offsetTop;
				currentState.shapes.push(currentShape);
			} else if(tools.shape === "pen") {
				var currentShape = currentState.shapes.pop();
				currentShape.x.push(e.pageX - this.offsetLeft);
				currentShape.y.push(e.pageY - this.offsetTop);
				currentState.shapes.push(currentShape);
				console.log(currentState.shapes.length);
			}
			currentState.isValid = false;
		};
	});

	$("#myCanvas").mouseup(function(e) {
		currentState.isDrawing = false;
	});
});