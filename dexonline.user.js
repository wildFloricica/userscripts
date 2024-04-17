// ==UserScript==
// @name        dexonline.ro: live search
// @namespace   Violentmonkey Scripts
// @match       https://dexonline.ro/definitie/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/28/2023, 3:06:32 PM
// ==/UserScript==

// a very dangerous big issue
// lets say you type ana
// the result from ana lets say it will load faster than the one for an
// then the an will remain the last one queried

// we will do a force

window.addEventListener("keydown", (e) => {
  // this means that is only controll pressed (maybe also shift or alt: but thats not the point)
  if (e.key == "Control") {
    refresh();
  }
});

const DEBOUNCE_TIME = 600; //ms
const THROTTLE_TIME = 250; //ms
const WORDS_URL = "https://dexonline.ro/definitie";
const MESSAGE = "#heliconia-searching-live";
const inpSearch = $("#searchField");
const listReplace = [".nav.nav-tabs", ".tab-content"];

// @Disable Autocomple cuz it gets in the way and i cannot read the definitions
$("#search-autocomplete").style.display = "none";

// @BelowIndependent
if (!window.location.href.includes(MESSAGE)) window.location.href += MESSAGE;

inpSearch.focus();

// @most-precise
// inpSearch.oninput = refresh;
// @throttle
// inpSearch.oninput = () => setTimeout(refresh, THROTTLE_TIME);
// @debounce
inpSearch.oninput = () => {
  clearTimeout(window.debounceid);
  window.debounceid = setTimeout(refresh, DEBOUNCE_TIME);
};

// @dep
var refresh = () => replaceContentWith(inpSearch.value);
function $(sel, x = document) {
  return x.querySelector(sel);
}

function replaceContentWith(newWord) {
  // Deletes all stuff when empty string
  if (newWord == "") return listReplace.map((sel) => ($(sel).innerHTML = ""));

  fetch(`${WORDS_URL}/${newWord}`)
    .then((res) => res.text())
    .then((htmlText) => {
      var newSite = document.createElement("div");
      newSite.innerHTML = htmlText;
      listReplace.map(
        (sel) => ($(sel).innerHTML = $(sel, newSite).innerHTML ?? "")
      );
    });
}
