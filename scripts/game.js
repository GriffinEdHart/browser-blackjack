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
let gameInProgress = false;

// Retrieve player's name from local storage
playerName = localStorage.getItem('playerName'); // Use the correct key name 'playerName'

let playerNameDisplay = document.getElementById('playerNameDisplay');

if (playerName) {
    playerNameDisplay.textContent = playerName;
} else {
    playerNameDisplay.textContent = 'Player';
}

// Call the startGame function to initiate the game when the page loads
startGame();

// Function to start or restart the game
function startGame() {
    deck = createDeck();
    shuffle(deck);

    if (playerFunds === 0) {
        alert('You lose! Restarting the game...');
        window.location.reload(); // Refresh the page after the alert is closed
        return; // Prevent the game from starting
    }

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

    // Disable Hit and Stand buttons
    const hitButton = document.getElementById('hitBtn');
    hitButton.disabled = true;
    hitButton.classList.add('disabled-button');

    const standButton = document.getElementById('standBtn');
    standButton.disabled = true;
    standButton.classList.add('disabled-button');

    // Enable betting and lock-in buttons
    const betButtons = document.querySelectorAll('.bet-button');
    betButtons.forEach(button => {
        button.disabled = false;
        button.classList.remove('disabled-button'); // Remove disabled class if previously added
    });

    const lockInButton = document.getElementById('lockInBtn');
    lockInButton.disabled = false;
    lockInButton.classList.remove('disabled-button'); // Remove disabled class if previously added

    // Update game status
    gameInProgress = false;
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

    // Disable bet buttons
    const betButtons = document.querySelectorAll('.bet-button');
    betButtons.forEach(button => {
        button.disabled = true;
        button.classList.add('disabled-button');
    });

    // Disable Lock In button
    const lockInButton = document.getElementById('lockInBtn');
    lockInButton.disabled = true;
    lockInButton.classList.add('disabled-button');

    // Disable the Reset Bet button
    const resetBetButton = document.getElementById('resetBetBtn');
    resetBetButton.disabled = true;
    resetBetButton.classList.add('disabled-button');    

    // Enable the Stand and Hit buttons
    const standButton = document.getElementById('standBtn');
    standButton.disabled = false;
    standButton.classList.remove('disabled-button');

    const hitButton = document.getElementById('hitBtn');
    hitButton.disabled = false;
    hitButton.classList.remove('disabled-button');

    // Deal initial cards to the player and dealer
    playerCards.push(dealCard(), dealCard());
    dealerCards.push(dealCard());

    // Calculate initial scores after dealing the cards
    playerScore = calculateScore(playerCards);
    dealerScore = calculateScore([dealerCards[0]]); // Only calculate the score for the first card

    updateGameDisplay();
}

function resetBet() {
    playerFunds += betAmount; // Refund the bet amount to player's funds
    betAmount = 0;

    // Update bet and funds display
    document.getElementById('betAmount').textContent = '$' + betAmount;
    document.getElementById('playerFunds').textContent = '$' + playerFunds;
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
        if (playerScore === 21) {
            action = 'stand'; // Force the player to stand if they reach 21
        } else if (playerScore > 21) {
            playerBusted = true;
            determineWinners();
        }
    }

    if (action === 'stand') {
        if (betAmount === 0) {
            alert('Please place a bet first.');
            return;
        }

        // Deal cards to the dealer and update the display
        while (dealerScore < 17) {
            dealerCards.push(dealCard());
            dealerScore = calculateScore(dealerCards);
            updateGameDisplay(); // Display dealer's cards as they draw
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
    const dealerCardsDisplay = document.getElementById('dealerCards');
    dealerCardsDisplay.innerHTML = '';
    if (dealerCards.length > 0) {
        // Show all dealer cards
        const dealerCardsToShow = dealerCards.map((card, index) => {
            if (index === 0) {
                return `<div class="card">${card.value}${card.suit}</div>`;
            } else {
                return `<div class="card">${card.value}${card.suit}</div>`;
            }
        }).join('');
        dealerCardsDisplay.innerHTML = dealerCardsToShow;
    }

    // Update scores
    document.getElementById('playerScore').textContent = `Player Score: ${playerScore}`;
    document.getElementById('dealerScore').textContent = `Dealer Score: ${dealerScore}`;
}




// Function to handle dealer's turn
function dealerTurn() {
    if (betAmount === 0) {
        alert('Please place a bet first.');
        return;
    }
    
    function drawDealerCard() {
        dealerCards.push(dealCard());
        dealerScore = calculateScore(dealerCards); // Update dealer score
        updateGameDisplay(); // Update the game display with each draw
        
        if (dealerScore < 17) {
            setTimeout(drawDealerCard, 500); // Add a slight delay between each card draw
        } else {
            determineWinners();
        }
    }
    drawDealerCard();
}

function withdrawFunds() {
    startGame(); // Restart the game when the button is pressed (instead of waiting for the 5 second timer.)
}

// Function to determine winners and display results
function determineWinners() {
    document.getElementById('resultArea').style.display = 'block';
    let result = '';

    if (playerScore === 21 && playerCards.length === 2) {
        result = 'Blackjack! Player wins!'
        playerFunds += (betAmount * 1.5) + betAmount; // 1.5 times the bet as winnings, then returning the original amount bet.
    } else if (playerScore > 21) {
        result = 'Player busts. Dealer wins.';
        if (playerFunds === 0) {
            result += ' You have no more funds.';
            setTimeout(startGame, 1000); // Restart the game after 1 second if player has no funds
        }
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
    // Update the result display
    document.getElementById('gameResult').textContent = result;
    document.getElementById('playerFunds').textContent = '$' + playerFunds;

    // Restart the game
    // setTimeout(startGame, 5000); // Restart the game after 5 seconds
}