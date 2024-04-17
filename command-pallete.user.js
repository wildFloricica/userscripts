// ==UserScript==
// @name        all: *! command pallete
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 8/7/2023, 7:59:11 AM
// ==/UserScript==

// make function so that commands can display informations
// like the youtube like  user script should be able to show
// the state of the like button
(() => {
  if (window.noCP) return console.log("no cp");
  // CSS
  // CSS
  // CSS
  const style = document.createElement("style");
  style.textContent = `

.namespace-ylhlcn .hide,
.namespace-ylhlcn.hide {
  display: none;
}

.namespace-ylhlcn > .ocupy-whole-screen {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999999;
  top: 0;
  left: 0;
  /* background-color: #000000c3; */
  background-color: transparent;
}

.namespace-ylhlcn .command-pallete {
  position: absolute;
  top: 10%;
  width: 80%;
  left: 50%;
  max-width: 600px;
  transform: translateX(-50%);
  border: 1px solid aliceblue;
  padding: 7px 14px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(18, 18, 22);
  /* width: 100%; */
  font-size: 1.5rem;
  min-height: 40%;
}

.namespace-ylhlcn .ylhlcn-header{
  display:flex;
  width:100%;
  align-items:center;
}

.namespace-ylhlcn .ylhlcn-header [type="checkbox"]{
  width: 1.5rem;
  height:1.5rem;
}

.namespace-ylhlcn .search {
  background-color: rgb(36, 35, 39);
  text-align: center;
  padding: 8px 16px;
  width: 90%;
  font-size: 1.5rem;
  color: aliceblue;
  outline: none;
  border: none;
  flex-grow:1;
}

.namespace-ylhlcn * {
  transition: 0.5s;
}

.namespace-ylhlcn .toggles-wrapper{
  display: flex;
  flex-wrap: wrap;
  background: #847600;
  color: #4f084f;
}
.namespace-ylhlcn .toggles-wrapper input{
  accent-color: #00cfff;
  width: 1rem;
  height: 1rem;
}

.namespace-ylhlcn .commands-wrapper {
  padding: 8px 10px;
  color: white;
}
.namespace-ylhlcn .commands-wrapper > * {
  transition: none;
  margin: 0;
  color: white !important;
  padding: 8px 10px;
  border-radius: 5px;
}
.namespace-ylhlcn .commands-wrapper > *:hover {
  color: black;
  background-color: #9b9b9b;
}

.namespace-ylhlcn .kbd-focus {
  background-color: #002d81 !important;
  color: white !important;
}


`;
  document.head.append(style);

  // HTML
  // HTML
  // HTML

  const __namespace = document.createElement("div");
  __namespace.classList.add("namespace-ylhlcn", "hide");
  __namespace.innerHTML = `
<div class="ocupy-whole-screen">
  <div class="command-pallete">
    <div class="ylhlcn-header">
      <input type="checkbox" id="autoclose" />
      <input class="search" type="text" placeholder="Type to search" />
    </div>
    <div class="toggles-wrapper"></div>
    <div class="commands-wrapper"></div>
  </div>
</div>
`;
  document.body.append(__namespace);

  // DEP
  // DEP
  // DEP

  function satisfies(obj1, obj2) {
    const keys = Object.keys(obj1);
    for (const key of keys) if (obj1[key] != obj2[key]) return false;
    return true;
  }

  const BreakIntoWords = (text) => text.split(" ");
  const BreakSnakeCase = (text) => text.split("_");
  const BreakCamelAndPascalCase = (text) => {
    const b = [""];
    for (const i in text) {
      if (i == 0) b[0] += text[i];
      else if (text[i].toUpperCase() == text[i]) b.push(text[i]);
      else b[b.length - 1] += text[i];
    }
    return b;
  };
  const BreakAllCases = (text) => {
    var words = BreakIntoWords(text);
    words = words.flatMap(BreakSnakeCase, 2);
    return words.flatMap(BreakCamelAndPascalCase, 2);
  };

  // @problems
  // 1. matching at middle of word does not work
  // 2. query= "anare"  list= ["ana", "are", "mere"]
  // maybe it will dissapear if we solve issue nr1
  // the issue is that it thinks: "oho: ana + re"
  // and re does not match any start of any word (as per issue nr1)
  // so it returns: not matching
  function PotentialMatch(query, list, caseinsensitive = false) {
    if (caseinsensitive) {
      query = query.toLowerCase();
      list = list.map((it) => it.toLowerCase());
    }

    let sacrifice = Array.from(query);
    for (let word of list) {
      let index = 0;
      let matchedOnce = null;
      for (let i in word) {
        if (matchedOnce != null && word[i] != sacrifice[i - matchedOnce || 0])
          break;
        else if (word[i] == sacrifice[i - matchedOnce || 0]) {
          if (matchedOnce != 0 && !matchedOnce) matchedOnce = i;
          index++;
        }
      }
      sacrifice = sacrifice.slice(index);
    }
    return !sacrifice.length;
  }

  function unsigned_wrap(num, max) {
    if (num > max) return (num % max) - 1;
    if (num >= 0) return num;

    return unsigned_wrap(max + num + 1, max);
  }

  function RemoveClass(c) {
    document.querySelector("." + c).classList.remove(c);
  }
  function RemoveClassAll(c) {
    document.querySelectorAll("." + c).forEach((el) => el.classList.remove(c));
  }

  // LIB
  // LIB
  // LIB

  const ylhlcn = document.querySelector(".namespace-ylhlcn");
  const overlay = ylhlcn.querySelector(".ocupy-whole-screen");
  const pallete = ylhlcn.querySelector(".command-pallete");
  const inpSearch = ylhlcn.querySelector(".search");
  const toggles_wrapper = ylhlcn.querySelector(".toggles-wrapper");
  const commands_wrapper = ylhlcn.querySelector(".commands-wrapper");
  const autoclose = ylhlcn.querySelector("#autoclose");

  if (JSON.parse(localStorage.getItem("ylhlcn:command-pallete:autoclose")))
    autoclose.checked = true;
  autoclose.oninput = () =>
    localStorage.setItem(
      "ylhlcn:command-pallete:autoclose",
      JSON.stringify(autoclose.checked)
    );
  const commands = [];
  const toggles = [];
  var currCommands = commands;

  var indexFocus = 0;

  inpSearch.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      commands_wrapper.children[indexFocus]?.click();
      e.stopImmediatePropagation();
    }
  });
  inpSearch.addEventListener("input", (e) => {
    if (inpSearch.value == "") return RenderCommands([...currCommands]);

    if (ylhlcn.classList.contains("hide")) return;

    const newCommands = currCommands
      .filter((it) => {
        const l = it.title.toLowerCase();
        const t = it.title;
        const ql = inpSearch.value.toLowerCase();

        const part1 = l.startsWith(ql);
        const part2 = PotentialMatch(ql, BreakAllCases(t), true);
        return part1 || part2;
      })
      .sort((a, b) => b.score - a.score);
    // if we have no match let the plan b = get the 5 commands with the most character in common
    // having a system like on google with taking into account the ussual mistypes based on keyboard
    // language(type/layout) is too hard and not resally needed now

    RenderCommands(newCommands);
  });

  function focusCommand(index) {
    RemoveClassAll("kbd-focus");
    indexFocus = index;
    commands_wrapper.children[index]?.classList.add("kbd-focus");
  }

  var lastFocus = undefined;
  function HideCmpl() {
    ylhlcn.classList.add("hide");
    lastFocus.focus();
    lastFocus = undefined;
  }
  function ShowCmpl() {
    ylhlcn.classList.remove("hide");
    if (!lastFocus) lastFocus = document.activeElement;
    inpSearch.focus();
    RenderCommands(commands, true);
  }
  function toggleCmpl() {
    ylhlcn.classList.contains("hide") ? ShowCmpl() : HideCmpl();
  }
  overlay.addEventListener("click", (eve) => {
    if (!eve.target.closest(".command-pallete")) HideCmpl();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowDown")
      focusCommand(unsigned_wrap(indexFocus + 1, currCommands.length - 1));

    if (e.key == "ArrowUp")
      focusCommand(unsigned_wrap(indexFocus - 1, currCommands.length - 1));

    if (satisfies({ key: "F1" }, e)) {
      e.preventDefault();
      toggleCmpl();
    }

    if (satisfies({ key: "Escape" }, e)) HideCmpl();
  });

  function RenderCommands(_, keep = false) {
    if (keep) currCommands = _;
    commands_wrapper.innerHTML = "";

    _.forEach((cmd) => {
      cmd.score =
        JSON.parse(
          localStorage.getItem("ylhlcn:command-pallete" + cmd.title)
        ) || 0;
    });

    _.sort((a, b) => b.score - a.score).forEach((cmd) => {
      const p = document.createElement("p");
      p.textContent = cmd.title + " score: " + cmd.score;
      p.addEventListener("click", () => {
        inpSearch.value = "";
        cmd.score++;
        localStorage.setItem(
          "ylhlcn:command-pallete" + cmd.title,
          JSON.stringify(cmd.score)
        );
        cmd.action();
        if (cmd?.autoclose == "automatic") {
          if (autoclose.checked) return toggleCmpl();
        } else if (cmd?.autoclose == "force") {
          return toggleCmpl();
        }
        RenderCommands(cmd.subcommands || commands, true);
      });

      commands_wrapper.append(p);
      focusCommand(0);
    });
  }
  const RegisterCommand = (a) => {
    commands.push(a);
  };
  window.RegisterCommand = RegisterCommand;
  window.RegisterToggle = RegisterToggle;

  function RegisterToggle(toggle) {
    toggles.push(toggle); // this does nothing maybe i shoouuld remove it
    const label = document.createElement("label");
    label.htmlFor = crypto.randomUUID();
    label.textContent = toggle.textContent;
    const inp = document.createElement("input");
    inp.id = label.htmlFor;
    inp.type = "checkbox";
    inp.oninput = toggle.cb;
    label.append(inp);
    toggles_wrapper.append(label);
  }
  // MAIN
  // MAIN
  // MAIN

  RegisterCommand({
    title: "Format document With",
    action: () => {},
    autoclose: "automatic/force/none - is default",
    subcommands: [
      { title: "Prettier", action: () => {} },
      { title: "Black Formater", action: () => {} },
      {
        title: "Configure Default Formater",
        action: () => {},
        subcommands: [
          { title: "Prettier", action: () => {} },
          { title: "Black Formater", action: () => {} },
        ],
      },
    ],
  });

  RegisterCommand(
    (() => {
      return {
        title: "Time Spent Calculator: Toggle Vission ON/OFF",
        action: () => window.TimeSpend.ToggleCalculate(),
      };
    })()
  );
  RegisterCommand(
    (() => {
      var data = [
        "today will be sunny",
        "hello my friend how are you",
        "luv u",
      ];

      return {
        title: "console log a random happy message",
        action: () => {
          console.log(data[Math.round(Math.random() * (data.length - 1))]);
        },
      };
    })()
  );
  RegisterToggle({
    textContent: "::Enjoying yourself::",
    cb: (evee) => console.log(evee.target.checked ? "Yes sir :))))" : "No :(("),
  });

  const PACKAGE_NAME = "command-pallete";
  window[PACKAGE_NAME] = { RegisterCommand, RegisterToggle };
  window.dispatchEvent(new CustomEvent("ylhlcn:" + PACKAGE_NAME));
})();
