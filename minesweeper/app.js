import Cell from "./Cell.js";
import HtmlDom from "./HtmlDom.js";

class Api {
  constructor() {
    this.htmlDom = new HtmlDom();
    this.htmlDom.createDomTree();
    this.width = 10;
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
  }
}
const api = new Api();

const windowLoadHandle = () => {
  api.init();
  api.animate();
};
window.addEventListener("load", windowLoadHandle);
