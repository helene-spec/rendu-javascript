(function ($) {
    $.fn.game2048 = function () {
        return this.each(function () {
            const $game = $(this);
    const GRID_SIZE = 4;
    const TILE_SIZE = 90;
    const TILE_GAP = 10;
    let gameBoard = [];
    let score = 0;
    let bestScore = Number(localStorage.getItem('game2048-best-score')) || 0;

    
    createAllTiles();  
    initializeBoard();
    $game.find('.best-score-value').text(bestScore);

    
    function createAllTiles() {
        $game.find('#game-board').empty();
        
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const pos = getPosition(row, col);
                const key = `${row}-${col}`;
                
                const $tile = $('<div class="tile"></div>');
                $tile.attr('data-tile-key', key);
                $tile.css({
                    left: pos.x + 'px',
                    top: pos.y + 'px'
                });
                $game.find('#game-board').append($tile);
            }
        }
    }

    
    function initializeBoard() {
        gameBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
        score = 0;
        updateScoreDisplay();
        addNewTile();
        addNewTile();
        renderBoard();
    }

    
    function addNewTile() {
        const emptyTiles = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                if (gameBoard[row][col] === 0) {
                    emptyTiles.push({ row, col });
                }
            }
        }

        if (emptyTiles.length === 0) return;

        const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        const newValue = Math.random() < 0.9 ? 2 : 4;
        gameBoard[randomTile.row][randomTile.col] = newValue;
    }

    
    function getPosition(row, col) {
        const x = col * (TILE_SIZE + TILE_GAP) + TILE_GAP;
        const y = row * (TILE_SIZE + TILE_GAP) + TILE_GAP;
        return { x, y };
    }

    
    function renderBoard() {
        for (let row = 0; row < GRID_SIZE; row++) {
            for (let col = 0; col < GRID_SIZE; col++) {
                const value = gameBoard[row][col];
                const key = `${row}-${col}`;
                const $tile = $game.find(`[data-tile-key="${key}"]`);

                
                $tile.removeClass()
                    .addClass('tile');  

                if (value !== 0) {
                    
                    $tile
                        .text(value)
                        .addClass(`tile-${value}`);  
                } else {
                    
                    $tile.text('');  
                }
            }
        }
    }

    
    function updateScoreDisplay() {
        $('.score-value').text(score);
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('game2048-best-score', bestScore);
            $game.find('.best-score-value').text(bestScore);
        }
    }

    
    $game.on('keydown.game2048', function(e) {
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moveUp();
                break;
            case 'ArrowDown':
                e.preventDefault();
                moveDown();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moveLeft();
                break;
            case 'ArrowRight':
                e.preventDefault();
                moveRight();
                break;
        }
    });

    
    function moveLeft() {
        let moved = false;
        for (let row = 0; row < GRID_SIZE; row++) {
            const result = slide(gameBoard[row]);
            if (result.changed) moved = true;
            gameBoard[row] = result.array;
        }
        if (moved) {
            addNewTile();
            renderBoard();
        }
    }

    function moveRight() {
        let moved = false;
        for (let row = 0; row < GRID_SIZE; row++) {
            gameBoard[row] = gameBoard[row].reverse();
            const result = slide(gameBoard[row]);
            if (result.changed) moved = true;
            gameBoard[row] = result.array.reverse();
        }
        if (moved) {
            addNewTile();
            renderBoard();
        }
    }

    function moveUp() {
        let moved = false;
        for (let col = 0; col < GRID_SIZE; col++) {
            let column = [];
            for (let row = 0; row < GRID_SIZE; row++) {
                column.push(gameBoard[row][col]);
            }
            const result = slide(column);
            if (result.changed) moved = true;
            for (let row = 0; row < GRID_SIZE; row++) {
                gameBoard[row][col] = result.array[row];
            }
        }
        if (moved) {
            addNewTile();
            renderBoard();
        }
    }

    function moveDown() {
        let moved = false;
        for (let col = 0; col < GRID_SIZE; col++) {
            let column = [];
            for (let row = 0; row < GRID_SIZE; row++) {
                column.push(gameBoard[row][col]);
            }
            column = column.reverse();
            const result = slide(column);
            if (result.changed) moved = true;
            column = result.array.reverse();
            for (let row = 0; row < GRID_SIZE; row++) {
                gameBoard[row][col] = column[row];
            }
        }
        if (moved) {
            addNewTile();
            renderBoard();
        }
    }

    
    function slide(array) {
        const newArray = array.filter(val => val !== 0);
        
        for (let i = 0; i < newArray.length - 1; i++) {
            if (newArray[i] === newArray[i + 1]) {
                newArray[i] *= 2;
                score += newArray[i];
                newArray.splice(i + 1, 1);
            }
        }
        
        while (newArray.length < GRID_SIZE) {
            newArray.push(0);
        }
        
        const changed = array.join(',') !== newArray.join(',');
        updateScoreDisplay();
        
        return { array: newArray, changed };
    }

    
    $game.find('#new-game-btn').on('click.game2048', function() {
        initializeBoard();
    });
            $game.attr('tabindex', '0').trigger('focus');
        });
    };
}(jQuery));