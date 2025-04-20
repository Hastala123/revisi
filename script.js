const words = [
  { word: "apple", category: "little fruit" },
  { word: "Melon", category: "big fruit" },
  { word: "Table", category: "class furniture"},
  { word: "piano", category: "music instrument" },
  { word: "tiger", category: "predatory animal" },
  { word: "beach", category: "place with water" },
  { word: "cloud", category: "sky object" },
  { word: "Manga", category: "Japanese Comic" },
  { word: "Ivory", category: "Elephant body part" },
  { word: "Mouse", category: "Little annoying animal" },
  { word: "Eagle", category: "flying animal" },
  { word: "wushu", category: "China Martial Art"},
  { word: "Board", category: "class furniture"},
  { word: "Earth", category: "Our planet" },
  { word: "shark", category: "Sea predatory animal" },
  { word: "pasta", category: "Italia Noodle" },
  { word: "teeth", category: "human body part" },
  { word: "cable", category: "long computer part" },
  { word: "money", category: "modern transaction thing" },
  { word: "Whale", category: "biggest fish in the sea" },
  { word: "spoon", category: "tool to eat soup" },
  { word: "sweet", category: "flavour of sugar" },
  { word: "ASEAN", category: "set of South East Asian Nation"},
  { word: "phone", category: "communication modern technology" },
  { word: "flood", category: "disasters with a large amount of water" },
  { word: "blood", category: "human most important liquid" },
  { word: "snaps", category: " green vegetable" },
  { word: "grape", category: "wine common ingridients" },
  { word: "knive", category: "sharp object in kitchen"},
  { word: "blade", category: "sharp long metal" },
  { word: "glass", category: "mirror material" },
  { word: "shoes", category: "foot protector" },
  { word: "snake", category: "crawling animal" },
  { word: "study", category: "reason to school" },
  { word: "arrow", category: "bow release this thing" },
  { word: "smoke", category: "gasoline vehicle emissions"},
  { word: "white", category: "colour of cloud" },
  { word: "India", category: "South Asia Nation" },
  { word: "chalk", category: "class furniture"},
  { word: "chili", category: "spicy ingridient" },
  { word: "heart", category: "human vital organ" },
  { word: "brain", category: "human head organ" },
  { word: "plane", category: "sky transportation" },
  { word: "queen", category: "leader of kingdom" },
  { word: "rusia", category: "Europe Nation" },
  { word: "zebra", category: "Africa animal" },
];

let selectedWord = "";
let inputs = [];
let currentRow = 0;
let hintsLeft = 3;
const maxAttempts = 6;

const gameBoard = document.getElementById("gameBoard");
const hintListDiv = document.getElementById("hintList");

function startGame() {
  currentRow = 0;
  inputs = [];
  gameBoard.innerHTML = "";
  hintListDiv.innerHTML = "";

  selectedWord = words[Math.floor(Math.random() * words.length)];
  const wordLength = selectedWord.word.length;

  // Show category as extra hint
  const categoryHint = document.createElement("p");
  categoryHint.textContent = ` Category: ${selectedWord.category}`;
  hintListDiv.appendChild(categoryHint);

  // Create input grid
  for (let r = 0; r < maxAttempts; r++) {
    const row = [];
    for (let c = 0; c < wordLength; c++) {
      const input = document.createElement("input");
      input.maxLength = 1;
      input.classList.add("letter-input");
      input.disabled = true;
      gameBoard.appendChild(input);
      row.push(input);

      // Input event
      input.addEventListener("input", (e) => {
        if (r !== currentRow) {
          e.target.value = "";
          return;
        }

        e.target.value = e.target.value[0]?.toUpperCase() || "";

        if (e.target.value.length > 0) {
          // Move to next input
          let nextCol = c + 1;
          while (nextCol < wordLength && row[nextCol].disabled) nextCol++;

          if (nextCol < wordLength) {
            row[nextCol].focus();
          }

          // Auto-submit if filled
          const filled = row.filter(i => i.disabled || i.value.trim()).length;
          if (filled === wordLength) {
            submitGuess();
          }
        }
      });
    }
    inputs.push(row);
  }

  // Auto-fill 2 hint letters
  let hintIndexes = [];
  while (hintIndexes.length < 2) {
    const rand = Math.floor(Math.random() * wordLength);
    if (!hintIndexes.includes(rand)) hintIndexes.push(rand);
  }

  hintIndexes.forEach((idx, i) => {
    const input = inputs[0][idx];
    input.value = selectedWord.word[idx].toUpperCase();
    input.disabled = true;
    const hintText = document.createElement("p");
    hintText.textContent = `🟡 Hint ${i + 1}: Letter ${idx + 1} is "${selectedWord.word[idx].toUpperCase()}"`;
    hintListDiv.appendChild(hintText);
  });

  // Enable only the editable inputs in first row
  inputs[0].forEach((input, i) => {
    if (!hintIndexes.includes(i)) input.disabled = false;
  });

  // Focus first available
  const firstEditable = inputs[0].find(i => !i.disabled);
  if (firstEditable) firstEditable.focus();

  // Reset hints left
  hintsLeft = 1;
  document.getElementById("hintsLeft").textContent = hintsLeft;
}

function submitGuess() {
  const rowInputs = inputs[currentRow];
  const guess = rowInputs.map(input => input.value.toLowerCase()).join("");

  if (guess.length !== selectedWord.word.length) return;

  if (guess === selectedWord.word) {
    rowInputs.forEach(input => input.classList.add("correct"));
    alert(" Correct! You win!");
    disableInputs();
    return;
  } else {
    rowInputs.forEach((input, i) => {
      if (input.disabled) return;
      input.classList.add(
        input.value.toLowerCase() === selectedWord.word[i] ? "correct" : "wrong"
      );
    });
  }

  currentRow++;
  if (currentRow >= maxAttempts) {
    alert(`❌ Out of attempts! The word was "${selectedWord.word.toUpperCase()}"`);
    disableInputs();
    return;
  }

  // Enable next row
  inputs[currentRow].forEach(input => input.disabled = false);
  const nextFocus = inputs[currentRow].find(i => !i.disabled);
  if (nextFocus) nextFocus.focus();
}

function deleteLastLetter() {
  const row = inputs[currentRow];
  for (let i = row.length - 1; i >= 0; i--) {
    if (!row[i].disabled && row[i].value !== "") {
      row[i].value = "";
      row[i].focus();
      break;
    }
  }
}

function showHint() {
  if (hintsLeft <= 0) {
    alert("No more hints!");
    return;
  }

  hintsLeft--;
  document.getElementById("hintsLeft").textContent = hintsLeft;

  const vowelCount = selectedWord.word.match(/[aeiou]/gi)?.length || 0;
  const hint = document.createElement("p");
  hint.textContent = `🟢 Hint: Starts with "${selectedWord.word[0].toUpperCase()}", contains ${vowelCount} letter.`;
  hintListDiv.appendChild(hint);
}

function disableInputs() {
  inputs.flat().forEach(input => input.disabled = true);
}

window.onload = startGame;
