// ==UserScript==
// @name        yt: (alzy) markers for accidental/intentional saves
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 23/10/2023, 00:40:42
// ==/UserScript==

const ADD_MARKERS_AT_PERCENTAGE = false;

/*
.    .     '   .    ,     .
  .     '    .   '    .    .
.  '    .    ' .  ` ` . `.
.   ' .  `.'     . ' ..  . .
 .  .' `' .    ' . . ' '   '
 . .   . '  ' '' .    .'  '
. ' ` `'  . ' . *   . ' '
 *   .'   *  .'  ` ` . '  '.
This script is brought to you
by neige man -- cherry blossom  
(aka wildFloricica)
Acesta este un pamflet
*/

// alzy meaning alt+z for youtube

// save markers to localstorage to prevent accidental page reload

// i am making this specifically for youtube player
const main = () => {
  const video = document.querySelector("video");

  var lasttime = undefined;
  window.markers = window.markers || [];
  window.i = window.markers.length - 1 || -1;

  function TowerableEvents(elem, events, customkey) {
    if (!window.TowerableEvents) window.TowerableEvents = {};
    Object.keys(window.TowerableEvents[customkey] || {}).forEach((event) =>
      elem.removeEventListener(
        event,
        window.TowerableEvents[customkey]?.[event]
      )
    );
    window.TowerableEvents[customkey] = { ...events };
    Object.keys(window.TowerableEvents[customkey]).forEach((event) =>
      elem.addEventListener(event, window.TowerableEvents[customkey]?.[event])
    );
  }

  function loadstart() {
    // when youtube plays next video in playlist
    // or when you click on a video in to play
    // youtube does not do a full refresh
    // instead it does a pushState with a new url
    // and because it changes only the url search
    // params the refresh does not occur.
    // youtube then procedes to put an
    // e.stopImmediatePropagation() [<-this is a guess]
    // on popstate event, so i have to listen to a
    // new load event on the video element
    markers = [];
    i = -1;
    lasttime = undefined;

    GetTimeBar()
      ?.querySelectorAll(".ylhlcn-markers")
      ?.forEach((_) => _.remove());

    var percentage_marker_css = `background-color:red; border-radius:10px;`;
    if (ADD_MARKERS_AT_PERCENTAGE)
      [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].forEach((percentage) => {
        CreateMarkerAt(
          video.duration * percentage,
          percentage_marker_css,
          false
        );
      });
  }

  var GetTimeBar = () => document.querySelector(".ytp-timed-markers-container");
  function CreateMarkerAt(time, morecss = "", keep_track = true) {
    console.log("added marker");
    // so creates new marker and then waits some time
    // when he presses `o` if i = len - 1 it will skip the last
    if (keep_track) i = markers.push(time) - 1 + 1; // just to emphasise

    const elem_marker = document.createElement("div");
    elem_marker.style.cssText = `
      background: rgba(168, 23, 220, 0.532);
      width: fit-content ;
      min-width: 15px;
      text-align:center;
      display:flex;
      flex-direction: column;
      align-items:center;
      justify-content:center;
      height: 35px ;
      z-index: ${9999 + i};
      border-radius:0px;
      position: absolute;
      top: 0px;
      transform: translate(-50%, 10px);
      scale:1;
      left: ${(100 * time) / video.duration}%;
      ${morecss}
    `.replaceAll(";", " !important;");
    elem_marker.classList.add("ylhlcn-markers");
    elem_marker.textContent = keep_track
      ? i
      : (Math.round(time * 10) / 10).toFixed(2);

    // this bug deserves a comment right here
    // It was going to the marker but using the global i
    // so it was going to the wrong time
    var index_copy = i;
    if (keep_track)
      elem_marker.onclick = () => (i = GoToMarkerByIndex(index_copy));
    else
      elem_marker.onclick = () => {
        fuckman = true;
        lasttime = undefined;
        video.currentTime = time;
      };
    GetTimeBar()?.append(elem_marker);
  }

  var fuckman = false;
  loadstart();
  TowerableEvents(
    video,
    {
      loadstart,
      seeked: () => {
        fuckman = false;
        console.log("3 | canceled fuck");
      },

      timeupdate: (e) => {
        if (fuckman) return console.log("2 | fuckman");
        if (lasttime == undefined) lasttime = video.currentTime;

        if (Math.abs(lasttime - video.currentTime) > 15)
          CreateMarkerAt(lasttime);
        lasttime = video.currentTime;
      },
    },
    "video_yt"
  );

  if (("doesnotwork", 0))
    TowerableEvents(
      window,
      {
        keydown: (e) => {
          if (
            [..."0123456789".split(""), "ArrowRight", "ArrowLeft"].includes(
              e.key
            )
          ) {
            fuckman = true;
          }
        },
      },
      "window_yt_YLHCN"
    );

  function GoToMarkerByIndex(i2) {
    if (i2 < 0) i = 0;
    if (i2 >= markers.length) i2 = markers.length - 1;

    fuckman = true;
    console.log("1 | started fuck");
    lasttime = undefined;
    video.currentTime = markers[i2];
    console.log(`[${markers.length}][${i2}]`);
    return i2;
  }
  TowerableEvents(window, {
    keydown: (e) => {
      if (e.key == ";")
        CreateMarkerAt(
          video.currentTime,
          `background:  rgba(43, 133, 21, 0.532);`
        );

      if (!markers.length) return console.warn("no markers");

      if (!"[op".includes(e.key)) return;
      if (e.key == "[") return (i = GoToMarkerByIndex(0));
      if (e.key == "]") return (i = GoToMarkerByIndex(markers.length));
      if (e.key == "o") i--;
      if (e.key == "p") i++;

      i = GoToMarkerByIndex(i);
    },
  });
};

const iid = setInterval(() => {
  if (document.querySelector("video")) {
    main();
    clearInterval(iid);
  }
}, 200);

setTimeout(() => {
  clearInterval(iid);
}, 15000);
