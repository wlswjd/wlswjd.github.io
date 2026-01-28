// Blackjack Game Logic
// A simple ASCII blackjack game for the terminal

const BlackjackGame = {
    isActive: false,
    state: 'start', // 'start', 'betting', 'playerTurn', 'dealerTurn', 'end'
    deck: [],
    playerHand: [],
    dealerHand: [],
    message: '',
    print: null,

    init: function(terminalCallback) {
        this.print = terminalCallback;
        this.isActive = true;
        this.startGame();
    },

    createDeck: function() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ suit, value });
            }
        }
        // Shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },

    getCardValue: function(hand) {
        let value = 0;
        let aces = 0;
        for (let card of hand) {
            if (['J', 'Q', 'K'].includes(card.value)) {
                value += 10;
            } else if (card.value === 'A') {
                aces += 1;
                value += 11;
            } else {
                value += parseInt(card.value);
            }
        }
        while (value > 21 && aces > 0) {
            value -= 10;
            aces -= 1;
        }
        return value;
    },

    startGame: function() {
        this.createDeck();
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        this.state = 'playerTurn';
        this.message = "Hit (h) or Stand (s)?";
        this.checkBlackjack();
        this.render();
    },

    checkBlackjack: function() {
        const pVal = this.getCardValue(this.playerHand);
        const dVal = this.getCardValue(this.dealerHand);
        
        if (pVal === 21) {
            if (dVal === 21) {
                this.endGame("Push! Both have Blackjack.");
            } else {
                this.endGame("Blackjack! You win!");
            }
        }
    },

    handleInput: function(key) {
        if (!this.isActive) return;

        const k = key.toLowerCase();

        if (this.state === 'end') {
            if (k === 'y') {
                this.startGame();
            } else if (k === 'n' || k === 'escape') {
                this.isActive = false;
                this.print("Exited Blackjack. Type 'blackjack' to play again.", false, false);
            }
            return;
        }

        if (this.state === 'playerTurn') {
            if (k === 'h') {
                this.playerHand.push(this.deck.pop());
                const val = this.getCardValue(this.playerHand);
                if (val > 21) {
                    this.endGame("Bust! You went over 21.");
                } else if (val === 21) {
                    this.stand();
                } else {
                    this.render();
                }
            } else if (k === 's') {
                this.stand();
            }
        }
    },

    stand: function() {
        this.state = 'dealerTurn';
        this.render();
        
        // Dealer logic with slight delay for dramatic effect
        setTimeout(() => {
            while (this.getCardValue(this.dealerHand) < 17) {
                this.dealerHand.push(this.deck.pop());
            }
            this.determineWinner();
        }, 500);
    },

    determineWinner: function() {
        const pVal = this.getCardValue(this.playerHand);
        const dVal = this.getCardValue(this.dealerHand);

        if (dVal > 21) {
            this.endGame("Dealer Busts! You win!");
        } else if (pVal > dVal) {
            this.endGame("You win!");
        } else if (pVal < dVal) {
            this.endGame("Dealer wins.");
        } else {
            this.endGame("Push (Draw).");
        }
    },

    endGame: function(msg) {
        this.state = 'end';
        this.message = `${msg} Play again? (y/n)`;
        this.render();
    },

    renderCard: function(card, hidden = false) {
        if (hidden) {
            return `[ ?? ]`;
        }
        return `[ ${card.value}${card.suit} ]`;
    },

    render: function() {
        let output = `\n=== BLACKJACK TABLE ===\n\n`;

        // Dealer
        output += `Dealer's Hand:\n`;
        const dealerCards = this.dealerHand.map((c, i) => 
            (this.state === 'playerTurn' && i === 0) ? this.renderCard(c, true) : this.renderCard(c)
        ).join(' ');
        
        output += dealerCards + "\n";
        if (this.state !== 'playerTurn') {
            output += `Value: ${this.getCardValue(this.dealerHand)}\n`;
        } else {
            output += `Value: ?\n`;
        }

        output += "\n" + "-".repeat(30) + "\n\n";

        // Player
        output += `Your Hand:\n`;
        const playerCards = this.playerHand.map(c => this.renderCard(c)).join(' ');
        output += playerCards + "\n";
        output += `Value: ${this.getCardValue(this.playerHand)}\n`;

        output += `\n> ${this.message}`;

        this.print(output, true, true); // true for HTML, true for clear screen
    }
};
