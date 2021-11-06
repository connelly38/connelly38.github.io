
var graphWidth = 1200;
var graphHeight = 500;
var graphNumLines = 0; // number of colored lines
var graphNumPoints = 0; // number pf individual plot points in graph
var maxPoint = 0;
var horizontalScale = 1;
var startPoint = 0;
var lineNames = [];


var topCanvas = document.getElementById('topcanvas');
var topContext = topCanvas.getContext('2d');

var leftCanvas = document.getElementById('leftcanvas');
var leftContext = leftCanvas.getContext('2d');
var leftWidth = 100;
var leftHeight = 500;

var rightCanvas = document.getElementById('rightcanvas');
var rightContext = rightCanvas.getContext('2d');
var rightWidth = 200;
var rightHeight = 500;

var graphData = [];

var filePicker = document.getElementById('gload');
filePicker.onchange = function () {
	var file = filePicker.files[0];
	loadGraphData(file);
};


var graphColors = ["navy", "blue", "red", "brown", "green", "orange", "purple"];

var hScaleSlider = document.getElementById('hscale');
hScaleSlider.oninput = function() {
    horizontalScale = this.value;
    drawGraph();
}

var windowSlider = document.getElementById('window');
windowSlider.oninput = function() {
    startPoint = Math.floor((this.value * graphNumPoints) / 100);
    drawGraph();
}

var resultsDisplay = document.getElementById('results');


      function getMousePos(c, e) {
        var rect = c.getBoundingClientRect();

        //var message = 'ex=' + e.clientX + ' ey=' + e.clientY + ' l=' + rect.left + ' t=' + rect.top;
        //writeMessage(message, 0);

        return {
          x: Math.floor(e.clientX - rect.left),
          y: Math.floor(e.clientY - rect.top)
        };
      }

    var mouseDown = false;
    var mouseX = 0;
    var mouseY = 0;


    topCanvas.addEventListener('mousedown', function(evt) {
        mouseDown = true;
        var mousePos = getMousePos(topCanvas, evt);
        mouseX = mousePos.x;
        mouseY = mousePos.y;
    }, false);

    topCanvas.addEventListener('mouseup', function(evt) {
        mouseDown = false;
    }, false);

    topCanvas.addEventListener('mousemove', function(evt) {
        if(!mouseDown) return;
        //var mousePos = getMousePos(topCanvas, evt);
        //knitPatternXOffset = mousePos.x - mouseX;
        //knitPatternYOffset = mousePos.y - mouseY;
        //topContext.putImageData(imageData, 0, 0);
        //drawPatternOnImage(topContext);
        //knitify();
    }, false);


    function loadGraphData(filename) {
		maxPoint = 0;
		graphNumLines = 0;
		graphNumPoints = 0;
        var reader = new FileReader();
        reader.onload = function (e) {
        	var fileText = e.target.result;
			// parse lines of text
			var arr = fileText.split("\n");
			// first line has column names
			lineNames = arr[0].split(",");
			if (lineNames.length < 2) {
				window.alert("Can't read data");
				return;
			}
			graphData = [];
			for (var i=0; i<lineNames.length; i++) {
				graphData[i] = [];
			}
			graphNumLines = lineNames.length;
			graphNumPoints = 0;
			for (var i=1; i<arr.length; i++) {
				var kv = arr[i].split(",");
				if (kv.length != lineNames.length) continue;
				var val = 0;
				for (var j=0; j<kv.length; j++) {
					val = parseInt(kv[j]);
					if(j>0 && maxPoint < val) maxPoint = val;
					graphData[j][graphNumPoints] = val;
				}
				graphNumPoints++;
			}
        	topCanvas.width = graphWidth;
        	topCanvas.height = graphHeight;
			drawAll();
        };
        reader.readAsText(filename);
    }

	function drawAll() {
		drawLeft();
		drawGraph();
		drawRight();
	}

	function drawRight() {
		rightContext.clearRect(0, 0, rightWidth, rightHeight);
		rightContext.lineWidth = 2;
        rightContext.font = '12pt Courier';
		var y = 30;
		for(var i=1; i<graphNumLines; i++, y+=30) {
			rightContext.strokeStyle = graphColors[i-1];
			rightContext.beginPath();
			rightContext.moveTo(10, y);
			rightContext.lineTo(70, y);
			rightContext.stroke();
        	rightContext.fillText(lineNames[i], 80, y);
		}
	}

	function drawLeft() {
		leftContext.clearRect(0, 0, leftWidth, leftHeight);
		leftContext.lineWidth = 1;
		leftContext.strokeStyle = "black";
		//leftContext.beginPath();
		var incr = leftHeight/10;
		//for(var y=(leftHeight-incr); y>0; y-=incr) {
			//leftContext.moveTo((leftWidth - 20), y);
			//leftContext.lineTo(leftWidth, y);
		//}
		//leftContext.stroke();
        leftContext.font = '8pt Courier';
		var ppIncr = Math.floor(maxPoint / 10);
		var y=0;
		var val=0;
		for(y=(leftHeight-incr), val=ppIncr; y>0; y-=incr, val+=ppIncr) {
        	leftContext.fillText("-- " + val + " --", leftWidth - 80, y+2);
		}
	}

    function drawGraph() {

var maxY = 0;
		topContext.clearRect(0, 0, graphWidth, graphHeight);
        // draw lines
		for(var j=1; j<graphNumLines; j++) {
        	topContext.lineWidth = 2;
        	topContext.beginPath();
        	topContext.strokeStyle = graphColors[j-1];
        	topContext.moveTo(0, 0);
			var x=0;
			var y=0;
			var val=0;
			for(var i=startPoint; i<graphNumPoints; i++) {
				x = ((i - startPoint) * horizontalScale * graphWidth) / graphNumPoints;
				if (x > graphWidth) break;
				val = graphData[j][i];
				y = (val * graphHeight) / maxPoint;
				y = (graphHeight - y);
        		topContext.lineTo(x, y);
if(maxY < y) maxY = y;
			}
        	topContext.stroke();
		}

		var str = "maxY=" + maxY + ", maxPoint=" + maxPoint + ", startPoint=" + startPoint + ", numPoints=" + graphNumPoints + ", height=" + graphHeight;
		resultsDisplay.innerHTML = str;
    }

