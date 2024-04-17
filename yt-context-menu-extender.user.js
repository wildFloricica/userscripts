// ==UserScript==
// @name        yt: yt-custom-contextmenu extender
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @author      -
// @description 28/12/2023, 18:28:46
// ==/UserScript==

const RECHECK_INTERVAL = 400;
const TIMEOUT_DELAY = 20000;

var ytpConextMenuPanel = () =>
  document.querySelector(".ytp-contextmenu .ytp-panel-menu");
var yinyang_svg_icon = `<svg fill="#000000" height="256px" width="256px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 296.08 296.08" xml:space="preserve" transform="matrix(-1, 0, 0, 1, 0, 0)rotate(-45)" stroke="#000000" stroke-width="0.00296085"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M296.051,147.956c0-0.094-0.004-0.186-0.004-0.28C295.823,66.258,229.541,0,148.098,0 c-38.547,0-75.041,14.63-102.76,41.396c-27.643,26.693-43.66,62.648-45.1,100.648h0.018c-0.158,2-0.234,4.211-0.234,5.99 c0,1.699,0.191,6.078,0.201,6.331c1.6,38.2,17.689,73.866,45.305,100.419c27.699,26.632,64.119,41.301,102.555,41.301 c81.432,0,147.815-66.253,147.98-147.707C296.063,148.246,296.059,148.102,296.051,147.956z M148.082,280.088 c-34.279,0-66.762-13.08-91.465-36.831c-9.809-9.432-17.988-20.151-24.369-31.789c7.486,5.433,15.834,9.458,24.668,11.933 c-0.02-0.014-0.037-0.026-0.057-0.04c6.838,1.929,13.969,2.935,21.223,2.935c20.377,0,39.658-7.807,54.289-21.982 c14.594-14.139,23.014-33.094,23.707-53.376c0.039-5.102,0.014-5.102,0.014-5.012l-0.004-0.118 c1.281-33.463,28.271-59.635,61.777-59.635c34.195,0,61.844,27.746,61.844,61.939c0,0.002,0-0.002,0-0.002 c0,0.058,0.177,0.346,0.183,0.473C279.586,221.08,220.612,280.088,148.082,280.088z M98,148.088c0,11.028-8.973,20-20,20 c-11.029,0-20-8.972-20-20c0-11.028,8.971-20,20-20C89.028,128.088,98,137.059,98,148.088z"></path> <path d="M218,128.088c-11.029,0-20,8.972-20,20c0,11.028,8.971,20,20,20c11.027,0,20-8.972,20-20 C238,137.059,229.028,128.088,218,128.088z"></path> </g> </g></svg>`;

function CreateMenuItem(text, icon, cb, prepend = true) {
  const div = document.createElement("div");
  div.setAttribute("role", "menuitem");
  div.setAttribute("tabindex", "0");
  div.className = "ytp-menuitem";
  div.innerHTML = `
    <div class="ytp-menuitem-icon" >${icon}</div>
    <div class="ytp-menuitem-label" >${text}</div>
  `;
  if (prepend) ytpConextMenuPanel().prepend(div);
  else ytpConextMenuPanel().append(div);

  cb(div);
}

var is_initialised = false;
function Initialise() {
  if (is_initialised) return;
  is_initialised = true;

  CreateMenuItem("Toggle Invert Video Player", yinyang_svg_icon, (menuitem) => {
    menuitem.addEventListener("click", (eve) => {
      const video = document.querySelector("video");
      if (video.style.filter) video.style.filter = "";
      else video.style.filter = "invert(100)";
    });
  });
  CreateMenuItem(
    "Just For Fun",
    "",
    (menuitem) => {
      menuitem.onclick = () => alert("just for fun");
    },
    false
  );
}

var search_expired = false;

var iid = setInterval(() => {
  if (!ytpConextMenuPanel()) return;
  else {
    Initialise();
    clearInterval(iid);
    search_expired = true;
  }
}, RECHECK_INTERVAL);
setTimeout(() => {
  clearInterval(iid);
  search_expired = true;
  console.warn(
    "abort: Trecura " +
      TIMEOUT_DELAY +
      " secunde si nu aparu context menu de la youtube: sry"
  );
}, TIMEOUT_DELAY);

window.addEventListener("contextmenu", (e) => {
  if (search_expired) Initialise();
});
