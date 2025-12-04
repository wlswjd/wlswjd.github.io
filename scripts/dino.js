// Dino Game Logic
const dinoCanvas = document.getElementById('dino-canvas');
const dinoCtx = dinoCanvas.getContext('2d');
let dinoRun = false, dinoScore = 0, dinoAnim;
let dinoObj = { x: 50, y: 250, w: 30, h: 30, dy: 0, jump: 12, g: 0.6, ground: true };
let obstacles = [];
let dinoFrame = 0;

// Adjusted Ground Level for larger canvas
const GROUND_Y = 280; 

function startDinoGame() {
    if (dinoRun) return;
    dinoRun = true; 
    
    // Reset if starting fresh (or could be resume, but simplistic here)
    if (dinoScore === 0 && obstacles.length === 0) {
        resetDinoGameVariables();
    }
    
    document.getElementById('dino-start-btn').disabled = true;
    updateDino();
}

function resetDinoGameVariables() {
    dinoScore = 0; 
    obstacles = []; 
    dinoObj.y = GROUND_Y - dinoObj.h; 
    dinoObj.dy = 0;
    dinoFrame = 0;
    document.getElementById('dino-score').innerText = 0;
}

function resetDinoGame() {
    stopDino();
    resetDinoGameVariables();
    // Clear canvas
    dinoCtx.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);
}

function stopDino() { 
    dinoRun = false; 
    cancelAnimationFrame(dinoAnim); 
    document.getElementById('dino-start-btn').disabled = false; 
}

function updateDino() {
    if (!dinoRun) return;
    dinoCtx.clearRect(0, 0, dinoCanvas.width, dinoCanvas.height);
    
    // Physics
    if (!dinoObj.ground) { 
        dinoObj.dy += dinoObj.g; 
        dinoObj.y += dinoObj.dy; 
    }
    
    // Check Ground Collision
    if (dinoObj.y >= GROUND_Y - dinoObj.h) { 
        dinoObj.y = GROUND_Y - dinoObj.h; 
        dinoObj.dy = 0; 
        dinoObj.ground = true; 
    }
    
    // Draw Ground
    dinoCtx.beginPath(); 
    dinoCtx.moveTo(0, GROUND_Y); 
    dinoCtx.lineTo(dinoCanvas.width, GROUND_Y); 
    dinoCtx.stroke();
    
    // Draw Dino
    dinoCtx.fillStyle = '#000080'; 
    dinoCtx.fillRect(dinoObj.x, dinoObj.y, dinoObj.w, dinoObj.h);

    // Obstacles
    dinoFrame++;
    if (dinoFrame % 100 === 0) {
        obstacles.push({ x: dinoCanvas.width, y: GROUND_Y - 20, w: 20, h: 20 });
    }
    
    obstacles.forEach((obs, i) => {
        obs.x -= 5;
        dinoCtx.fillStyle = '#800000'; 
        dinoCtx.fillRect(obs.x, obs.y, obs.w, obs.h);
        
        // Collision
        if (dinoObj.x < obs.x + obs.w && 
            dinoObj.x + dinoObj.w > obs.x && 
            dinoObj.y < obs.y + obs.h && 
            dinoObj.y + dinoObj.h > obs.y) {
            stopDino();
            alert("Game Over! Score: " + dinoScore);
        }
        
        // Remove off-screen
        if (obs.x + obs.w < 0) { 
            obstacles.splice(i, 1); 
            dinoScore += 10; 
            document.getElementById('dino-score').innerText = dinoScore; 
        }
    });
    
    dinoAnim = requestAnimationFrame(updateDino);
}

document.addEventListener('keydown', e => { 
    // Only jump if Space is pressed AND Dino tab is active
    if (e.code === 'Space' && document.getElementById('game-view').classList.contains('active')) { 
        e.preventDefault(); 
        if (dinoObj.ground) { 
            dinoObj.dy = -dinoObj.jump; 
            dinoObj.ground = false; 
        } 
    } 
});
