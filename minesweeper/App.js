import Cell from "./Cell.js";
import HtmlDom from "./HtmlDom.js";

class Api {
  constructor() {
    this.htmlDom = new HtmlDom();
    this.htmlDom.createDomTree();
    this.localStorage = this.getFromLocalStorage();
    this.dificalty = localStorage.getItem("dificalty") || "easy";
    this.width =
      this.dificalty === "hard" ? 20 : this.dificalty === "medium" ? 15 : 10;
    this.row = this.width;
    this.col = this.width;
    this.bombAmout = Math.floor((this.width * this.width) / 10);
    this.radius = 0;
    this.cells = [];
    this.isGameOver = false;
    this.flags = 0;
    this.isClicked = false;
    this.lms = 0;
    this.timer = 0;
    this.checkedCount = 0;
    this.isWin = false;
    this.clicks = 0;
    this.dificaltyBtns = this.htmlDom.difficultyLevelBtnsContainer.children;
    this.htmlDom.flags.textContent = this.bombAmout.toString().padStart(3, "0");
    this.htmlDom.timer.textContent = this.timer.toString().padStart(3, "0");
    this.history = this.localStorage?.history ? this.localStorage?.history : [];
    this.htmlDom.clicks.textContent = this.clicks.toString().padStart(3, "0");
    this.setOptions();
    this.setCanvasSIze();
  }
  setOptions() {
    if (!this.localStorage || !this.localStorage?.options) {
      return;
    }
    const opt = this.localStorage.options;
    this.row = opt.row;
    this.col = opt.col;
    this.clicks = opt.clicks;
    this.bombAmout = opt.bombAmout;
    this.radius = opt.radius;
    this.flags = opt.flags;
    this.isClicked = opt.isClicked;
    this.timer = opt.timer;
    this.checkedCount = opt.checkedCount;
    this.isWin = opt.isWin;
    this.htmlDom.flags.textContent = this.bombAmout.toString().padStart(3, "0");
    this.htmlDom.timer.textContent = this.timer.toString().padStart(3, "0");
    this.htmlDom.clicks.textContent = opt.clicks.toString().padStart(3, "0");
    this.htmlDom.flags.textContent = (this.bombAmout - opt.flags)
      .toString()
      .padStart(3, "0");
    this.htmlDom.setActivedificaltyBtn(this.dificalty);
  }
  setCanvasSIze = () => {
    let width;
    if (window.innerWidth < 420) {
      width = window.innerWidth - 40;
    } else {
      width = 400;
    }
    this.htmlDom.canvas.width = width;
    this.htmlDom.canvas.height = width;
    this.radius = width / this.width;
  };
  getFromLocalStorage() {
    return localStorage.getItem("minesweeper")
      ? JSON.parse(localStorage.getItem("minesweeper"))
      : null;
  }
  init() {
    if (!this.localStorage || !this.localStorage.cells) {
      this.createCells();
    } else {
      const arr = [this.localStorage.cells];
      this.localStorage.cells.forEach((matrix, i) => {
        arr[i] = [];
        matrix.forEach(
          ({
            col,
            isBomb,
            isChecked,
            isFlaged,
            radius,
            row,
            text,
            total,
            x,
            y,
          }) => {
            const copy = new Cell(x, y, radius, text);
            copy.col = col;
            copy.isBomb = isBomb;
            copy.isChecked = isChecked;
            copy.isFlaged = isFlaged;
            copy.row = row;
            copy.total = total;
            arr[i].push(copy);
          }
        );
      });
      this.cells = arr;
    }

    this.htmlDom.canvas.addEventListener(
      "click",
      ({ offsetX, offsetY, detail }) => {
        if (detail.x && detail.y) {
          offsetX = detail.x;
          offsetY = detail.y;
        }
        if (this.isGameOver || this.isWin) return;
        this.cells.forEach((matrix) => {
          matrix.forEach((cell) => {
            if (
              cell.x - 1 < offsetX &&
              cell.x + this.radius + 1 > offsetX &&
              cell.y - 1 < offsetY &&
              cell.y + this.radius + 1 > offsetY
            ) {
              if (cell.isChecked || cell.isFlaged) return;
              if (cell.isBomb) {
                if (!this.isClicked) {
                  let emptyCell = null;
                  while (!emptyCell) {
                    const row = Math.floor(Math.random() * this.width);
                    const col = Math.floor(Math.random() * this.width);
                    if (!this.cells[row][col].isBomb) {
                      emptyCell = this.cells[row][col];
                    }
                  }
                  emptyCell.isBomb = true;
                  cell.isBomb = false;
                  this.suroundedBombs();
                  cell.isChecked = true;
                  this.checkedCount++;
                  this.checkCell(cell);
                } else {
                  this.bombSound.play();
                  this.gameOver();
                }
              } else {
                if (detail === 1) {
                  this.clicks++;
                }
                if (!cell.isChecked) {
                }
                this.htmlDom.clicks.textContent = this.clicks
                  .toString()
                  .padStart(3, "0");
                if (cell.total != 0) {
                  cell.isChecked = true;
                  this.checkedCount++;
                } else {
                  this.checkCell(cell);
                  cell.isChecked = true;
                  this.checkedCount++;
                }
              }
            }
          });
        });
        this.isClicked = true;
        this.animate();
      }
    );

    this.htmlDom.canvas.addEventListener("contextmenu", (e) => {
      const { offsetX, offsetY } = e;
      e.preventDefault();
      if (this.isGameOver || this.isWin) return;
      this.cells.forEach((matrix) => {
        matrix.forEach((cell) => {
          if (
            cell.x - 1 < offsetX &&
            cell.x + this.radius + 1 > offsetX &&
            cell.y - 1 < offsetY &&
            cell.y + this.radius + 1 > offsetY
          ) {
            if (
              this.flags < this.bombAmout &&
              !cell.isFlaged &&
              !cell.isChecked
            ) {
              if (!cell.isChecked && this.bombAmout - this.flags != 0) {
              }
              cell.isFlaged = true;
              this.flags++;
            } else if (cell.isFlaged) {
              cell.isFlaged = false;
              this.flags--;
            }
          }
        });
        this.htmlDom.flags.textContent = (this.bombAmout - this.flags)
          .toString()
          .padStart(3, "0");
      });
      this.animate();
    });
    this.htmlDom.smile.addEventListener("click", () => {
      this.restart();
    });
    this.suroundedBombs();
    window.addEventListener("resize", () => {
      this.setCanvasSIze();
      this.animate();
    });
    window.addEventListener("beforeunload", () => {
      if (this.isGameOver) {
        this.saveInLocalStorage("", "");
        return;
      }
      this.saveSesionInLOcalStroage();
    });
    Array.from(this.dificaltyBtns).forEach((btn) => {
      btn.addEventListener("click", () => {
        let allow = true;
        if (this.isClicked) {
          allow = confirm("are you abort the game ??");
        }
        if (allow) {
          const dificalty = btn.id;
          this.dificalty = dificalty;
          this.width =
            this.dificalty === "hard"
              ? 20
              : this.dificalty === "medium"
              ? 15
              : 10;
          this.row = this.width;
          this.col = this.width;
          this.saveInLocalStorage("", "");
          this.restart();
          this.createCells();
          this.setCanvasSIze();
          this.animate();
          this.htmlDom.setActivedificaltyBtn(this.dificalty);
          localStorage.setItem("dificalty", dificalty);
        }
      });
    });
    this.loop();
  }

  loop = (t = 0) => {
    if (this.isClicked && !this.isWin && !this.isGameOver) {
      if (t - this.lms >= 1000) {
        this.timer += 1;
        this.htmlDom.timer.textContent = this.timer.toString().padStart(3, "0");
        this.lms = t;
      }
    }
    requestAnimationFrame(this.loop);
  };
  checkForWin() {
    if (this.width * this.width - this.checkedCount === this.bombAmout) {
      this.isWin = true;
      this.winSound.play();
    }
  }
  createCells() {
    const cellsWithBombs = new Array(this.bombAmout).fill("bomb");
    const emptyCell = new Array(this.width * this.width - this.bombAmout).fill(
      ""
    );

    const cells = [...cellsWithBombs, ...emptyCell].sort(
      () => Math.random() - 0.5
    );
    let arr = [];
    for (let i = 0; i < this.row; i++) {
      arr[i] = [];
      for (let j = 0; j < this.col; j++) {
        const x = j * this.radius;
        const y = i * this.radius;
        const cell = new Cell(x, y, this.radius, cells[i * this.width + j]);
        cell.row = i;
        cell.col = j;
        arr[i].push(cell);
      }
      this.cells = arr;
    }
  }
  checkCell(cell) {
    const dispatch = (row, col) => {
      const { x, y, radius } = this.cells[row][col];
      const customClick = new CustomEvent("click", {
        detail: { x: x + radius / 2, y: y + radius },
      });
      this.htmlDom.canvas.dispatchEvent(customClick);
    };
    const { row, col } = cell;
    setTimeout(() => {
      if (this.cells[row][col + 1]) {
        dispatch(row, col + 1);
      } else if (this.cells[row][col - 1]) {
        dispatch(row, col - 1);
      } else if (this.cells[row - 1] && this.cells[row - 1][col]) {
        dispatch(row - 1, col);
      } else if (this.cells[row - 1] && this.cells[row - 1][col - 1]) {
        dispatch(row - 1, col - 1);
      } else if (this.cells[row - 1] && this.cells[row - 1][col + 1]) {
        dispatch(row - 1, col + 1);
      } else if (this.cells[row + 1] && this.cells[row + 1][col]) {
        dispatch(row + 1, col);
      } else if (this.cells[row + 1] && this.cells[row + 1][col + 1]) {
        dispatch(row + 1, col + 1);
      } else if (this.cells[row + 1] && this.cells[row + 1][col - 1]) {
        dispatch(row + 1, col - 1);
      }
    }, 10);
  }
  restart() {
    this.isGameOver = false;
    this.isClicked = false;
    this.lms = 0;
    this.timer = 0;
    this.checkedCount = 0;
    this.clicks = 0;
    this.flags = 0;
    this.htmlDom.flags.textContent = this.bombAmout.toString().padStart(3, "0");
    this.htmlDom.timer.textContent = "000";
    this.htmlDom.clicks.textContent = "000";
    this.isWin = false;
    this.htmlDom.smile.textContent = "🙂";
    this.saveInLocalStorage("", "");
    this.createCells();
    this.suroundedBombs();
    this.animate();
  }
  gameOver = () => {
    this.pushInHistry("lose");
    this.isGameOver = true;
    this.htmlDom.smile.textContent = "😔";
    this.cells.forEach((matrix) => {
      matrix.forEach((cell) => {
        cell.isChecked = true;
      });
    });
    this.saveInLocalStorage("", "");
  };
  pushInHistry(result) {
    this.history.push({ result, time: this.timer });
  }
  saveInLocalStorage(cells, options) {
    localStorage.setItem(
      "minesweeper",
      JSON.stringify({
        cells,
        options,
        history: this.history,
      })
    );
  }
  draw = () => {
    const { ctx } = this.htmlDom;
    this.cells.forEach((matrix) => {
      matrix.forEach((cell) => {
        if (this.radius !== cell.radius) {
          cell.radius = this.radius;
          cell.resize();
        }
        cell.update(ctx);
      });
    });
    if (this.isGameOver || this.isWin) {
      this.alert(ctx);
    }
  };
  saveSesionInLOcalStroage = () => {
    const options = {
      row: this.row,
      col: this.col,
      bombAmout: this.bombAmout,
      radius: this.radius,
      isGameOver: this.isGameOver,
      flags: this.flags,
      clicks: this.clicks,
      isClicked: this.isClicked,
      timer: this.timer,
      clicks: this.clicks,
      checkedCount: this.checkedCount,
      isWin: this.isWin,
    };
    this.saveInLocalStorage(this.cells, options);
  };
  alert(ctx) {
    let text1 = "Hooray!";
    let text2 = "You found all mines";
    if (this.isGameOver) {
      text1 = "Game Over !";
      text2 = "Try again";
    }
    ctx.save();
    ctx.fillStyle = `rgba(0,0,0,.06)`;
    ctx.fillRect(
      0,
      (this.width * this.radius) / 2 - this.radius * 3,
      this.width * this.radius,
      this.radius * 5
    );
    ctx.font = `bold ${(this.radius * this.width) / 9}px serif`;
    ctx.fillStyle = this.isGameOver ? "red" : "green";
    ctx.shadowBlur = 0;
    ctx.fillText(
      text1,
      (this.width / 2) * this.radius,
      (this.width / 2) * this.radius - this.radius
    );
    ctx.fillText(
      text2,
      (this.width / 2) * this.radius,
      (this.width / 2) * this.radius + this.radius
    );
    ctx.restore();
  }
  animate = (t = 0) => {
    const { ctx, canvas } = this.htmlDom;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.draw();
  };
  suroundedBombs() {
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        let total = 0;
        if (this.cells[i][j + 1] && this.cells[i][j + 1].isBomb) total++;
        if (this.cells[i][j - 1] && this.cells[i][j - 1].isBomb) total++;
        if (
          this.cells[i - 1] &&
          this.cells[i - 1][j] &&
          this.cells[i - 1][j].isBomb
        )
          total++;
        if (
          this.cells[i - 1] &&
          this.cells[i - 1][j - 1] &&
          this.cells[i - 1][j - 1].isBomb
        )
          total++;
        if (
          this.cells[i - 1] &&
          this.cells[i - 1][j + 1] &&
          this.cells[i - 1][j + 1].isBomb
        )
          total++;
        if (
          this.cells[i + 1] &&
          this.cells[i + 1][j] &&
          this.cells[i + 1][j].isBomb
        )
          total++;
        if (
          this.cells[i + 1] &&
          this.cells[i + 1][j + 1] &&
          this.cells[i + 1][j + 1].isBomb
        )
          total++;
        if (
          this.cells[i + 1] &&
          this.cells[i + 1][j - 1] &&
          this.cells[i + 1][j - 1].isBomb
        )
          total++;
        this.cells[i][j].total = total;
      }
    }
  }
}
const api = new Api();

const windowLoadHandle = () => {
  api.init();
  api.animate();
};
window.addEventListener("load", windowLoadHandle);
