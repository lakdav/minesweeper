export default class Cell {
  constructor(x, y, radius, text) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.isChecked = false;
    this.isFlaged = false;
    this.isBomb = text === "bomb" ? true : false;
    this.total = 0;
    this.text = this.isBomb ? "💣" : this.total > 0 ? this.total : "";
    this.row = 0;
    this.col = 0;
  }
  resize() {
    this.y = this.row * this.radius;
    this.x = this.col * this.radius;
  }
  update(ctx) {
    this.text = this.isBomb ? "💣" : this.total > 0 ? this.total : "";
    this.draw(ctx);
  }
  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    ctx.fillStyle = "rgb(128, 128, 128, 1)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${this.radius / 2}px serif`;
    if (this.isChecked) {
      this.checked(ctx);
      return;
    }

    ctx.shadowColor = "black";
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = -1;
    ctx.fillRect(this.x, this.y, this.radius, this.radius);
    ctx.strokeRect(this.x, this.y, this.radius, this.radius);
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = -1;
    ctx.shadowBlur = 0;

    if (!this.isChecked && this.isFlaged) {
      ctx.fillText(
        "\u{1F6A9}",
        this.x + this.radius / 2,
        this.y + this.radius / 2
      );
    }
  }

  /**
   *
   * @param {CanvasRenderingContext2D} ctx
   */
  checked(ctx) {
    ctx.save();
    ctx.fillStyle = "ivory";
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = -1;
    ctx.shadowOffsetY = -1;
    ctx.fillRect(this.x, this.y, this.radius, this.radius);
    ctx.fillStyle =
      this.total >= 6
        ? "orange"
        : this.total === 5
        ? "red"
        : this.total === 4
        ? "purple"
        : this.total === 3
        ? "rgb(252, 214, 3)"
        : this.total === 2
        ? "green"
        : "blue";
    ctx.fillText(this.text, this.x + this.radius / 2, this.y + this.radius / 2);
    ctx.restore();
  }
}
console.log();
