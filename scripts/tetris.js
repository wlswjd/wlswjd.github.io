// Tetris Game Logic
const tCanvas = document.getElementById('tetris-canvas');
const tCtx = tCanvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');

const ROW = 20, COL = 12, SQ = 25; 
let board = [], tScore = 0, tGame = false, tInterval;

// Shapes
const SHAPES = [
    [[[1,1,1,1]], "cyan"], // I
    [[[1,1,0],[0,1,1]], "red"], // Z
    [[[0,1,1],[1,1,0]], "green"], // S
    [[[1,1],[1,1]], "yellow"], // O
    [[[0,1,0],[1,1,1]], "purple"], // T
    [[[1,0,0],[1,1,1]], "blue"], // J
    [[[0,0,1],[1,1,1]], "orange"] // L
];

let p; 
let nextP; // Store next piece

function startTetris() {
    if(tGame) return;
    tGame = true; 
    
    if (tScore === 0 && board.length === 0) {
        resetTetrisVariables();
    }

    document.getElementById('tetris-start-btn').disabled = true;
    tInterval = setInterval(drop, 1000);
}

function resetTetrisVariables() {
    tScore = 0; 
    updateScoreDisplay();
    
    // Initialize empty board
    board = [];
    for(let r=0; r<ROW; r++) { 
        board[r] = []; 
        for(let c=0; c<COL; c++) board[r][c] = "black"; 
    }
    
    nextP = randomPiece(); // Generate first 'next' piece
    p = randomPiece(); // Generate current piece (swaps with next)
    
    drawBoard();
    drawNextPiece();
}

function resetTetrisGame() {
    stopTetris();
    resetTetrisVariables();
    // Clear canvas visually immediately
    tCtx.clearRect(0, 0, tCanvas.width, tCanvas.height);
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    nextCtx.fillStyle = "black";
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
}

function stopTetris() { 
    tGame = false; 
    clearInterval(tInterval); 
    document.getElementById('tetris-start-btn').disabled = false; 
}

function updateScoreDisplay() {
    // Format score as 6 digits (e.g. 000421)
    const scoreStr = tScore.toString().padStart(6, '0');
    document.getElementById('tetris-score').innerText = scoreStr;
}

function drawSquare(ctx, x, y, color, size = SQ) {
    ctx.fillStyle = color; 
    ctx.fillRect(x*size, y*size, size, size);
    ctx.strokeStyle = "#333"; 
    ctx.strokeRect(x*size, y*size, size, size);
}

function drawBoard() {
    for(let r=0; r<ROW; r++) {
        for(let c=0; c<COL; c++) {
            drawSquare(tCtx, c, r, board[r][c]);
        }
    }
}

function drawPiece() {
    for(let r=0; r<p.activeTetromino.length; r++) {
        for(let c=0; c<p.activeTetromino[r].length; c++) {
            if(p.activeTetromino[r][c]) {
                drawSquare(tCtx, p.x + c, p.y + r, p.color);
            }
        }
    }
}

function undrawPiece() {
    for(let r=0; r<p.activeTetromino.length; r++) {
        for(let c=0; c<p.activeTetromino[r].length; c++) {
            if(p.activeTetromino[r][c]) {
                drawSquare(tCtx, p.x + c, p.y + r, "black");
            }
        }
    }
}

function drawNextPiece() {
    // Clear preview box
    nextCtx.fillStyle = "black";
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (!nextP) return;

    // Center piece in 80x80 box
    // Box is approx 4x4 blocks of 20px? Or custom size.
    // Let's use slightly smaller blocks for preview to fit: 18px
    const previewSize = 18;
    const piece = nextP.activeTetromino;
    
    // Calculate offset to center
    const offsetX = (nextCanvas.width - (piece[0].length * previewSize)) / 2;
    const offsetY = (nextCanvas.height - (piece.length * previewSize)) / 2;

    for(let r=0; r<piece.length; r++) {
        for(let c=0; c<piece[r].length; c++) {
            if(piece[r][c]) {
                nextCtx.fillStyle = nextP.color;
                nextCtx.fillRect(offsetX + c*previewSize, offsetY + r*previewSize, previewSize, previewSize);
                nextCtx.strokeStyle = "#333";
                nextCtx.strokeRect(offsetX + c*previewSize, offsetY + r*previewSize, previewSize, previewSize);
            }
        }
    }
}

function randomPiece() {
    // If nextP exists, use it and generate new nextP
    if (nextP) {
        let current = nextP;
        let r = Math.floor(Math.random() * SHAPES.length);
        nextP = { 
            activeTetromino: SHAPES[r][0], 
            color: SHAPES[r][1], 
            x: 3, 
            y: -2 
        };
        current.x = 3;
        current.y = -2;
        drawNextPiece();
        return current;
    }

    // Initial case
    let r = Math.floor(Math.random() * SHAPES.length);
    return { 
        activeTetromino: SHAPES[r][0], 
        color: SHAPES[r][1], 
        x: 3, 
        y: -2 
    };
}

function moveDown() { 
    if(!tGame) return; 
    if(!collision(0, 1, p.activeTetromino)) { 
        undrawPiece(); 
        p.y++; 
        drawPiece(); 
    } else { 
        lock(); 
        p = randomPiece(); // This will now pull from nextP
    } 
}

function moveRight() { 
    if(!tGame) return; 
    if(!collision(1, 0, p.activeTetromino)) { 
        undrawPiece(); 
        p.x++; 
        drawPiece(); 
    } 
}

function moveLeft() { 
    if(!tGame) return; 
    if(!collision(-1, 0, p.activeTetromino)) { 
        undrawPiece(); 
        p.x--; 
        drawPiece(); 
    } 
}

function rotate() {
    if(!tGame) return;
    let nextPattern = p.activeTetromino[0].map((val, index) => 
        p.activeTetromino.map(row => row[index]).reverse()
    );
    if(!collision(0, 0, nextPattern)) { 
        undrawPiece(); 
        p.activeTetromino = nextPattern; 
        drawPiece(); 
    }
}

function collision(x, y, piece) {
    for(let r=0; r<piece.length; r++) {
        for(let c=0; c<piece[r].length; c++) {
            if(!piece[r][c]) continue;
            let newX = p.x + c + x;
            let newY = p.y + r + y;
            if(newX < 0 || newX >= COL || newY >= ROW) return true;
            if(newY < 0) continue;
            if(board[newY][newX] != "black") return true;
        }
    }
    return false;
}

function lock() {
    for(let r=0; r<p.activeTetromino.length; r++) {
        for(let c=0; c<p.activeTetromino[r].length; c++) {
            if(!p.activeTetromino[r][c]) continue;
            if(p.y + r < 0) { 
                alert("Game Over! Final Score: " + tScore); 
                stopTetris(); 
                return; 
            }
            board[p.y+r][p.x+c] = p.color;
        }
    }
    // Remove full rows
    for(let r=0; r<ROW; r++) {
        let isFull = true;
        for(let c=0; c<COL; c++) {
            isFull = isFull && (board[r][c] != "black");
        }
        if(isFull) {
            for(let y=r; y>1; y--) {
                for(let c=0; c<COL; c++) {
                    board[y][c] = board[y-1][c];
                }
            }
            for(let c=0; c<COL; c++) {
                board[0][c] = "black";
            }
            tScore += 100; // More points for line clear
            updateScoreDisplay();
        }
    }
    drawBoard();
}

function drop() { moveDown(); }

document.addEventListener('keydown', e => {
    // Only check keys if Tetris tab is active
    if (!tGame || !document.getElementById('tetris-view').classList.contains('active')) return;
    
    if(e.keyCode == 37) moveLeft();
    else if(e.keyCode == 38) rotate();
    else if(e.keyCode == 39) moveRight();
    else if(e.keyCode == 40) moveDown();
});
