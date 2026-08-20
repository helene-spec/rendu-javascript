$(document).ready(function () {
    const connect4 = new Connect4('#connect4', {
        x: 7,
        y: 6,
        player1Color: 'red',
        player2Color: 'yellow'
    });


    $('#restart').click(function () {
        console.log('Restart clicked');
        connect4.restart();
    });

    $('#undo').click(function () {
        console.log('Undo clicked');
        connect4.undoLastMove();
    });

    console.log('Jeu Connect4 initialisé avec succès !');
});