document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let width = 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let actualBombs = [];
    //create board 

    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            //bomb array
            const bombsArray = Array(bombAmount).fill('bomb');
            //safe array
            const emptyArray = Array(width * width - bombAmount).fill('safe');
            const shuffledArray = emptyArray.concat(bombsArray).sort(() => Math.random() - 0.5);

            if (shuffledArray[i] == 'bomb') {
                actualBombs.push(shuffledArray[i]);
            }

            //create a square
            const square = document.createElement('div');
            //add an id to the created square
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            //click
            square.addEventListener('click', function (e) {
                click(square);
            })

            square.oncontextmenu = function (e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = i % width == 0;
            const isRightEdge = i % width === width - 1;

            if (squares[i].classList.contains('safe')) {
                //checking left
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
                //checking upperright
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++;
                //checking above
                if (i > 10 && squares[i - width].classList.contains('bomb')) total++;
                //checking above left
                if (i > 11 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++;
                //checking the right
                if (i < 98 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++;
                // checking under left
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++;
                //checking under right
                if (i < 88 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++;
                //checking under finally !!!
                if (i < 89 && squares[i + width].classList.contains('bomb')) total++;

                squares[i].setAttribute('data', total);

            }
        }
    }

    createBoard();

    //add flags with right click
    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('checked') && flags < actualBombs.length) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
            }

        }

    }

    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('checked') || square.classList.contains('flag')) return;
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('checked');
                square.innerHTML = total;
                return;
            }

            checkSquare(square, currentId);
        }

        square.classList.add('checked');

    }

    function checkSquare(square, currentId) {
        const isLeftEdge = currentId % width == 0;
        const isRightEdge = currentId % width === width - 1;

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId) - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) + width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }

        }, 10)
    }

    function gameOver(square) {
        isGameOver = true;
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                square.innerHTML = '💣';
            }
        });
    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === actualBombs.length) {
                isGameOver = true;
                document.querySelector('h3').innerHTML = 'Congrats !!';
            }
        }
    }

    document.querySelector('button').addEventListener('click', () => {
        location.reload();
    })
})