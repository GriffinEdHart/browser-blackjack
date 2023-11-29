// Define variables
let playerName;
let playerFunds = 20;
let deck = [];
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;
let betAmount = 0;
let playerBusted = false;

// Retrieve player's name from local storage
playerName = localStorage.getItem(playerName);
let playerNameDisplay = document.getElementById('playerNameDisplay');

if (playerName) {
    playerNameDisplay.textContent = playerName;
} else {
    // Handle the case where playerName is not found in localStorage
    playerNameDisplay.textContent = 'Player';
}

// Call the startGame function to initiate the game when the page loads
startGame();

// Function to start or restart the game
function startGame() {
    deck = createDeck();
    shuffle(deck);

    betAmount = 0;
    playerCards = [];
    dealerCards = [];
    playerScore = 0;
    dealerScore = 0;
    playerBusted = false;

    // Reset card displays and UI
    document.getElementById('playerCards').innerHTML = '';
    document.getElementById('dealerCards').innerHTML = '';
    document.getElementById('betAmount').textContent = '$' + betAmount;

    updateGameDisplay();
    document.getElementById('gameArea').style.display = 'block';
    document.getElementById('resultArea').style.display = 'none';
}

// Function to create a deck of cards
function createDeck() {
    let deck = [];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♣', '♥', '♦'];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

// Function to shuffle the deck
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal a card
function dealCard() {
    return deck.pop();
}

// Function to place a bet
function placeBet(amount) {
    if (playerFunds >= amount) {
        betAmount += amount;
        playerFunds -= amount;

        // Update bet and funds display
        document.getElementById('betAmount').textContent = '$' + betAmount;
        document.getElementById('playerFunds').textContent = '$' + playerFunds;
    } else {
        alert('Insufficient funds!');
    }
}

// Function to lock in the bet and start the game
function lockInBet() {
    if (betAmount === 0) {
        alert('Please place a bet first.');
        return;
    }

    if (deck.length < 4) {
        // Ensure there are enough cards in the deck to deal to the player and dealer
        alert('Insufficient cards in the deck. Please restart the game.');
        return;
    }

    // Deal initial cards to the player and dealer
    playerCards.push(dealCard(), dealCard());
    dealerCards.push(dealCard());

    // Calculate initial scores after dealing the cards
    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore([dealerCards[0]]); // Only calculate the score for the first card

    updateGameDisplay();
}


// Function to handle player's turn (hit or stand)
function playerTurn(action) {
    if (playerBusted) {
        alert('You have busted! Please click Stand to continue.');
        return;
    }

    if (action === 'hit') {
        if (betAmount === 0) {
            alert('Please place a bet first.');
            return;
        }
        playerCards.push(dealCard());
        playerScore = calculateScore(playerCards); // Update player score.
        updateGameDisplay();
        if (playerScore > 21) {
            playerBusted = true;
            determineWinners();
        }
    } else if (action === 'stand') {
        if (betAmount === 0) {
            alert('Please place a bet first.');
            return;
        }

        // Deal cards to the dealer and update the display
        while (dealerScore < 17) {
            dealerCards.push(dealCard());
            dealerScore = calculateScore(dealerCards);
        }
        
        determineWinners();
        updateGameDisplay(); // Update the game display after the dealer's turn
    }
}



// Function to create a deck of cards
function createDeck() {
    let deck = [];
    const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const suits = ['♠', '♣', '♥', '♦'];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return deck;
}

// Function to shuffle the deck
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Function to deal a card
function dealCard() {
    return deck.pop();
}

// Function to calculate card value
function cardValue(card) {
    const val = card.value;
    if (val === 'A') return 11; // Ace initially counts as 11
    if (['K', 'Q', 'J'].includes(val)) return 10;
    return parseInt(val);
}

// Function to calculate total score
function calculateScore(cards) {
    let score = 0;
    let aceCount = 0;

    for (let card of cards) {
        score += cardValue(card);
        if (card.value === 'A') aceCount++;
    }

    while (score > 21 && aceCount > 0) {
        score -= 10; // Convert Ace from 11 to 1 if the total score exceeds 21
        aceCount--;
    }

    return score;
}

// Function to update the game display
function updateGameDisplay() {
    document.getElementById('playerCards').innerHTML = playerCards.map(card =>
        `<div class="card ${card.suit === '♥' || card.suit === '♦' ? 'red-card' : ''}">${card.value}${card.suit}</div>`).join('');

    // Displaying the dealer's cards
    document.getElementById('dealerCards').innerHTML = '';
    if (dealerCards.length > 0) {
        // Show the first card face up and the rest face down
        document.getElementById('dealerCards').innerHTML =
            `<div class="card">${dealerCards[0].value}${dealerCards[0].suit}</div>` +
            `<div class="card hidden">${dealerCards.slice(1).map(card => `${card.value}${card.suit}`).join('')}</div>`;
    }

    // Update scores
    document.getElementById('playerScore').textContent = `Player Score: ${playerScore}`;
    document.getElementById('dealerScore').textContent = `Dealer Score: ${playerBusted ? dealerScore : dealerCards.length === 2 ? calculateScore([dealerCards[1]]) : calculateScore(dealerCards)}`;
}




// Function to handle dealer's turn
function dealerTurn() {
    if (betAmount === 0) {
        alert('Please place a bet first.');
        return;
    }
    function drawDealerCard() {
        dealerCards.push(dealCard());
        updateGameDisplay();
        if (dealerScore < 17) {
            setTimeout(drawDealerCard, 500); // Add a slight delay between each card draw
        } else {
            determineWinners();
        }
    }
    drawDealerCard();
}



// Function to determine winners and display results
function determineWinners() {
    document.getElementById('resultArea').style.display = 'block';
    let result = '';

    if (playerScore > 21) {
        result = 'Player busts. Dealer wins.';
        if (playerFunds === 0) {
            result += ' You have no more funds.';
            setTimeout(startGame, 1000); // Restart the game after 1 second if player has no funds
        }
    } else if (playerScore === 21 && playerCards.length === 2) {
        result = 'Blackjack! Player wins!'
        playerFunds += (betAmount * 1.5) + betAmount; // 1.5 times the bet as winnings, then returning the original amount bet.
    } else if (dealerScore > 21) {
        result = 'Dealer busts. Player wins!';
        playerFunds += betAmount * 2;
    } else if (playerScore === dealerScore) {
        result = 'Push! It\'s a tie.';
        playerFunds += betAmount;
    } else if (playerScore > dealerScore) {
        result = 'Player wins!';
        playerFunds += betAmount * 2;
    } else {
        result = 'Dealer wins.';
    }

    document.getElementById('gameResult').textContent = result;
    document.getElementById('playerFunds').textContent = '$' + playerFunds;

    if (playerFunds === 0) {
        setTimeout(startGame, 5000); // Restart the game after 2 seconds if player has no funds
    } else {
        setTimeout(startGame, 5000); // Restart the game if playerFunds are NOT zero.
    }
}