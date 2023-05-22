export default class HtmlDom {
  constructor() {
    this.root = null;
    this.gameContainer = null;
    this.gameArea = null;
    this.dasboard = null;
    this.canvas = null;
    this.ctx = null;
  }
  init() {}
  createDomTree() {
    document.body.innerHTML = "";
    this.#createRoot();
    this.#createGameContainer();
    this.#createGameArea();
    this.#createGameDasboard();
    this.#createCanvasElemnt();
    this.#getCanvasContext();
    this.#createTimer();
    this.#createSmile();
    this.#createFlags();
    this.#createClicks();
    this.#createВifficultyLevelBtnsContainer();
    this.#createThemeBtn();
    this.dasboard.append(this.flags, this.smile, this.timer, this.clicks);
    this.gameArea.appendChild(this.canvas);
    this.gameContainer.append(
      this.dasboard,
      this.gameArea,
      this.difficultyLevelBtnsContainer,
      this.themeBtn
    );
    this.root.append(this.gameContainer);
    document.body.append(this.root);
  }
  #createRoot() {
    this.root = document.createElement("main");
    this.root.className = "main";
  }
  #createGameArea() {
    this.gameArea = document.createElement("section");
    this.gameArea.className = "game__area";
  }
  #createGameDasboard() {
    this.dasboard = document.createElement("header");
    this.dasboard.className = "game__dashboard";
  }
  #createCanvasElemnt() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 400;
    this.canvas.height = 400;
  }
  #createTimer() {
    this.timer = document.createElement("div");
    this.timer.className = "game__dashboard__timer";
  }
  #createSmile() {
    this.smile = document.createElement("button");
    this.smile.className = "game__dashboard__smile";
    this.smile.textContent = "🙂";
  }
  #createFlags() {
    this.flags = document.createElement("div");
    this.flags.className = "game__dashboard__flags";
  }
  #createClicks() {
    this.clicks = document.createElement("div");
    this.clicks.className = "game__dashboard__clicks";
  }
  #getCanvasContext() {
    this.ctx = this.canvas.getContext("2d");
  }
  #createGameContainer() {
    this.gameContainer = document.createElement("div");
    this.gameContainer.className = "game";
  }
  #createВifficultyLevelBtnsContainer() {
    this.difficultyLevelBtnsContainer = document.createElement("div");
    this.difficultyLevelBtnsContainer.className = "game__level";
    ["easy", "medium", "hard"].forEach((val) => {
      const btn = document.createElement("button");
      btn.textContent = val;
      btn.id = val;
      this.difficultyLevelBtnsContainer.appendChild(btn);
    });
  }
  #createThemeBtn() {
    this.themeBtn = document.createElement("button");
    this.themeBtn.className = "theme";
    let theme = localStorage.getItem("theme") || "";
    this.themeBtn.textContent = theme === "dark" ? "🌞" : "🌑";

    this.themeBtn.addEventListener("click", () => {
      if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "");
        this.themeBtn.textContent = "🌑";
      } else {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
        this.themeBtn.textContent = "🌞";
      }
    });
  }
  setActivedificaltyBtn(id) {
    Array.from(this.difficultyLevelBtnsContainer.children).forEach((btn) => {
      if (btn.id === id) {
        btn.classList.add("active");
      } else {
        if (btn.classList.contains("active")) {
          btn.classList.remove("active");
        }
      }
    });
  }
}
