// Constructor for tool settings
function ToolSettings() {
	this.shape = "rect";
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

// Draw the rectangle
Rectangle.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
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
		if(tools.shape === "rect") {
			currentState.isDrawing = true;
			currentState.startX = e.pageX - this.offsetLeft;
			currentState.startY = e.pageY - this.offsetTop;
			currentState.shapes.push(new Rectangle(currentState.startX, currentState.startY, 0, 0, tools.color));
		}
	});

	$("#myCanvas").mousemove(function(e) {
		if (currentState.isDrawing) {

			if(tools.shape === "rect") {
				var x = e.pageX - this.offsetLeft;
				var y = e.pageY - this.offsetTop;
				var currentShape = currentState.shapes.pop();
				currentShape.w = Math.abs(currentState.startX - x);
				currentShape.h = Math.abs(currentState.startY - y);
				currentState.shapes.push(currentShape);
			}
			currentState.isValid = false;
		};
	});

	$("#myCanvas").mouseup(function(e) {
		currentState.isDrawing = false;
	});
});