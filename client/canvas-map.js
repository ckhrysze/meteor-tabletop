var stage;
var squareSize = 24;
var halfSquare = squareSize/2;
var numSquares = 24;

function initMap() {
    var sources = {
        background: "stone_map.png"
    };
    loadImages(sources, initStage);
}

function loadImages(sources, callback) {
    var assetDir = "http://www.html5canvastutorials.com/demos/assets/";
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for(var src in sources) {
        numImages++;
    }
    for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
		callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function drawBackground(layer, img) {
    var context = layer.getContext();
    context.drawImage(img, squareSize, squareSize);
}

function initStage(images) {
    stage = new Kinetic.Stage({
        container: "canvas",
        width: squareSize + numSquares*squareSize, // left gutter + map
        height: squareSize*2 + numSquares*squareSize // top and bottom gutter + map
    });
    var background = new Kinetic.Layer();
    var grid = new Kinetic.Layer();
    var layer = new Kinetic.Layer({id: "token_layer"});

    stage.add(background);
    stage.add(grid);
    stage.add(layer);

    drawBackground(background, images.background);
    drawGrid(grid);
    drawTokens();

    setupObserver();
}

function drawGrid(layer) {
    var bottomY = squareSize + numSquares*squareSize;
    for (var i=0; i<numSquares; i++) {
	layer.add(new Kinetic.Text({
            text: i+1
	    , x: squareSize*(i+1) + halfSquare
	    , y: bottomY + 2
	    , textFill: "black"
	    , align: "center"
	    , fontSize: 11
	    , fontFamily: "helvetica,verdana,arial,sans-serif"
	}));
	layer.add(new Kinetic.Text({
	    text: String.fromCharCode(65+i)
	    , x: halfSquare
	    , y: squareSize*i + squareSize + halfSquare
	    , textFill: "black"
	    , align: "center"
	    , verticalAlign: "middle"
	    , fontSize: 11
	    , fontFamily: "helvetica,verdana,arial,sans-serif"
	}));
    }
    layer.draw();
}

function setupObserver() {
    Pieces.find({}).observe({
	added: function(piece) {
	    drawTokens();
	},
	changed: function() {
	    drawTokens();
	}
    });
}

function drawTokens() {
    var layer = stage.get("#token_layer")[0];
    layer.clear();
    layer.removeChildren();

    Pieces.find({}).forEach(function(piece) {

        var token = new Kinetic.Circle({
	    x: piece.x,
	    y: piece.y,
	    fill: piece.color,
	    draggable: true,
	    radius: halfSquare
        });

        token.on("dragstart", function() {
	    token.moveToTop();
	    layer.draw();
        });

        token.on("dragmove", function() {
	    document.body.style.cursor = "move";
        });

	token.on("dragend", function() {
	    var gridX = Math.floor(token.attrs.x / squareSize);
	    var gridY = Math.floor(token.attrs.y / squareSize);
	    token.attrs.x = gridX * squareSize + halfSquare;
	    token.attrs.y = gridY * squareSize + halfSquare;
	    Pieces.update({_id: piece._id},
			  {$set: {x: token.attrs.x, y: token.attrs.y}}
			 );
	    drawTokens();
	});

        token.on("mouseover", function() {
	    document.body.style.cursor = "move";
        });

        token.on("mouseout", function() {
	    document.body.style.cursor = "default";
        });

	layer.add(token);
    });

    layer.draw();
}
