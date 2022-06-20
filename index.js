const worddisplay = document.getElementById("worddisplay");
const imgdisplay = document.getElementById("hangimg");
const buttoncontainer = document.getElementById("buttoncontainer");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let buttonElements = {};

async function getWords() {
  let res = await fetch("./res/words.txt");
  let text = await res.text();
  let words = text
    .split("\n")
    .map((e) => e.trim().toUpperCase())
    .filter((e) => e.length != 0);
  return words;
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let step = 0; // 0 = beginning, 5 = death
let word = "";
let wordmask = [];

function updateDisplays() {
  imgdisplay.setAttribute("src", `images/hang${step}.png`);
  worddisplay.innerHTML = word
    .split("")
    .map((el, i) => (wordmask[i] ? (el == " " ? "&nbsp;" : el) : "_"))
    .join(" ");
}

function resetButtons() {
  buttonElements = {};
  buttoncontainer.innerHTML = "";
  for (let l of letters) {
    let button = document.createElement("button");
    button.innerText = l;
    button.classList.add("letterbtn");
    button.addEventListener("click", () => {
      onButtonPress(l);
    });
    buttonElements[l] = button;
    buttoncontainer.appendChild(button);
  }
}

function onButtonPress(l) {
  buttonElements[l].setAttribute("disabled", true);
  console.log(l);
  let revealedByL = 0;
  for (let i = 0; i < word.length; i++) {
    const letterInWord = word[i];
    if (letterInWord == l) {
      wordmask[i] = true;
      revealedByL++;
    }
  }
  if (revealedByL <= 0) {
    step += 1;
  }
  updateDisplays();
  checkIfLostOrWon();
}

let winorlossstep = 0;
function checkIfLostOrWon() {
  if (step >= 5) {
    setInterval(() => {
      let picname = `images/loss${winorlossstep}.png`;
      imgdisplay.setAttribute("src", picname);
      winorlossstep = (winorlossstep + 1) % 12;
    }, 120);
    buttoncontainer.innerHTML = `
    <h1>
    You lost! The word was <span class="rightspan">${word}</span> <br>You are
    a sucky loser!<br><br>
    <button class="endbutton" onclick="window.location.reload()">
    Replay
  </button>
  </h1>`;
  }
  if (wordmask.every((e) => e == true)) {
    setInterval(() => {
      let picname = `images/win${winorlossstep}.png`;
      imgdisplay.setAttribute("src", picname);
      winorlossstep = (winorlossstep + 1) % 3;
    }, 120);
    buttoncontainer.innerHTML = `
    <h1>
    You won! Your Mom is proud of you!<br><br>
    <button class="endbutton" onclick="window.location.reload()">
    Replay
  </button>
  </h1>`;
  }
}

async function main() {
  let words = await getWords();
  step = 0;
  word = choice(words);
  console.log(word);
  wordmask = word.split("").map((el) => el == " " || el == word[0]);

  updateDisplays();
  resetButtons();
}

/////////////////////////////////////////////////////////
// Execution
main();
