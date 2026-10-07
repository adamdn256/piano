// Frequencies for the eight piano notes: C D E F G A B C
const notes = {
  a: 262,
  s: 294,
  d: 330,
  f: 349,
  g: 392,
  h: 440,
  j: 494,
  k: 523
};

const keys = document.querySelectorAll(".key");
const lastNote = document.querySelector("#last-note");

// Create the Web Audio API context.
const ctx = new (window.AudioContext || window.webkitAudioContext)();

// Play a short musical note.
function playNote(frequency) {
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.frequency.value = frequency;
  osc.type = "sine";

  osc.connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  osc.start();
  osc.stop(ctx.currentTime + 0.4);
}

// Find a piano key and make it active.
function pressKey(key) {
  const pianoKey = document.querySelector(`[data-key="${key}"]`);

  // Ignore keys that are not part of the piano.
  if (!pianoKey) return;

  pianoKey.classList.add("active");
  playNote(notes[key]);

  lastNote.textContent = `Last note: ${pianoKey.dataset.note}`;
}

// Keyboard press: light up the key and play the note.
document.addEventListener("keydown", function (e) {
  const key = e.key.toLowerCase();

  // Do not play the same note repeatedly while a key is held down.
  if (e.repeat) return;

  pressKey(key);
});

// Keyboard release: remove the active style.
document.addEventListener("keyup", function (e) {
  const key = e.key.toLowerCase();
  const pianoKey = document.querySelector(`[data-key="${key}"]`);

  if (!pianoKey) return;

  pianoKey.classList.remove("active");
});

// Bonus: allow the piano to be played with the mouse.
keys.forEach(function (pianoKey) {
  pianoKey.addEventListener("mousedown", function () {
    pressKey(pianoKey.dataset.key);
  });

  pianoKey.addEventListener("mouseup", function () {
    pianoKey.classList.remove("active");
  });

  pianoKey.addEventListener("mouseleave", function () {
    pianoKey.classList.remove("active");
  });
});
