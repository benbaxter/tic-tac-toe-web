(function() {
	"use strict";

	var primaryColor = "#3f51b5";
	var accentColor = "#e91e63";

	var player = "X";
	var gameStarted = false;
	var hasValidMove = true;
	var gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]];

	var oCanvas = document.getElementById("oCanvas");
	var oCtx = oCanvas.getContext("2d");
	oCanvas.onclick = function() {
		if( ! gameStarted ) {
			drawO(oCtx, primaryColor);
			drawX(xCtx, accentColor);

			updatePlayerLabel(document.getElementById("xPlayerLabel"), "Computer", "mdl-color-text--pink-700");
			updatePlayerLabel(document.getElementById("oPlayerLabel"), "You", "mdl-color-text--indigo-700");
			player = "O";
		}
	}

	var xCanvas = document.getElementById("xCanvas");
	var xCtx = xCanvas.getContext("2d");
	xCanvas.onclick = function() {
		if( ! gameStarted ) {
			drawX(xCtx, primaryColor);
			drawO(oCtx, accentColor);

			updatePlayerLabel(document.getElementById("xPlayerLabel"), "You", "mdl-color-text--indigo-700");
			updatePlayerLabel(document.getElementById("oPlayerLabel"), "Computer", "mdl-color-text--pink-700");
			player = "X";
		}
	}

	function updatePlayerLabel(element, label, className) {
		element.innerHTML = label;
		element.className = className;
	}

	function drawO(ctx, color) {
		color = color || accentColor;

		ctx.beginPath();
		ctx.arc(50,50,40,0,2*Math.PI);
		ctx.lineWidth = 5;
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	function drawX(ctx, color) {
		color = color || primaryColor;

		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineWidth = 5;

		ctx.moveTo(10, 10);
		ctx.lineTo(90, 90);

		ctx.moveTo(10, 90);
		ctx.lineTo(90, 10);

		ctx.stroke();
	}

	var boardCanvas = document.getElementById("boardCanvas");
	var boardCtx = boardCanvas.getContext("2d");
	var boardWidth = boardCanvas.clientWidth;
	var boardHeight = boardCanvas.clientHeight;
	var squareWidth = boardWidth / 3;
	var squareHeight = boardHeight / 3;

	function drawBlankBoard(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		ctx.beginPath();
		ctx.lineWidth = 5;

		ctx.moveTo(boardWidth / 3, 0);
		ctx.lineTo(boardWidth / 3, boardHeight);

		ctx.moveTo(2 * boardWidth / 3, 0);
		ctx.lineTo(2 * boardWidth / 3, boardHeight);

		ctx.moveTo(0, boardHeight / 3);
		ctx.lineTo(boardWidth, boardHeight / 3);

		ctx.moveTo(0, 2 * boardHeight / 3);
		ctx.lineTo(boardWidth, 2 * boardHeight / 3);

		ctx.stroke();
	}

	boardCanvas.onclick = function (event) {
		if( ! hasValidMove ) {
			drawBlankBoard(boardCtx);
			gameBoard = [["", "", ""], ["", "", ""], ["", "", ""]];
			gameStarted = false;
			checkBoard();
		} else {
			gameStarted = true;
			var x = event.offsetX;
			var y = event.offsetY;
			//alert(xIndex + ", " + yIndex);
			var xIndex = Math.floor(x / squareWidth);
			var yIndex = Math.floor(y / squareHeight);

			if (gameBoard[yIndex][xIndex] === "") {
				drawMarker(xIndex, yIndex, player);
				nextMove();
			}
		}
	}

	function drawMarker(xIndex, yIndex, marker) {
		boardCtx.save();
		boardCtx.translate(squareWidth * xIndex + ((squareWidth - 100) / 2),
		                   squareHeight * yIndex + ((squareHeight - 100) / 2));

		if( marker === "X" ) {
			drawX(boardCtx, marker === player ? primaryColor : accentColor);
		} else {
			drawO(boardCtx, marker === player ? primaryColor : accentColor);
		}
		gameBoard[yIndex][xIndex] = marker;
		boardCtx.restore();
		checkBoard();
	}

	function nextMove() {
		if( hasValidMove ) {
			var x = Math.floor(Math.random() * 3);
			var y = Math.floor(Math.random() * 3);
			while (gameBoard[y][x] != "") {
				x = Math.floor(Math.random() * 3);
				y = Math.floor(Math.random() * 3);
			}
			var marker = player === "X" ? "O" : "X";
			drawMarker(x, y, marker);
		}
	}

	function checkBoard() {
		var winner = checkHorzWin() || checkVertWin() || checkDiagWin();
		hasValidMove = hasOpenSpots() && ! winner;
		if( ! hasValidMove ) {
			gameStarted = false;

			boardCtx.font = '60px Roboto';
			boardCtx.fillStyle = "#2e2e2e";
			var text = boardCtx.measureText("Game Over");
  			boardCtx.fillText("Game Over", (boardWidth / 2 ) - (text.width / 2), (boardHeight / 2));
		}
	}

	function hasOpenSpots() {
		for( var x = 0; x < gameBoard.length; ++x ) {
			for( var y = 0; y < gameBoard[x].length; ++y ) {
				if( gameBoard[x][y] === "" ) {
					return true;
				}
			}
		}
		return false;
	}

	function checkHorzWin() {
		for( var x = 0; x < gameBoard.length; ++x ) {
			var previous = gameBoard[x][0];
			var rowMatching = true;
			for( var y = 1; y < gameBoard[x].length; ++y ) {
				rowMatching &= previous === gameBoard[x][y] && gameBoard[x][y] !== "";
				previous = gameBoard[x][y];
			}
			if( rowMatching ) {
				//if it stays true, then we have a winner!
				return true;
			}
		}
		return false;
	}

	function checkVertWin() {
		for( var y = 0; y < gameBoard[0].length; ++y ) {
			var previous = gameBoard[0][y];
			var colMatching = true;
			for( var x = 1; x < gameBoard.length; ++x ) {
				colMatching &= previous === gameBoard[x][y] && gameBoard[x][y] !== "";
				previous = gameBoard[x][y];
			}
			if( colMatching ) {
				//if it stays true, then we have a winner!
				return true;
			}
		}
		return false;
	}

	function checkDiagWin() {
		var previous = gameBoard[0][0];
		var diagMatching = true;
		for( var x = 1, y = 1; x < gameBoard.length; ++x, ++y ) {
			diagMatching &= previous === gameBoard[x][y] && gameBoard[x][y] !== "";
			previous = gameBoard[x][y];
		}
		if( diagMatching ) {
			//if it stays true, then we have a winner!
			return true;
		}

		previous = gameBoard[gameBoard.length-1][0];
		diagMatching = true;
		for( var x = gameBoard.length-1, y = 0; x >= 0; --x, ++y ) {
			diagMatching &= previous === gameBoard[x][y] && gameBoard[x][y] !== "";
			previous = gameBoard[x][y];
		}
		return diagMatching;
	}

	drawO(oCtx);
	drawX(xCtx);
	drawBlankBoard(boardCtx);

})();