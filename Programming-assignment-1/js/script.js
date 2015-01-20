//Assignment was created with help from a tutorial by William Malone
//It can be reached from here http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

var canvas;
var context;
var canvasWidth = 490;
var canvasHeight = 220;
var paint = false;

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();

var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var colorWhite = "#ffffff";

var curColor = colorPurple;
var clickColor = new Array();

var clickSize = new Array();
var curSize = "normal";

var isUndo = false;

var isPen = true;
var isLine = false;

var prevX = "NaN";
var prevY = "NaN";

var redoBackup = new Array();

function prepareCanvas(){
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);

	if(typeof G_vmlCanvasManager != 'undefined'){
		canvas = G_vmlCanvasManager.initElement(canvas);
	} 

	context = canvas.getContext("2d");

	$('#canvas').mousedown(function(e){
		if(isLine && prevX == "NaN"){							//muna að breyta prevX og Y í "NaN" þegar þetta case á ekki við eða skipt erum tól
			prevX = e.pageX - this.offsetLeft;
			prevY = e.pageY - this.offsetTop;
		} else if(prevX != "NaN"){
			drawConnection(prevX, prevY, e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		} else{
			paint = true;
			addClick(e.pageX -this.offsetLeft, e.pageY - this.offsetTop, false);
			redraw();
		}
	});


	$('#canvas').mousemove(function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});

	$('#canvas').mouseup(function(e){
		paint = false;
	});

	$('#canvas').mouseleave(function(e){
		paint = false;
	});
}

function drawConnection(x1, y1, x2, y2) {



        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
        context.closePath();
        prevX = "NaN";
        prevY = "NaN"
        clickX.push(x1);
		clickY.push(y1);
		clickDrag.push(false);
		clickColor.push(curColor);
		clickSize.push(curSize);
       	clickX.push(x2);
		clickY.push(y2);
		clickDrag.push(true);
		clickColor.push(curColor);
		clickSize.push(curSize);
		redraw();
}

function clearCanvas(){

	context.clearRect(0, 0, canvasWidth, canvasHeight);
	clickX = new Array();
	clickY = new Array();
	clickDrag = new Array();
	clickSize = new Array();
	clickColor = new Array();
	curSize = "normal";
}

function undo(){

	isUndo = true;
	console.log("clickDrag: " + clickDrag.length);
	console.log("clickX: " + clickX.length);
	console.log("clickY: " + clickY.length);
	console.log("clickSize: " + clickSize.length);
	console.log("clickColor: " + clickColor.length);


	var drag = true;
	while(drag){
		redoBackup.push(clickX.pop());
		redoBackup.push(clickY.pop());
		redoBackup.push(clickSize.pop());
		redoBackup.push(clickColor.pop());
		drag = clickDrag.pop();
		redoBackup.push(drag);
	}
	/*redoBackup.push(clickDrag.pop());
	redoBackup.push(clickX.pop());
	redoBackup.push(clickY.pop());
	redoBackup.push(clickSize.pop());
	redoBackup.push(clickColor.pop());*/

	console.log("clickDrag: " + clickDrag.length);
	console.log("clickX: " + clickX.length);
	console.log("clickY: " + clickY.length);
	console.log("clickSize: " + clickSize.length);
	console.log("clickColor: " + clickColor.length);

	/*while(clickDrag.length > 0){
		clickDrag.pop()
		clickX.pop();
		clickY.pop();
		clickSize.pop();
		clickColor.pop();
		console.log("clickDrag: " + clickDrag.length);
		console.log("clickX: " + clickX.length);
		console.log("clickY: " + clickY.length);
		console.log("clickSize: " + clickSize.length);
		console.log("clickColor: " + clickColor.length);
	}*/
	redraw();
}

function redo(){

	if(isUndo){

		var drag = redoBackup.pop();
		clickDrag.push(drag);
		clickColor.push(redoBackup.pop());
		clickSize.push(redoBackup.pop());
		clickY.push(redoBackup.pop());
		clickX.push(redoBackup.pop());

		drag = redoBackup.pop();

		if(!drag){
			redoBackup.push(drag);
		} else{
			while(drag){
				clickColor.push(redoBackup.pop());
				clickSize.push(redoBackup.pop());
				clickY.push(redoBackup.pop());
				clickX.push(redoBackup.pop());
				drag = redoBackup.pop();
				clickDrag.push(drag);
			}
		}
		redraw();
	}

	/*if(isUndo){

		var doThis = false;

		clickColor.push(redoBackup.pop());
		clickSize.push(redoBackup.pop());
		clickY.push(redoBackup.pop());
		clickX.push(redoBackup.pop());
		var drag = redoBackup.pop();
		clickDrag.push(drag);

		if(!drag){
			clickColor.push(redoBackup.pop());
			clickSize.push(redoBackup.pop());
			clickY.push(redoBackup.pop());
			clickX.push(redoBackup.pop());
			var drag = redoBackup.pop();
			clickDrag.push(drag);
			if(!drag){
				redoBackup.push(clickDrag.pop());
				redoBackup.push(clickX.pop());
				redoBackup.push(clickY.pop());
				redoBackup.push(clickSize.pop());
				redoBackup.push(clickColor.pop());
			} else{
				redoBackup.push(clickDrag.pop());
				redoBackup.push(clickX.pop());
				redoBackup.push(clickY.pop());
				redoBackup.push(clickSize.pop());
				redoBackup.push(clickColor.pop());
				doThis = true;
			}
		}

		while(drag && doThis){
			clickColor.push(redoBackup.pop());
			clickSize.push(redoBackup.pop());
			clickY.push(redoBackup.pop());
			clickX.push(redoBackup.pop());
			drag = redoBackup.pop();
			clickDrag.push(drag);
		}

		console.log("clickDrag: " + clickDrag.length);
		console.log("clickX: " + clickX.length);
		console.log("clickY: " + clickY.length);
		console.log("clickSize: " + clickSize.length);
		console.log("clickColor: " + clickColor.length);


		redraw();
	}*/
}

function clearBackup(){
	redoBackup = new Array();
}

function addClick(x, y, dragging){


		console.log("clickDrag b4: " + clickDrag.length);
		console.log("clickX b4: " + clickX.length);
		console.log("clickY b4: " + clickY.length);
		console.log("clickSize b4: " + clickSize.length);
		console.log("clickColor b4: " + clickColor.length);

	if(isUndo){
		clearBackup();
		isUndo = false;
	}
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickColor.push(curColor);
	clickSize.push(curSize);

		console.log("dragging: " + dragging);

		console.log("clickDrag: " + clickDrag.length);
		console.log("clickX: " + clickX.length);
		console.log("clickY: " + clickY.length);
		console.log("clickSize: " + clickSize.length);
		console.log("clickColor: " + clickColor.length);
}

function redraw(){

  	context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
  	context.lineJoin = "round";
 	context.lineWidth = 5;
	var radius;		
  	for(var i=0; i < clickX.length; i++) {	
  		radius = clickSize[i];

    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
     }else{
       context.moveTo(clickX[i]-1, clickY[i]);
     }
     context.lineTo(clickX[i], clickY[i]);
     context.closePath();
     context.strokeStyle = clickColor[i];
	 context.lineWidth = radius;
     context.stroke();
  }
}

function changeColor(){
	var color = changeColor.caller.arguments[0].target.id;
	alert(color);
	if(color == "white"){
		curColor = colorWhite;
	}
	else if(color == "purple"){
		curColor = colorPurple;
	}
	else if(color == "green"){
		curColor = colorGreen;
	}
	else if(color == "yellow"){
		curColor = colorYellow;
	}
	else if(color == "brown"){
		curColor = colorBrown;
	}

}

function changeTool(){
	var tool = changeTool.caller.arguments[0].target.id;
	if(tool == "pen"){
		isPen = true;
		isLine = false;
		prevX = "NaN";
		prevY = "NaN";
	}
	else if(tool == "line"){
		isPen = false;
		isLine = true;
	}

}

function modify_sz(val) {
    var sz = document.getElementById('sz').value;
    var new_sz = parseInt(sz,10) + val;
    
    if (new_sz < 0) {
        new_sz = 0;
    }
    
    document.getElementById('sz').value = new_sz;
    curSize = new_sz;
    return new_sz;
}