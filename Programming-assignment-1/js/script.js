// Constructor for tool settings
function ToolSettings() {
	this.shape = "rect";
	this.fill = "#FFFFFF";
	this.lineWidth = "1";
	this.stroke = "#000000";
	this.font = "Georgia";
	this.fontsize = 14;
	this.fillActive = false;
	this.strokeActive = true;
}


function Rectangle(x, y, x2, y2, fill, stroke, lineWidth, strokeActive, fillActive) {
	this.x = x;
	this.y = y;
	this.x2 = x2;
	this.y2 = y2;
	this.fill = fill;
	this.stroke = stroke;
	this.lineWidth = lineWidth;
	this.strokeActive = strokeActive;
	this.fillActive = fillActive;
}

// Draw the rectangle
Rectangle.prototype.draw = function(ctx) {
  console.log(this.toString);
  ctx.fillStyle = this.fill;
  ctx.strokeStyle = this.stroke;
  ctx.lineWidth = this.lineWidth;
  if (this.fillActive) {
	  ctx.fillRect(this.x2, this.y2, this.x - this.x2, this.y - this.y2);
  };
  if (this.strokeActive) {
	  ctx.strokeRect(this.x2, this.y2, this.x - this.x2, this.y - this.y2);
  };
}

Rectangle.prototype.contains = function(mx, my, ctx) {
	var ctx2 = ctx;
	ctx2.rect(this.x2, this.y2, this.x - this.x2, this.y - this.y2);
	if(ctx2.isPointInPath){
		return true;
	} else{ return false; }
}

Rectangle.prototype.move = function(x, y, x2, y2){
	var difOfX = x - x2;
	var difOfY = y - y2;

	this.x = this.x + difOfX;
	this.x2 = this.x2 + difOfX;
	this.y = this.y + difOfY;
	this.y2 = this.y2 + difOfY;
}

function Ellipse(x, y, x2, y2, fill, stroke, lineWidth, strokeActive, fillActive) {
	this.className = "ellip";
	this.x = x;
	this.y = y;
	this.x2 = x2;
	this.y2 = y2;
	this.fill = fill;
	this.lineWidth = lineWidth;
	this.stroke = stroke;
	this.strokeActive = strokeActive;
	this.fillActive = fillActive;
}


Ellipse.prototype.draw = function(ctx) {
	var kappa = .5522848,
		w = this.x - this.x2,
		h = this.y - this.y2,
		x = this.x - w/2.0,
		y = this.y - h/2.0,
		ox = (w / 2) * kappa, // control point offset horizontal
		oy = (h / 2) * kappa, // control point offset vertical
		xe = x + w,           // x-end
		ye = y + h,           // y-end
		xm = x + w / 2,       // x-middle
		ym = y + h / 2;       // y-middle

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	if (this.strokeActive) {
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.lineWidth;
		ctx.stroke();
	};
	if (this.fillActive) {
		ctx.fillStyle = this.fill;
		ctx.fill()
	};
}

Ellipse.prototype.contains = function(mx, my, ctx) {
	var kappa = .5522848,
		w = this.x - this.x2,
		h = this.y - this.y2,
		x = this.x - w/2.0,
		y = this.y - h/2.0,
		ox = (w / 2) * kappa, // control point offset horizontal
		oy = (h / 2) * kappa, // control point offset vertical
		xe = x + w,           // x-end
		ye = y + h,           // y-end
		xm = x + w / 2,       // x-middle
		ym = y + h / 2;       // y-middle
		ctx2 = ctx;

	ctx2.beginPath();
	ctx2.moveTo(x, ym);
	ctx2.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx2.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx2.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx2.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx2.fill();
	if(ctx2.isPointInPath(mx,my)){
		return true;
	} else {return false;}
}

Ellipse.prototype.move = function(x, y, x2, y2){
	var difOfX = x - x2;
	var difOfY = y - y2;

	this.x = this.x - difOfX;
	this.x2 = this.x2 - difOfX;
	this.y = this.y - difOfY;
	this.y2 = this.y2 - difOfY;
}


function Line(x, y, x2, y2, stroke, lineWidth) {
	this.className = "line";
	this.x = x;
	this.y = y;
	this.x2 = x2;
	this.y2 = y2;
	this.stroke = stroke;
	this.lineWidth = lineWidth;
}

Line.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.strokeStyle = this.stroke;
	ctx.lineWidth = this.lineWidth;
	ctx.moveTo(this.x, this.y);
	ctx.lineTo(this.x2, this.y2);
	ctx.stroke();
}

Line.prototype.contains = function(mx, my, ctx){
	var slopem1 = (my - this.y)/(mx - this.x);
	var slopem2 = (this.y2 - my)/(this.x2 - mx);

	var dif = slopem1 - slopem2;

	if(dif < 1 && dif > -1) {
		return true;
	} else return false;

}

Line.prototype.move = function(x, y, x2, y2){
	var difOfX = x - x2;
	var difOfY = y - y2;

	this.x = this.x - difOfX;
	this.x2 = this.x2 - difOfX;
	this.y = this.y - difOfY;
	this.y2 = this.y2 - difOfY;
}


function Pen(x, y, stroke, lineWidth){
	this.className = "pen";
	this.x = x;
	this.y = y;
	this.stroke = stroke;
	this.lineWidth = lineWidth;
}

Pen.prototype.contains = function(mx, my, ctx) {
	var allDots = true;
	for(var i = 0; i < this.x.length; i++) {
		var difx = mx - this.x[i];
		var dify = my - this.y[i];
		if(!(2 > difx > -2 && 2 > dify > -2)) {
			allDots = false;
		}
	}
	return allDots;
}

Pen.prototype.draw = function(ctx) {
	for(var i = 0; i < this.x.length - 1; i++) {
		ctx.beginPath(); 
		ctx.strokeStyle = this.stroke;
		ctx.lineWidth = this.lineWidth;
		ctx.moveTo(this.x[i], this.y[i]);
		ctx.lineTo(this.x[i + 1], this.y[i + 1]);
		ctx.closePath();
		ctx.stroke();
	}
}

Pen.prototype.move = function(x, y , x2, y2) {
	var difOfX = x - x2;
	var difOfY = y - y2;
	for(var i = 0; i < this.x.length; i++) {
		this.x[i] = this.x[i] - difOfX;
		this.y[i] = this.y[i] - difOfY;
	}
}

function Text(textString, x, y, color, font) {
	this.textString = textString;
	this.x = x;
	this.y = y;
	this.color = color;
	this.font = font;
}

Text.prototype.draw = function(ctx) {
	ctx.font = this.font;
	ctx.fillStyle = this.color;
	ctx.fillText(this.textString, this.x, this.y);
}


function Circle(x1, y1, x2, y2, fill, lineWidth, stroke, strokeActive, fillActive) {
	this.className = "circle";
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.fill = fill;
	this.lineWidth = lineWidth;
	this.stroke = stroke;
	this.strokeActive = strokeActive;
	this.fillActive = fillActive;
}

Circle.prototype.contains = function(mx, my, ctx) {
	var x, y, rad, a, b, ctx2;
	x = (this.x1 + this.x2) / 2;
	y = (this.y1 + this.y2) / 2;

	a = (Math.abs(this.x1 - this.x2));
	b = (Math.abs(this.y1 - this.y2));
	rad = Math.sqrt((a * a) + (b * b)) / 2;
	ctx2 = ctx;

	ctx2.arc(x, y, rad, 0, 2 * Math.PI, false);

	if(ctx2.isPointInPath(mx, my)){
		return true;
	} else{ return false; }
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
	if (this.fillActive) {
		ctx.fillStyle = this.fill;
		ctx.fill();
	};
	if (this.strokeActive) {
		ctx.lineWidth = this.lineWidth;
		ctx.strokeStyle = this.stroke;
		ctx.stroke();
	};

}

Circle.prototype.move = function(x, y, x2, y2){
	var difOfX = x - x2;
	var difOfY = y - y2;

	this.x = this.x + difOfX;
	this.y = this.y + difOfY;
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

	this.undoStack = [];
	this.redoStack = [];

	this.idInArr = null;
	this.selection = null;
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

CanvasState.prototype.saveState = function() {
	var newArray = this.shapes.slice();
	this.undoStack.push(newArray);
}

CanvasState.prototype.undo = function(){
	console.log("undostack: " + this.undoStack);
	console.log("redostack: " + this.redoStack);
	var newArray = this.shapes.slice();
	this.redoStack.push(newArray);
	this.shapes = this.undoStack.pop();
	this.isValid = false;
}

CanvasState.prototype.redo = function() {
	var newArray = this.shapes.slice();
	this.undoStack.push(newArray);
	this.shapes = this.redoStack.pop();
	this.isValid = false;
}


$(document).ready(function() {
	var canvas = document.getElementById("myCanvas");
	var tools = new ToolSettings();

	initToolbars("rect");

	canvas.style.width='100%';
	canvas.style.height='100%';
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	var currentState = new CanvasState(canvas);

	setInterval(function() {
		currentState.draw();
	}, currentState.drawInterval);


	$("#myCanvas").mousedown(function(e) {
		// TODO: implement move
		var x, y;

		// currentState.saveState();
		var newArray = currentState.shapes.slice();
		currentState.undoStack.push(newArray);

		currentState.isValid = false;
		currentState.isDrawing = true;


		var offsetX = 0, offsetY = 0, element = currentState.canvas;
		if (element.offsetParent !== undefined) {
			do {
				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
			} while ((element = element.offsetParent));
		}

		currentState.startX = e.pageX - offsetX;
		currentState.startY = e.pageY - offsetY;
		x = currentState.startX;
		y = currentState.startY;

		if(tools.shape === "rect") {
			currentState.shapes.push(new Rectangle(x, y, x, y, tools.fill, tools.stroke, tools.lineWidth, tools.strokeActive, tools.fillActive));
		} else if (tools.shape === "circle") {
			currentState.shapes.push(new Circle(x, y, x, y, tools.fill, tools.lineWidth, tools.stroke, tools.strokeActive, tools.fillActive));
		} else if(tools.shape === "line") {
			currentState.startX = e.pageX - this.offsetLeft;
			currentState.startY = e.pageY - this.offsetTop;
			currentState.shapes.push(new Line(x, y, x, y, tools.stroke, tools.lineWidth));
		} else if(tools.shape === "pen") {
			var a = new Array();
			var b = new Array();
			a.push(x);
			b.push(y);
			currentState.shapes.push(new Pen(a, b, tools.stroke, tools.lineWidth));
		} else if(tools.shape === "move"){
			//Each shape needs a contains function
			var shapes = currentState.shapes;
			var l = shapes.length;
			for(var i = l - 1; i >= 0; i--) {
				if(shapes[i].contains(x, y, currentState.ctx)) {
					var mySel = shapes[i];
					currentState.idInArr = i;
					currentState.startX = x;
					currentState.startY = y;
					currentState.selection = mySel;
					return;
				}
			}
			isDrawing = false;
		}else if(tools.shape === "ellip"){
			currentState.shapes.push(new Ellipse(x, y, x, y, tools.fill, tools.stroke, tools.lineWidth, tools.strokeActive, tools.fillActive));
		} else if (tools.shape === "text") {

		}

	});

	$("#myCanvas").mousemove(function(e) {
		if (currentState.isDrawing) {
			if(tools.shape !== "move") {
				var currentShape = currentState.shapes.pop();
			}

			var offsetX = 0, offsetY = 0, element = currentState.canvas;
			if (element.offsetParent !== undefined) {
				do {
					offsetX += element.offsetLeft;
					offsetY += element.offsetTop;
				} while ((element = element.offsetParent));
			}
			var x = e.pageX - offsetX;
			var y = e.pageY - offsetY;

			if(tools.shape === "rect") {				
				currentShape.x2 = x;
				currentShape.y2 = y;
			} else if (tools.shape === "circle") {
				currentShape.x2 = x;
				currentShape.y2 = y;
			} else if(tools.shape === "line") {
				currentShape.x2 = x;
				currentShape.y2 = y;
			} else if(tools.shape === "pen") {
				currentShape.x.push(x);
				currentShape.y.push(y);
			} else if(tools.shape === "ellip"){
				currentShape.x2 = x;
				currentShape.y2 = y;
			} else if(tools.shape === "move" && currentState.selection != null) {
				//each shape needs a contains function for this
				var i = currentState.idInArr;
				currentState.selection.move(currentState.startX, currentState.startY, x, y);
				currentState.startX = x;
				currentState.startY = y;
				currentState.shapes[i] = currentState.selection;
			}
			if(tools.shape !== "move") {
				currentState.shapes.push(currentShape);
			}

			currentState.isValid = false;
		};
	});

	$("#myCanvas").mouseup(function(e) {
		currentState.isDrawing = false;

		currentState.idInArr = null;
		currentState.selection = null;


		if (tools.shape === "text") {

			if ($("#textArea").length !== 0) {
				$("#textArea").remove();
			}
			var x = currentState.startX;
			var y = currentState.startY + tools.fontsize;

			var textBox = '<div id="textArea" style="position:absolute;top:' + (y - tools.fontsize) + 
				'px;left:' + (x + this.offsetLeft)+ 'px;z-index:30;"><textArea id="textBox"></textArea></div>';

			$("#canvasArea").append(textBox);
			$("#textBox").focus();

			$("#textBox").bind("keydown", function(e) {
				if (e.keyCode === 13) {
					var textString = $(this).val();
					currentState.shapes.push(new Text(textString, x, y, tools.fill, tools.fontsize + "px " + tools.font));
					currentState.isValid = false;
					$("#textArea").remove();
				} else if (e.keyCode === 27) {
					$("#textArea").remove();
				}
			});
		}
	});

	$("#undo-btn").click(function(e) {
		currentState.undo();
		// console.log(undoRedo);
		// undoRedo.redoStack.push(currentState);
		// currentState = undoRedo.undoStack.pop();
		// currentState.isValid = false;
	});

	$("#redo-btn").click(function(e) {
		currentState.redo();
		// undoRedo.undoStack.push(currentState);
		// currentState = undoRedo.redoStack.pop();
		// currentState.isValid = false;
	});

	$(".tool").click(function(e) {
		var activeTool = $(this).data("tool");
		initToolbars(activeTool);
		tools.shape = activeTool;
	});

	$(".fill-stroke-toggle button").click(function(e) {
		$(this).toggleClass("btn-primary");
		$(this).toggleClass("btn-default");
		if ($(this).html() === "Fill") {
			tools.fillActive = !tools.fillActive;
		} else if ($(this).html() === "Stroke") {
			tools.strokeActive = !tools.strokeActive;
		};
	});

	$(".stroke-width div ul li a").click(function(e) {
		var strokewidth = $(this).data("strokewidth");
		tools.lineWidth = strokewidth;
		$("#stroke-width-indicator").html(strokewidth);
	});

	$(".stroke-color div ul li a").click(function(e) {
		var strokecolor = $(this).data("strokecolor");
		tools.stroke = strokecolor;
		$("#stroke-color-indicator").css("color", strokecolor);
	});

	$(".fill-color div ul li a").click(function(e) {
		var fillcolor = $(this).data("fillcolor");
		tools.fill = fillcolor 
		$("#fill-color-indicator").css("color", fillcolor);
	});

	$(".fonts div ul li a").click(function(e) {
		var font = $(this).data("fonts");
		tools.font = font;
		$("#font-indicator").css("font-family", font).html(font);

	});

	$(".font-size div ul li a").click(function(e) {
		var fontsize = $(this).data("fontsize");
		tools.fontsize = fontsize;
		$("#font-size-indicator").html(fontsize);
	});

	$("#clear-canvas").click(function(e) {
		currentState.shapes = [];
		currentState.isValid = false;
	});


});

function initToolbars(activeTool) {
	$(".tool-settings").hide();
	$(".tool").attr("class", "tool btn btn-default");
	$("#" + activeTool).attr("class", "tool btn btn-primary");

	if (activeTool === "rect" || activeTool === "circle" || activeTool === "ellip") {
		$(".fill-stroke-toggle").show();
		$(".stroke-width").show();
		$(".stroke-color").show();
		$(".fill-color").show();
	} else if (activeTool === "line" || activeTool === "pen") {
		$(".stroke-width").show();
		$(".stroke-color").show();
	} else if (activeTool === "text") {
		$(".font-size").show();
		$(".fonts").show();
		$(".fill-color").show();
	}
}
