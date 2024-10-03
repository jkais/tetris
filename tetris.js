class Tetromino {
  constructor() {

    let tetrominos = [
      {
        blocks: [[0, 0], [1, 0], [2, 0], [3, 0]],
        color: "green",
        position: [0, 5],
      },
      {
        blocks: [[0, 0], [0, 1], [1, 0], [1, 1]],
        color: "red",
        position: [0, 5],
      },
    ]

    let rand = Math.floor(Math.random() * tetrominos.length)
    let tetromino = tetrominos[rand]

    this.position = tetromino.position
    this.blocks = tetromino.blocks
    this.color = tetromino.color
  }

  currentPosition() {
    return this.blocks.map((e) => [e[0] + this.position[0], e[1] + this.position[1]])
  }

  down() {
    this.position[0] += 1;
  }

  up() {
    this.position[0] -= 1;
  }

  left() {
    this.position[1] -= 1;
  }

  right() {
    this.position[1] += 1;
  }

  rotateLeft() {

  }

  rotateRight() {

  }
}

class Tetris {
  constructor() {
    this.size = [20, 10];
    this.speed = 500; // in ms
    this.playing = false;
    this.alive = true;
    this.moveTetromino = this.moveTetromino.bind(this);
    this.startNewGame = this.startNewGame.bind(this);
  }

  init() {
    this.app = document.body;
    this.drawUI();
    document.addEventListener('keydown', this.moveTetromino);
    setInterval(this.tick.bind(this), this.speed)
  }

  drawUI() {
    this.app.textContent = "";
    let grid = document.createElement("div")
    grid.id = "grid";
    grid.style = `grid-template-columns: repeat(${this.size[1]}, 1fr)`;

    for (let y = 0; y < this.size[0]; y++) {
      for (let x = 0; x < this.size[1]; x++) {
        let cell = document.createElement("div");
        cell.id = this.id(x, y);
        grid.appendChild(cell);
      }
    }

    let button = document.createElement("button");
    button.innerHTML = "Neues Spiel starten"
    button.addEventListener("click", () => {
      this.startNewGame();
    })
    this.app.appendChild(grid);
    this.app.appendChild(button);
  }

  startNewGame() {
    this.tetromino = new Tetromino();
    this.alive = true;
    this.playing = true;
    this.rubble = Array(this.size[0])
      .fill()
      .map(() => Array(this.size[1]).fill());
  }

  tick() {
    if (this.playing && this.alive) {
      this.tetromino.down();
      if (this.checkCollision()) {
        this.tetromino.up();
        this.makeRubble();
        this.tetromino = new Tetromino();
      }
      //this.checkFullLines();
      this.updateGrid();
      this.checkGameOver();
    }
  }

  checkFullLines() {
    this.rubble = this.rubble.filter((line) => {
      false;
    })
    while (this.rubble.length < this.size[1]) {
      this.rubble.push(Array)
    }
  }

  checkGameOver() {
  }

  checkCollision() {
    let collision = false;

    this.tetromino.currentPosition().forEach((pos) => {
      let [x, y] = pos

      if (x < 0 || x >= this.size[0]) collision = true
      if (y >= this.size[1]) collision = true
      if (this.rubble[y][x] !== undefined) collision = true
    })

    return collision;
  }

  makeRubble() {
    this.tetromino.currentPosition().forEach((pos) => {
      this.rubble[pos[0]][pos[1]] = this.tetromino.color
    })
  }

  moveTetromino(event) {
    if (["ArrowLeft", "a"].includes(event.key)) {
      this.tetromino.left();
      if (this.checkCollision()) {
        this.tetromino.right();
      }
    }
    if (["ArrowRight", "d"].includes(event.key)) {
      this.tetromino.right();
      if (this.checkCollision()) {
        this.tetromino.left();
      }
    }
    if (["ArrowDown", "s"].includes(event.key)) {
    }
    if (["q"].includes(event.key)) {
    }
    if (["e"].includes(event.key)) {
    }
    this.updateGrid();
  }

  updateGrid() {
    document.querySelectorAll("#grid>*").forEach((e) => e.style = "");
    this.drawRubble();
    this.drawTetromino();
  }

  drawRubble() {
    for (let x = 0; x < this.size[1]; x++) {
      for (let y = 0; y < this.size[0]; y++) {
        let value = this.rubble[y][x]
        if (value !== undefined) {
          this.elementAt([y, x]).style = `background-color: ${value};`;
        }
      }
    }



  }

  drawTetromino() {
    let color = this.tetromino.color;
    this.tetromino.currentPosition().forEach((pos) => {
      this.elementAt(pos).style = `background-color: ${color};`;
    })
  }

  elementAt(point) {
    return document.getElementById(this.id(point[1], point[0]))
  }

  id(x, y) {
    return `x${x}y${y}`
  }
}

new Tetris().init();