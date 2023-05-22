import HtmlDom from "./HtmlDom.js";
import Cell from "./cell.js";

const htmlDom = new HtmlDom();
htmlDom.createDomTree();
const cell = new Cell(10, 20, 10, "text");
cell.draw(htmlDom.ctx);
