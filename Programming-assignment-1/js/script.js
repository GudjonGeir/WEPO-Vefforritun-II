// Constructor for tool settings
function ToolSettings() {
	this.shape = "rect";
	this.fill = "#FFFFFF";
	this.lineWidth = "5";
	this.stroke = "#000000"
}

// Constructor for rectangle object
function Rectangle(x, y, w, h, fill, stroke) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fill = fill;
	this.stroke = stroke;
}

// Draw the rectangle
Rectangle.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  strokeStyle = this.stroke
  ctx.fillRect(this.x, this.y, this.w, this.h);
  ctx.strokeRect(this.x, this.y, this.w, this.h);
}

function Circle(x1, y1, x2, y2, fill, lineWidth, stroke) {
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.fill = fill;
	this.lineWidth = lineWidth;
	this.stroke = stroke;
}

Circle.prototype.draw = function(ctx) {
	var x, y, rad, a, b;
	x = (this.x1 + this.x2) / 2;
	y = (this.y1 + this.y2) / 2;

	a = (Math.abs(this.x1 - this.x2));
	b = (Math.abs(this.y1 - this.y2));
	rad = Math.sqrt((a * a) + (b * b)) / 2;


	ctx.beginPath()
	ctx.arc(x, y, rad, 0, 2 * Math.PI, false);
	ctx.fillStyle = this.fill;
	ctx.fill();
	ctx.lineWidth = this.lineWidth;
	ctx.strokeStyle = this.stroke;
	ctx.stroke()
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
		var x, y;

		currentState.isValid = false;
		currentState.isDrawing = true;
		currentState.startX = e.pageX - this.offsetLeft;
		currentState.startY = e.pageY - this.offsetTop;
		x = currentState.startX;
		y = currentState.startY;

		if(tools.shape === "rect") {
			currentState.shapes.push(new Rectangle(x, y, 0, 0, tools.fill, tools.stroke));
		} else if (tools.shape === "circle") {
			currentState.shapes.push(new Circle(x, y, x, y, tools.fill, tools.lineWidth, tools.stroke));
		};
	});

	$("#myCanvas").mousemove(function(e) {
		if (currentState.isDrawing) {
			var currentShape;
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;

			if(tools.shape === "rect") {				
				currentShape = currentState.shapes.pop();
				currentShape.w = Math.abs(currentState.startX - x);
				currentShape.h = Math.abs(currentState.startY - y);
			} else if (tools.shape === "circle") {
				currentShape = currentState.shapes.pop();
				currentShape.x2 = x;
				currentShape.y2 = y;

			} else {
				return;
			}
			currentState.shapes.push(currentShape);
			currentState.isValid = false;
		};
	});

	$("#myCanvas").mouseup(function(e) {
		currentState.isDrawing = false;
	});


	$(".tool").click(function(e) {
		tools.shape = $(this).data("tool");
	});

	$(".strokeColor").click(function(e) {
		tools.stroke = $(this).data("strokecolor");
	});

	$(".fillColor").click(function(e) {
		tools.fill = $(this).data("fillcolor");
	});

	$(".line").click(function(e) {
		tools.lineWidth = $(this).data("strokewidth");
	});
});