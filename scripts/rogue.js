// Mini-Rogue Game Logic (Enhanced Version)
// A lightweight ASCII roguelike for the blog terminal

const RogueGame = {
    isActive: false,
    state: 'start', // 'start', 'playing', 'won', 'lost'
    width: 60,
    height: 20,
    map: [],
    depth: 1, // Current floor level
    maxDepth: 5, // Amulet is on this floor
    
    player: { x: 1, y: 1, hp: 20, maxHp: 20, gold: 0, xp: 0, level: 1, damage: 2 },
    entities: [],
    messages: [],
    
    // Symbols
    SYMBOLS: {
        PLAYER: '@',
        WALL: '#',
        FLOOR: '.',
        GOLD: '$',
        POTION: '+',
        AMULET: '♀',
        STAIRS: '>',
        GOBLIN: 'g',
        DRAGON: 'D'
    },

    init: function(terminalCallback) {
        this.print = terminalCallback;
        this.isActive = true;
        this.state = 'start';
        
        // Reset Player Stats
        this.player = { x: 1, y: 1, hp: 20, maxHp: 20, gold: 0, xp: 0, level: 1, damage: 2 };
        this.depth = 1;
        
        this.showTitleScreen();
    },

    showTitleScreen: function() {
        const title = `
        === MINI ROGUE ===
        
        [ OBJECTIVES ]
        Explore the dungeon, fight monsters, and descend to floor ${this.maxDepth}.
        Find the Amulet of Yendor (♀) to win!
        
        [ SYMBOLS ]
        @ : You (The Hero)
        # : Wall
        . : Floor
        > : Stairs (Go down)
        $ : Gold (Score)
        + : Potion (Heal HP)
        g : Goblin (Weak)
        D : Dragon (Strong)
        ♀ : Amulet (Goal)
        
        [ CONTROLS ]
        Arrows : Move / Attack
        Space  : Rest (Heal 1 HP)
        ESC    : Quit Game
        
        > Press [ENTER] to start your adventure...
        `;
        this.print(title, true);
    },

    startLevel: function() {
        this.state = 'playing';
        this.messages = [`Entered depth ${this.depth}...`];
        this.generateMap();
        this.spawnEntities();
        this.render();
    },

    generateMap: function() {
        this.map = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                if (y === 0 || y === this.height - 1 || x === 0 || x === this.width - 1) {
                    row.push(this.SYMBOLS.WALL);
                } else {
                    row.push(Math.random() > 0.1 ? this.SYMBOLS.FLOOR : this.SYMBOLS.WALL);
                }
            }
            this.map.push(row);
        }
        
        // Ensure player start is clear
        this.map[1][1] = this.SYMBOLS.FLOOR;
        this.player.x = 1; 
        this.player.y = 1;
    },

    spawnEntities: function() {
        this.entities = [];
        
        // Spawn Items & Monsters based on depth
        const monsterCount = 3 + this.depth;
        const goldCount = 10;
        
        for (let i = 0; i < goldCount; i++) this.spawn(this.SYMBOLS.GOLD);
        for (let i = 0; i < 2; i++) this.spawn(this.SYMBOLS.POTION);
        
        // Monsters
        for (let i = 0; i < monsterCount; i++) {
            // Deeper levels have more dragons
            if (Math.random() < (this.depth * 0.1)) {
                this.spawn(this.SYMBOLS.DRAGON, { hp: 15, damage: 4, name: 'Dragon', xp: 50 });
            } else {
                this.spawn(this.SYMBOLS.GOBLIN, { hp: 5, damage: 1, name: 'Goblin', xp: 10 });
            }
        }

        // Goal: Stairs or Amulet
        if (this.depth === this.maxDepth) {
            this.spawn(this.SYMBOLS.AMULET);
        } else {
            this.spawn(this.SYMBOLS.STAIRS);
        }
    },

    spawn: function(symbol, stats = {}) {
        let placed = false;
        while (!placed) {
            let x = Math.floor(Math.random() * (this.width - 2)) + 1;
            let y = Math.floor(Math.random() * (this.height - 2)) + 1;
            if (this.map[y][x] === this.SYMBOLS.FLOOR && !this.getEntityAt(x, y) && (x !== this.player.x || y !== this.player.y)) {
                this.entities.push({ x, y, symbol, ...stats });
                placed = true;
            }
        }
    },

    getEntityAt: function(x, y) {
        return this.entities.find(e => e.x === x && e.y === y);
    },

    handleInput: function(key) {
        if (!this.isActive) return;

        if (this.state === 'start') {
            if (key === 'Enter') this.startLevel();
            return;
        }

        if (this.state === 'won' || this.state === 'lost') {
            if (key === 'Enter') { // Reset on Enter
                this.isActive = false; // Exit game mode
                this.print("Type 'rogue play' to play again.", false);
            }
            return;
        }

        let dx = 0, dy = 0;
        if (key === 'ArrowUp') dy = -1;
        if (key === 'ArrowDown') dy = 1;
        if (key === 'ArrowLeft') dx = -1;
        if (key === 'ArrowRight') dx = 1;
        if (key === ' ') { // Rest
            if (this.player.hp < this.player.maxHp) {
                this.player.hp = Math.min(this.player.hp + 1, this.player.maxHp);
                this.log("You rest and recover 1 HP.");
            } else {
                this.log("HP is full.");
            }
            this.gameLoop();
            return;
        }

        if (dx !== 0 || dy !== 0) {
            this.move(dx, dy);
            this.gameLoop();
        }
    },

    move: function(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        // Check Wall
        if (this.map[newY][newX] === this.SYMBOLS.WALL) return;

        // Check Entity
        const target = this.getEntityAt(newX, newY);
        if (target) {
            if (target.symbol === this.SYMBOLS.GOBLIN || target.symbol === this.SYMBOLS.DRAGON) {
                this.attack(target);
            } else if (target.symbol === this.SYMBOLS.GOLD) {
                this.player.gold += 10;
                this.log("Picked up gold.");
                this.removeEntity(target);
                this.player.x = newX;
                this.player.y = newY;
            } else if (target.symbol === this.SYMBOLS.POTION) {
                this.player.hp = Math.min(this.player.hp + 10, this.player.maxHp);
                this.log("Drank potion. HP restored.");
                this.removeEntity(target);
                this.player.x = newX;
                this.player.y = newY;
            } else if (target.symbol === this.SYMBOLS.STAIRS) {
                this.descend();
            } else if (target.symbol === this.SYMBOLS.AMULET) {
                this.winGame();
            }
        } else {
            this.player.x = newX;
            this.player.y = newY;
        }
    },

    descend: function() {
        this.depth++;
        this.log(`Descending to depth ${this.depth}...`);
        this.generateMap();
        this.spawnEntities();
    },

    attack: function(target) {
        const dmg = this.player.damage + Math.floor(Math.random() * 2);
        target.hp -= dmg;
        this.log(`Hit ${target.name} for ${dmg} dmg.`);
        if (target.hp <= 0) {
            this.log(`${target.name} died! (+${target.xp} XP)`);
            this.player.xp += target.xp;
            this.checkLevelUp();
            this.removeEntity(target);
        }
    },

    checkLevelUp: function() {
        const nextLevelXp = this.player.level * 50;
        if (this.player.xp >= nextLevelXp) {
            this.player.level++;
            this.player.maxHp += 5;
            this.player.hp = this.player.maxHp;
            this.player.damage += 1;
            this.log(`Level Up! You are now level ${this.player.level}.`);
        }
    },

    monsterTurn: function() {
        this.entities.forEach(e => {
            if ((e.symbol === this.SYMBOLS.GOBLIN || e.symbol === this.SYMBOLS.DRAGON) && e.hp > 0) {
                // 1. Attack if next to player
                if (Math.abs(e.x - this.player.x) <= 1 && Math.abs(e.y - this.player.y) <= 1) {
                    const dmg = e.damage;
                    this.player.hp -= dmg;
                    this.log(`${e.name} hits you for ${dmg} dmg!`);
                    return; // Attacked, so don't move
                }

                // 2. Move Logic
                let moveX = 0;
                let moveY = 0;

                // Dragon chases player if close
                if (e.symbol === this.SYMBOLS.DRAGON && Math.abs(e.x - this.player.x) < 6 && Math.abs(e.y - this.player.y) < 6) {
                    if (e.x < this.player.x) moveX = 1;
                    else if (e.x > this.player.x) moveX = -1;
                    
                    if (e.y < this.player.y) moveY = 1;
                    else if (e.y > this.player.y) moveY = -1;
                } else {
                    // Random movement (Patrol)
                    if (Math.random() < 0.5) { // 50% chance to move
                        const dir = Math.floor(Math.random() * 4);
                        if (dir === 0) moveY = -1;
                        else if (dir === 1) moveY = 1;
                        else if (dir === 2) moveX = -1;
                        else if (dir === 3) moveX = 1;
                    }
                }

                // Try to move
                if (moveX !== 0 || moveY !== 0) {
                    const nextX = e.x + moveX;
                    const nextY = e.y + moveY;

                    // Valid move check (Not wall, not another entity, not player)
                    if (this.map[nextY][nextX] !== this.SYMBOLS.WALL && 
                        !this.getEntityAt(nextX, nextY) &&
                        (nextX !== this.player.x || nextY !== this.player.y)) {
                        e.x = nextX;
                        e.y = nextY;
                    }
                }
            }
        });
    },

    gameLoop: function() {
        this.monsterTurn();
        if (this.player.hp <= 0) {
            this.loseGame();
        } else {
            this.render();
        }
    },

    removeEntity: function(entity) {
        this.entities = this.entities.filter(e => e !== entity);
    },

    log: function(msg) {
        this.messages.unshift(msg);
        if (this.messages.length > 3) this.messages.pop();
    },

    render: function() {
        let output = "";
        
        // Status Bar
        output += `D:${this.depth}/${this.maxDepth}  LV:${this.player.level}  HP:${this.player.hp}/${this.player.maxHp}  Gold:${this.player.gold}\n`;
        output += "-".repeat(this.width) + "\n";

        // Map
        for (let y = 0; y < this.height; y++) {
            let line = "";
            for (let x = 0; x < this.width; x++) {
                if (x === this.player.x && y === this.player.y) {
                    line += `<span style="color: lime;">${this.SYMBOLS.PLAYER}</span>`;
                } else {
                    const entity = this.getEntityAt(x, y);
                    if (entity) {
                        let color = 'white';
                        if (entity.symbol === this.SYMBOLS.GOLD) color = 'yellow';
                        if (entity.symbol === this.SYMBOLS.POTION) color = 'cyan';
                        if (entity.symbol === this.SYMBOLS.GOBLIN) color = 'red';
                        if (entity.symbol === this.SYMBOLS.DRAGON) color = 'magenta';
                        if (entity.symbol === this.SYMBOLS.AMULET) color = 'purple';
                        if (entity.symbol === this.SYMBOLS.STAIRS) color = 'white';
                        line += `<span style="color: ${color};">${entity.symbol}</span>`;
                    } else {
                        line += this.map[y][x] === this.SYMBOLS.WALL ? '<span style="color: gray;">#</span>' : '.';
                    }
                }
            }
            output += line + "\n";
        }

        output += "-".repeat(this.width) + "\n";
        
        // Messages
        this.messages.forEach(m => output += `> ${m}\n`);
        
        this.print(output, true);
    },

    winGame: function() {
        this.state = 'won';
        this.print(`
        ***********************************
        *        CONGRATULATIONS!         *
        ***********************************
        
        You found the Amulet of Yendor on floor ${this.depth}!
        You escaped the dungeon safely.
        
        [ Final Stats ]
        Level: ${this.player.level}
        Gold : ${this.player.gold}
        XP   : ${this.player.xp}
        
        > Press [ENTER] to exit to terminal.
        `, true);
    },

    loseGame: function() {
        this.state = 'lost';
        this.print(`
        ===================================
        =           GAME OVER             =
        ===================================
        
        You have died on floor ${this.depth}...
        
        [ Final Stats ]
        Level: ${this.player.level}
        Gold : ${this.player.gold}
        
        > Press [ENTER] to exit to terminal.
        `, true);
    }
};
