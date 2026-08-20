class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.state = 'EMPTY';
    }
}

class Connect4 {
    constructor(selector, options = {}) {
        this.selector = selector;

        this.X = options.x || 7;
        this.Y = options.y || 6;

        this.players = [
            { id: 1, name: 'Joueur 1', color: options.player1Color || 'red' },
            { id: 2, name: 'Joueur 2', color: options.player2Color || 'yellow' }
        ];

        if (this.players[0].color === this.players[1].color) {
            throw new Error("Les deux joueurs doivent avoir des couleurs différentes !");
        }

        this.currentPlayerIndex = 0;
        this.isGameOver = false;
        this.grid = [];
        this.movesCount = 0;
        this.moveHistory = [];

        this.initGame();
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    initGame() {
        const $board = $(this.selector);
        $board.empty();
        this.isGameOver = false;
        this.currentPlayerIndex = 0;
        this.movesCount = 0;
        this.moveHistory = [];
        this.grid = [];

        for (let y = 0; y < this.Y; y++) {
            this.grid[y] = [];
            const $row = $('<div>').addClass('row');

            for (let x = 0; x < this.X; x++) {
                this.grid[y][x] = new Cell(x, y);

                const $col = $('<div>')
                    .addClass('col empty')
                    .attr('data-x', x)
                    .attr('data-y', y);

                $row.append($col);
            }
            $board.append($row);
        }

        this.setupEventListeners();
        this.updateStatusDisplay();
    }

    updateStatusDisplay() {
        const player = this.getCurrentPlayer();
        $('#player').text(player.color);
        $('#status-display').text(`Player ${player.color} has to play`);
    }

    findLastEmptyCell(x) {
        for (let y = this.Y - 1; y >= 0; y--) {
            if (this.grid[y][x].state === 'EMPTY') {
                return { cellData: this.grid[y][x], $cell: $(`.col[data-x='${x}'][data-y='${y}']`) };
            }
        }
        return null;
    }

    setupEventListeners() {
        const $board = $(this.selector);
        $board.off();

        $board.on('mouseenter', '.col.empty', (e) => {
            if (this.isGameOver) return;
            const x = $(e.currentTarget).data('x');
            const emptyCell = this.findLastEmptyCell(x);
            if (emptyCell) {
                emptyCell.$cell.addClass(`next-${this.getCurrentPlayer().color}`);
            }
        });

        $board.on('mouseleave', '.col', () => {
            $('.col').removeClass(`next-red next-yellow next-black next-blue`);
        });

        $board.on('click', '.col.empty', (e) => {
            if (this.isGameOver) return;
            const x = $(e.currentTarget).data('x');
            const emptyCell = this.findLastEmptyCell(x);

            if (!emptyCell) return;

            this.playMove(emptyCell, x);
        });
    }

    playMove(emptyCell, x) {
        const player = this.getCurrentPlayer();
        const { cellData, $cell } = emptyCell;

        this.moveHistory.push({
            x: cellData.x,
            y: cellData.y,
            playerId: player.id,
            $cell: $cell
        });

        cellData.state = player.id;
        this.movesCount++;

        $cell.removeClass('empty').addClass(`falling ${player.color}`);

        setTimeout(() => {
            $cell.removeClass('falling');
        }, 300);

        if (this.checkForWinner(cellData.x, cellData.y, player.id)) {
            this.isGameOver = true;
            $('#status-display').text(`${player.name} a gagné !`);
            return;
        }

        if (this.movesCount === this.X * this.Y) {
            this.isGameOver = true;
            $('#status-display').text("Match Nul !");
            return;
        }

        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        this.updateStatusDisplay();
    }

    checkForWinner(x, y, playerId) {
        const checkDirection = (dx, dy) => {
            let count = 0;
            let nx = x + dx;
            let ny = y + dy;

            while (nx >= 0 && nx < this.X && ny >= 0 && ny < this.Y && this.grid[ny][nx].state === playerId) {
                count++;
                nx += dx;
                ny += dy;
            }
            return count;
        };

        const checkLine = (dirA, dirB) => {
            return 1 + checkDirection(dirA.x, dirA.y) + checkDirection(dirB.x, dirB.y) >= 4;
        };

        return (
            checkLine({ x: 0, y: -1 }, { x: 0, y: 1 }) ||
            checkLine({ x: -1, y: 0 }, { x: 1, y: 0 }) ||
            checkLine({ x: -1, y: 1 }, { x: 1, y: -1 }) ||
            checkLine({ x: -1, y: -1 }, { x: 1, y: 1 })
        );
    }

    undoLastMove() {
        if (this.moveHistory.length === 0 || this.isGameOver) return;

        const lastMove = this.moveHistory.pop();
        const cell = this.grid[lastMove.y][lastMove.x];

        cell.state = 'EMPTY';
        this.movesCount--;

        lastMove.$cell.removeClass(lastMove.$cell.attr('class')).addClass('col empty');

        this.currentPlayerIndex = (this.currentPlayerIndex - 1 + this.players.length) % this.players.length;
        this.updateStatusDisplay();
    }

    restart() {
        this.initGame();
    }
}