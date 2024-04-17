// ==UserScript==
// @name        scoalarutiera.ro: enhanced video
// @namespace   Violentmonkey Scripts
// @match       https://www.scoalarutiera.ro/curs-legislatie/*
// @grant       none
// @version     1.0
// @author      -
// @description 7/18/2023, 11:56:21 PM
// ==/UserScript==

var G$Speed = JSON.parse(localStorage.getItem("hlcn-last-speed")) || 2;
var G$Videos = document.querySelectorAll("video");
var G$FOOTER_BTNS = document.querySelectorAll(`.panel-footer [role="button"]`);
var G$LastVideo;
var G$AutoNext = JSON.parse(localStorage.getItem("hlcn-autonext")) || false;
G$Videos.forEach((video) => {
  video.addEventListener("play", () => {
    G$LastVideo = video;
    video.playbackRate = G$Speed;
  });
  video.addEventListener("ended", () => {
    if (G$AutoNext) G$FOOTER_BTNS[1].click();
  });
});

function toffleFS(elem) {
  if (!document.fullscreenElement) elem.requestFullscreen();
  else if (document.exitFullscreen) document.exitFullscreen();
}
function newSpeed(n) {
  localStorage.setItem("hlcn-last-speed", `${(G$Speed = n)}`);
  return n;
}

const styles = document.createElement("style");
styles.textContent = G$AutoNext
  ? `#video *{color:red;}`
  : "#video *{color:white;}";
document.head.append(styles);

window.addEventListener("keydown", (e) => {
  if (e.key == "P" && e.shiftKey) G$FOOTER_BTNS[0].click();
  if (e.key == "N" && e.shiftKey) G$FOOTER_BTNS[1].click();

  if (e.ctrlKey && e.altKey) {
    G$AutoNext = !G$AutoNext;
    localStorage.setItem("hlcn-autonext", JSON.stringify(G$AutoNext));
    styles.textContent = G$AutoNext
      ? `#video *{color:red;}`
      : "#video *{color:white;}";
  }

  if (e.key == "K" && e.shiftKey) {
    const vid = G$LastVideo || G$Videos[0];
    vid.play();
    return;
  }

  if (e.key == "k") {
    const vid = G$LastVideo || G$Videos[0];
    vid[vid.paused ? "play" : "pause"]();
    return;
  }

  if (!G$LastVideo) {
    if (e.key != "f") return;
    document.querySelectorAll("video")[0].play();
    document.querySelectorAll("video")[0].parentElement.requestFullscreen();
    return;
  }

  if (e.key == "Home") G$LastVideo.currentTime = 0;
  if (e.key == "End") G$LastVideo.currentTime = G$LastVideo.duration;
  if ("0123456789".includes(e.key))
    G$LastVideo.currentTime = (G$LastVideo.duration * parseInt(e.key)) / 10;
  if (e.key == "f") toffleFS(G$LastVideo.parentElement);
  if (e.key == "ArrowLeft") G$LastVideo.currentTime -= 5;
  if (e.key == "ArrowRight") G$LastVideo.currentTime += 5;
  if (e.key == "ArrowUp") G$LastVideo.volume += 0.15;
  if (e.key == "ArrowDown") G$LastVideo.volume -= 0.15;
  if (e.shiftKey && e.key == ">")
    G$LastVideo.playbackRate = newSpeed(G$Speed + 0.25);
  if (e.shiftKey && e.key == "<")
    G$LastVideo.playbackRate = newSpeed(G$Speed - 0.25);
});
