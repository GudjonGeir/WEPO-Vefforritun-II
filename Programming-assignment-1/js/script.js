// Constructor for tool settings
function ToolSettings() {
	this.shape = "rect";
	this.fill = "#FFFFFF";
	this.lineWidth = "1";
	this.stroke = "#000000"
}

// Constructor for rectangle object
function Rectangle(x, y, w, h, fill, stroke, lineWidth) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fill = fill;
	this.stroke = stroke;
	this.lineWidth = lineWidth;
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
  ctx.strokeStyle = this.stroke;
  ctx.lineWidth = this.lineWidth;
  ctx.fillRect(this.w, this.h, this.x - this.w, this.y - this.h);
  ctx.strokeRect(this.w, this.h, this.x - this.w, this.y - this.h);
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
			currentState.shapes.push(new Rectangle(x, y, x, y, tools.fill, tools.stroke, tools.lineWidth));
		} else if (tools.shape === "circle") {
			currentState.shapes.push(new Circle(x, y, x, y, tools.fill, tools.lineWidth, tools.stroke));
		} else if(tools.shape === "line") {
			currentState.startX = e.pageX - this.offsetLeft;
			currentState.startY = e.pageY - this.offsetTop;
			currentState.shapes.push(new Line(x, y, x, y, tools.color));
		} else if(tools.shape === "pen") {
			var a = new Array();
			var b = new Array();
			a.push(e.pageX - this.offsetLeft);
			b.push(e.pageY - this.offsetTop);
			currentState.shapes.push(new Pen(a, b, tools.color));
		}

	});

	$("#myCanvas").mousemove(function(e) {
		if (currentState.isDrawing) {
			var currentShape = currentState.shapes.pop();;
			var x = e.pageX - this.offsetLeft;
			var y = e.pageY - this.offsetTop;

			if(tools.shape === "rect") {				
				currentShape.w = x;
				currentShape.h = y;
			} else if (tools.shape === "circle") {
				currentShape.x2 = x;
				currentShape.y2 = y;
			} else if(tools.shape === "line") {
				currentShape.x2 = e.pageX - this.offsetLeft;
				currentShape.y2 = e.pageY - this.offsetTop;
			} else if(tools.shape === "pen") {
				currentShape.x.push(e.pageX - this.offsetLeft);
				currentShape.y.push(e.pageY - this.offsetTop);
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