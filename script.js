const record = document.getElementById('record');
const shot = document.getElementById('shot');
const hit = document.getElementById('hit');
const dead = document.getElementById('dead');
const enemy = document.getElementById('enemy');
const again = document.getElementById('again');
const header = document.querySelector('.header');

const game = {
    ships: [],
    colissions: new Set(),
    miss: new Set(),
    aroundDeadShips: new Set(),
    generateShips() {
        const size = [4, 3, 2, 1];
        const count = [1, 2, 3, 4];
        for (let i = 0; i < count.length; i++) {
            for (let j = 0; j < count[i]; j++) {
                this.ships.push(this.createShip(size[i]));
            }
        }
    },
    createShip(size) {
        const location = [],
            hit = [],
            direction = Math.random() < 0.5;

        if (direction) {
            //горизонталь
            const startLocationX = Math.floor(Math.random() * 10);
            const startLocationY = Math.floor(Math.random() * (10 - (size - 1)));
            for (let i = 0; i < size; i++) {
                location.push(startLocationX + '' + (startLocationY + i));
                hit.push('');
            }
        } else {
            //вертикаль
            const startLocationX = Math.floor(Math.random() * (10 - (size - 1)));
            const startLocationY = Math.floor(Math.random() * 10);
            for (let i = 0; i < size; i++) {
                location.push((startLocationX + i) + '' + startLocationY);
                hit.push('');
            }
        };
        if (this.checkColissions(location)) {
            return this.createShip(size);
        };

        this.addCollision(location);

        return { location, hit };
    },
    checkColissions(locations) {
        for (const coord of locations) {
            if (this.colissions.has(coord)) {
                return true;
            }
        }
    },
    addCollision(locations) {
        for (let i = 0; i < locations.length; i++) {
            const startCoordX = locations[i][0] - 1;
            for (let j = startCoordX; j < startCoordX + 3; j++) {
                const startCoordY = locations[i][1] - 1;
                for (let z = startCoordY; z < startCoordY + 3; z++) {
                    if (j >= 0 && j < 10 && z >= 0 && z < 10) {
                        const coord = j + '' + z;
                        this.colissions.add(coord);
                    };
                };
            };
        };
    },
}

const play = {
    record: localStorage.getItem('seaBattleRecord') || 0,
    shot: 0,
    hit: 0,
    dead: 0,
    set updateData(data) {
        this[data]++;
        this.render();
    },
    render() {
        record.textContent = this.record;
        shot.textContent = this.shot;
        hit.textContent = this.hit;
        dead.textContent = this.dead;
    }
};

const show = {
    hit(elem) {
        this.changeClass(elem, 'hit')
    },
    miss(elem) {
        this.changeClass(elem, 'miss')
    },
    dead(elem) {
        this.changeClass(elem, 'dead')
    },
    changeClass(elem, value) {
        elem.className = value;
    },
    missAroundDead(collection, ship) {
        const array = [];
        const setter = new Set();
        for (const block of collection) {
            const startX = block[0] - 1;
            for (let i = startX; i < startX + 3; i++) {
                const startY = block[1] - 1;
                for (let j = startY; j < startY + 3; j++) {
                    if (i >= 0 && i < 10 && j >= 0 && j < 10) {
                        const coord = i + '' + j;
                        const searchOne = array.indexOf(coord);
                        const searchTwo = ship.location.indexOf(coord);
                        if (coord !== block && searchOne < 0 && searchTwo < 0) {
                            array.push(coord);
                        };
                    };
                };
            };
        };
        for (const i of array) {
            const cell = document.getElementById(i);
            this.miss(cell);
        };
    },
}

const fire = (event) => {
    if (play.dead !== game.ships.length) {
        const target = event.target;
        if (target.classList.length !== 0 || target.tagName !== 'TD') return;
        show.miss(target);

        play.updateData = 'shot';


        for (let i = 0; i < game.ships.length; i++) {
            let hits = game.ships[i].location.indexOf(target.id);
            if (hits >= 0) {
                show.hit(target);
                game.ships[i].hit[hits] = 'X';
                play.updateData = 'hit';
                let life = game.ships[i].hit.indexOf('');
                if (life < 0) {
                    play.updateData = 'dead';
                    for (let id of game.ships[i].location) {
                        game.miss.add(id);
                        show.dead(document.getElementById(id));
                    };
                    show.missAroundDead(game.miss, game.ships[i]);
                    game.miss = new Set();
                }
            }

        };

        if (play.dead === game.ships.length) {
            header.textContent = 'Игра окончена!';
            header.style.color = 'red';
            if (play.shot < play.record || !play.record) {
                localStorage.setItem('seaBattleRecord', play.shot);
                play.record = play.shot;

                play.render();
            }

        }
    }
};

const init = function () {
    enemy.addEventListener('click', fire);
    play.render();
    game.generateShips();
    again.addEventListener('click', () => {
        location.reload();
        /*
        const tableCell = enemy.querySelectorAll('td');
        for (const cell of tableCell) {
            cell.classList = '';
        }
        game.ships = [];
        play.shot = 0;
        play.hit = 0;
        play.dead = 0;
        play.render();
        header.textContent = 'SEA BATTLE';
        header.style.color = 'black';*/
    });
    record.addEventListener('dblclick', () => {
        localStorage.clear();
        play.record = 0;
        play.render();
    });
};

init();

