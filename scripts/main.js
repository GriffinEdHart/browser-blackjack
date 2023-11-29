function startGame() {
    const playerName = document.getElementById('playerName').value;
    localStorage.setItem('playerName', playerName);
    window.location.href = 'pages/game.html';
}
