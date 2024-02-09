import Trinny from "./trinny.js";
import Enemy from "./enemy.js";
import MovingDirection from "./movingdirection.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;
    this.yellowDot = new Image();
    this.yellowDot.src = "../images/images/chicken.png";
    this.wall = new Image();
    this.wall.src = "../images/images/wall.png";
    this.water = new Image();
    this.water.src = "../images/images/water.jpg";
  }
  //1,2 - wall & water
  //0 - dots
  //4- Trinny
  //5 - empty space
  //6 - enemy

  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 1],
    [1, 0, 2, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
    [1, 0, 2, 0, 2, 2, 2, 0, 2, 0, 2, 2, 0, 1],
    [1, 0, 2, 0, 2, 0, 0, 0, 2, 0, 2, 2, 0, 1],
    [1, 0, 2, 0, 2, 0, 0, 2, 2, 0, 2, 2, 0, 1],
    [1, 0, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 1],
    [1, 0, 2, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 1],
    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row, this.tileSize);
        } else if (tile === 2) {
          this.#drawWater(ctx, column, row, this.tileSize);
        } else if (tile === 0) {
          this.#drawDot(ctx, column, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, column, row, this.tileSize);
        }

        //ctx.strokeStyle = "yellow";
        //ctx.strokeRect(
        // column * this.tileSize,
        //row * this.tileSize,
        //this.tileSize,
        //this.tileSize
        //);
      }
    }
  }
  #drawWater(ctx, column, row, size) {
    ctx.drawImage(
      this.water,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawDot(ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawWall(ctx, column, row, size) {
    ctx.drawImage(
      this.wall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }
  #drawBlank(ctx, column, row, size) {
    ctx.fillStyle = "green";
    ctx.fillRect(column * this.tileSize, row * this.tileSize, size, size);
  }

  getTrinny(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 4) {
          this.map[row][column] = 0;
          return new Trinny(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }

  getEnemies(velocity) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const tile = this.map[row][column];
        if (tile == 6) {
          this.map[row][column] = 0;
          enemies.push(
            new Enemy(
              column * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }
  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }

    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let column = 0;
      let row = 0;
      let nextColumn = 0;
      let nextRow = 0;

      switch (direction) {
        case MovingDirection.right:
          nextColumn = x + this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.left:
          nextColumn = x - this.tileSize;
          column = nextColumn / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
        case MovingDirection.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          column = x / this.tileSize;
          break;
      }
      const tile = this.map[row][column];
      if (tile === 1 || tile === 2) {
        return true;
      }
    }
    return false;
  }
  eatChicken(x, y) {
    const row = y / this.tileSize;
    const column = x / this.tileSize;
    if (Number.isInteger(row) && Number.isInteger(column)) {
      if (this.map[row][column] === 0) {
        this.map[row][column] = 5;
        return true;
      }
    }
    return false;
  }
}