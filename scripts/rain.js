// Typing Defense (Rain) Game Logic
// Tech stack words falling from the sky

const RainGame = {
    isActive: false,
    state: 'start', // 'start', 'playing', 'gameover'
    width: 60,
    height: 20,
    words: [],
    score: 0,
    lives: 3,
    spawnRate: 2000, // ms
    lastSpawn: 0,
    lastUpdate: 0,
    currentInput: '',
    print: null,
    animationId: null,

    // Word list based on user's tech stack
    wordList: [
        'Python', 'TensorFlow', 'PyTorch', 'RecSys', 'Word2Vec', 
        'Item2Vec', 'WideDeep', 'SQL', 'NoSQL', 'Git', 'Docker', 
        'Linux', 'AWS', 'GCP', 'Pandas', 'Numpy', 'Scikit', 
        'Keras', 'HuggingFace', 'Transformer', 'BERT', 'GPT',
        'Data', 'Analysis', 'Pipeline', 'Airflow', 'Spark'
    ],

    init: function(terminalCallback) {
        this.print = terminalCallback;
        this.isActive = true;
        this.state = 'playing';
        this.words = [];
        this.score = 0;
        this.lives = 3;
        this.currentInput = '';
        this.spawnRate = 2000;
        this.lastSpawn = Date.now();
        this.lastUpdate = Date.now();
        
        this.loop();
    },

    spawnWord: function() {
        const text = this.wordList[Math.floor(Math.random() * this.wordList.length)];
        const x = Math.floor(Math.random() * (this.width - text.length - 2)) + 1;
        this.words.push({
            text: text,
            x: x,
            y: 0,
            color: 'lime'
        });
    },

    handleInput: function(key) {
        if (!this.isActive) return;

        if (this.state === 'gameover') {
            if (key === 'Enter') {
                this.isActive = false;
                cancelAnimationFrame(this.animationId);
                this.print("Exited Typing Defense.", false, false);
            }
            return;
        }

        if (key === 'Escape') {
            this.isActive = false;
            cancelAnimationFrame(this.animationId);
            this.print("Game Aborted.", false, false);
            return;
        }

        if (key === 'Backspace') {
            this.currentInput = this.currentInput.slice(0, -1);
        } else if (key.length === 1) {
            this.currentInput += key;
        } else if (key === 'Enter') {
            this.currentInput = ''; // Clear on enter if desired, but auto-match is better
        }

        this.checkMatch();
    },

    checkMatch: function() {
        // Find matching word
        const matchIndex = this.words.findIndex(w => w.text.toLowerCase() === this.currentInput.toLowerCase());
        
        if (matchIndex !== -1) {
            // Success
            this.words.splice(matchIndex, 1);
            this.score += 10;
            this.currentInput = '';
            // Increase difficulty slightly
            if (this.score % 50 === 0) this.spawnRate = Math.max(500, this.spawnRate - 100);
        }
    },

    update: function() {
        const now = Date.now();
        
        // Spawn
        if (now - this.lastSpawn > this.spawnRate) {
            this.spawnWord();
            this.lastSpawn = now;
        }

        // Move (every 100ms or so to make it readable)
        if (now - this.lastUpdate > 150) {
            this.words.forEach(w => w.y += 0.5); // Slow fall (0.5 lines per tick)
            
            // Check boundary
            for (let i = this.words.length - 1; i >= 0; i--) {
                if (this.words[i].y >= this.height) {
                    this.words.splice(i, 1);
                    this.lives--;
                    if (this.lives <= 0) this.state = 'gameover';
                }
            }
            this.lastUpdate = now;
        }
    },

    loop: function() {
        if (!this.isActive) return;

        if (this.state === 'playing') {
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(() => this.loop());
        } else if (this.state === 'gameover') {
            this.renderGameOver();
        }
    },

    render: function() {
        let output = `=== TYPING DEFENSE ===\n`;
        output += `Score: ${this.score}  |  Lives: ${'♥'.repeat(this.lives)}\n`;
        output += `Input: <span style="color: yellow; text-decoration: underline;">${this.currentInput}</span>\n`;
        output += "-".repeat(this.width) + "\n";

        // Create empty grid
        const grid = Array(this.height).fill().map(() => Array(this.width).fill(' '));

        // Place words
        this.words.forEach(w => {
            const y = Math.floor(w.y);
            if (y >= 0 && y < this.height) {
                for (let i = 0; i < w.text.length; i++) {
                    if (w.x + i < this.width) {
                        grid[y][w.x + i] = w.text[i];
                    }
                }
            }
        });

        // Convert grid to string
        grid.forEach(row => {
            output += row.join('') + "\n";
        });

        this.print(output, true, true);
    },

    renderGameOver: function() {
        const msg = `
        GAME OVER
        
        Final Score: ${this.score}
        
        [ Tech Stack Defended ]
        
        > Press [ENTER] to exit.
        `;
        this.print(msg, true, true);
    }
};
