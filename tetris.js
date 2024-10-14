class Tetromino {
  constructor() {

    let tetrominos = [
      {
        name: "I",
        blocks: [[0, 0], [1, 0], [2, 0], [3, 0]],
        color: "cyan",
        position: [0, 4],
      },
      {
        name: "O",
        blocks: [[0, 0], [0, 1], [1, 0], [1, 1]],
        color: "yellow",
        position: [0, 4],
      },
      {
        name: "S",
        blocks: [[1, 0], [0, 1], [1, 1], [0, 2]],
        color: "green",
        position: [0, 4],
      },
      {
        name: "Z",
        blocks: [[0, 0], [0, 1], [1, 1], [1, 2]],
        color: "red",
        position: [0, 4],
      },
      {
        name: "J",
        blocks: [[0, 0], [1, 0], [2, 0], [2, 1]],
        color: "blue",
        position: [0, 4],
      },
      {
        name: "L",
        blocks: [[0, 1], [1, 1], [2, 0], [2, 1]],
        color: "orange",
        position: [0, 4],
      },
      {
        name: "T",
        blocks: [[1, 0], [0, 1], [1, 1], [2, 1]],
        color: "purple",
        position: [0, 4],
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
    this.blocks = this.blocks.map(([y, x]) => [-x, y]);
  }

  rotateRight() {
    this.blocks = this.blocks.map(([y, x]) => [x, -y]);
  }
}

class Tetris {
  constructor() {
    this.size = [20, 10];
    this.speed = 500; // in ms
    this.playing = false;
    this.alive = true;
    this.highscore = 0;
    this.moveTetromino = this.moveTetromino.bind(this);
    this.moveLeft = this.moveLeft.bind(this);
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
        cell.classList.add(this.id(x, y));
        grid.appendChild(cell);
      }
    }

    let info = document.createElement("div");
    info.id = "info"

    let next = document.createElement("div");
    next.id = "next";

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        let cell = document.createElement("div");
        cell.classList.add(this.id(x, y));
        next.appendChild(cell);
      }
    }

    let score = document.createElement("div");
    score.id = "score";
    score.textContent = "0";

    let highscore = document.createElement("div");
    highscore.id = "highscore";
    highscore.textContent = this.highscore;

    let startButton = document.createElement("button");
    startButton.innerHTML = "Neues Spiel starten"
    startButton.addEventListener("click", () => {
      this.startNewGame();
    })

    let leftButton = document.createElement("button");
    leftButton.innerHTML = "←";
    leftButton.addEventListener("click", this.moveLeft);

    let rightButton = document.createElement("button");
    rightButton.innerHTML = "→";


    "↺"
    "↻"
    "↓"

    info.appendChild(leftButton);
    info.appendChild(next)
    info.appendChild(rightButton);

    //this.app.appendChild(score);
    //this.app.appendChild(highscore);
    this.app.append(grid);
    this.app.append(info);
    this.app.appendChild(startButton);
  }

  startNewGame() {
    this.nextTetromino = new Tetromino();
    this.newTetromino();
    this.alive = true;
    this.playing = true;
    this.score = 0;
    this.level = 0;
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
        this.checkFullLines();
        this.newTetromino();
        if (this.checkCollision()) {
          this.alive = false;
          this.playing = false;
        }
      }
      this.redrawUi();
    }
  }

  checkFullLines() {
    this.rubble = this.rubble.filter((line) => {
      return !line.every((x) => x !== undefined)
    })

    let linesRemoved = this.size[0] - this.rubble.length;

    let perLine = {
      0: 0,
      1: 40,
      2: 50,
      3: 100,
      4: 300
    }

    this.score += perLine[linesRemoved];
    if (this.score > this.highscore) this.highscore = this.score;

    while (this.rubble.length < this.size[0]) {
      this.rubble.unshift(Array(this.size[1]).fill())
    }
  }

  checkCollision() {
    let collision = false;

    this.tetromino.currentPosition().forEach((pos) => {
      let [y, x] = pos

      if (x < 0 || x >= this.size[1]) return collision = true
      if (y >= this.size[0]) return collision = true
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
      this.moveLeft();
    }
    if (["ArrowRight", "d"].includes(event.key)) {
      this.tetromino.right();
      if (this.checkCollision()) {
        this.tetromino.left();
      }
    }
    if (["ArrowDown", "s"].includes(event.key)) {
      while (!this.checkCollision()) {
        this.tetromino.down();
      }
      this.tetromino.up();
    }
    if (["q"].includes(event.key)) {
      this.tetromino.rotateLeft();
    }
    if (["e"].includes(event.key)) {
      this.tetromino.rotateRight();
    }
    this.redrawUi();
  }


  moveLeft() {
    this.tetromino.left();
    if (this.checkCollision()) {
      this.tetromino.right();
    }
  }

  newTetromino() {
    this.tetromino = this.nextTetromino;
    this.nextTetromino = new Tetromino();
    this.drawNextTetromino();
  }

  redrawUi() {
    document.querySelectorAll("#grid>*").forEach((e) => {
      e.style = "";
      e.classList.remove("block");
    });
    this.drawRubble();
    this.drawTetromino();
    console.log(this.highscore);

    document.getElementById("score").textContent = this.score;
    document.getElementById("highscore").textContent = this.highscore;
  }

  drawRubble() {
    for (let x = 0; x < this.size[1]; x++) {
      for (let y = 0; y < this.size[0]; y++) {
        let value = this.rubble[y][x]
        if (value !== undefined) {
          this.elementAt([y, x]).style = `background-color: ${value};`;
          this.elementAt([y, x]).classList.add("block");
        }
      }
    }
  }

  drawTetromino() {
    let color = this.tetromino.color;
    this.tetromino.currentPosition().forEach((pos) => {
      this.elementAt(pos).style = `background-color: ${color};`;
      this.elementAt(pos).classList.add("block");
    })
  }

  drawNextTetromino() {
    document.querySelectorAll("#next>*").forEach((e) => e.style = "");
    let color = this.nextTetromino.color;
    this.nextTetromino.currentPosition().forEach((pos) => {
      pos[1] = pos[1] - 4;
      pos[0] = pos[0] + 1;
      this.elementAt(pos, "next").style = `background-color: ${color};`;
    })
  }

  elementAt(point, container = "grid") {
    return document.querySelector(`#${container} .${this.id(point[1], point[0])}`)
  }

  id(x, y) {
    return `x${x}y${y}`
  }
}

new Tetris().init();