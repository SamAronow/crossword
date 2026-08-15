/* ------------------------------------------------------------------
   firebase-config.js
   Paste your own Firebase web-app config below (Firebase console →
   Project settings → Your apps → Web app → SDK setup → Config).
------------------------------------------------------------------ */


const firebaseConfig = {
  apiKey: "AIzaSyAT3tjP30uRMWHvmOzXKnL4UqGm4j67uaM",
  authDomain: "cross-6a36b.firebaseapp.com",
  databaseURL: "https://cross-6a36b-default-rtdb.firebaseio.com",
  projectId: "cross-6a36b",
  storageBucket: "cross-6a36b.firebasestorage.app",
  messagingSenderId: "306865043661",
  appId: "1:306865043661:web:e7c7f296880d34c0d35184",
  measurementId: "G-KB5L27L0V1"
};

firebase.initializeApp(firebaseConfig);

/* Everything lives under one key, so this can share a database with your
   other projects.

     crossword/
       puzzles/<id>     the puzzle itself: grid + clues   (rarely changes)
       rooms/<code>     one group solving one puzzle      (changes constantly)
         meta:  { puzzleId, createdAt, createdBy, startedAt, solvedAt }
         cells/ revealed/ players/

   A puzzle can have any number of rooms going at once, and they never see
   each other's letters — the grid you're typing into belongs to the room,
   not to the puzzle.
*/
const ROOT = "crossword";
const db = firebase.database();

const puzzleRef     = id   => db.ref(`${ROOT}/puzzles/${id}`);
const allPuzzlesRef = ()   => db.ref(`${ROOT}/puzzles`);
const roomRef       = code => db.ref(`${ROOT}/rooms/${code}`);
const allRoomsRef   = ()   => db.ref(`${ROOT}/rooms`);

/* Room codes people have to read aloud and type, so no O/0 or I/1. */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;

function randomRoomCode() {
  let out = "";
  const bytes = new Uint32Array(CODE_LENGTH);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < CODE_LENGTH; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  return out;
}

function tidyRoomCode(raw) {
  return (raw || "").toUpperCase().split("")
    .filter(ch => CODE_ALPHABET.includes(ch))   // drops spaces, dashes, typos
    .join("").slice(0, CODE_LENGTH);
}

/* Claims an unused code. Retries on the (very unlikely) collision. */
async function createRoom(puzzleId, solverId) {
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = randomRoomCode();
    const snap = await roomRef(code).child("meta").once("value");
    if (snap.exists()) continue;
    await roomRef(code).child("meta").set({
      puzzleId,
      createdBy: solverId,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    });
    return code;
  }
  throw new Error("Couldn't find a free room code");
}

/* Rooms this browser has been in, newest first — so you don't have to keep
   the code written down to get back to a puzzle you were part way through. */
function rememberRoom(code, puzzleId) {
  const list = recentRooms().filter(r => r.code !== code);
  list.unshift({ code, puzzleId, at: Date.now() });
  localStorage.setItem("cw:rooms", JSON.stringify(list.slice(0, 12)));
}

function recentRooms() {
  try { return JSON.parse(localStorage.getItem("cw:rooms")) || []; }
  catch (e) { return []; }
}

function forgetRoom(code) {
  localStorage.setItem("cw:rooms", JSON.stringify(recentRooms().filter(r => r.code !== code)));
}

// Server-clock offset, so the shared timer agrees across computers.
let serverOffset = 0;
db.ref(".info/serverTimeOffset").on("value", s => { serverOffset = s.val() || 0; });
const serverNow = () => Date.now() + serverOffset;

// A stable per-browser identity, so we can colour each solver's letters
// and show who is currently in the puzzle.
/* Blue is spoken for — it's what a confirmed-correct letter looks like — so no
   solver colour is blue, and the first ones handed out are the furthest from
   it. */
const SOLVER_COLORS = [
  "#7c3aed",  // violet
  "#e11d48",  // rose
  "#059669",  // green
  "#ea580c",  // orange
  "#a16207",  // ochre
  "#be185d"   // magenta
];

function loadSolver() {
  let id = localStorage.getItem("cw:id");
  if (!id) {
    id = "s" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("cw:id", id);
  }
  let name = localStorage.getItem("cw:name");
  if (!name) {
    name = "Solver " + id.slice(1, 4).toUpperCase();
    localStorage.setItem("cw:name", name);
  }
  let color = localStorage.getItem("cw:color");
  if (color && SOLVER_COLORS.indexOf(color) === -1) color = null;   // retired blue
  if (!color) {
    color = SOLVER_COLORS[Math.floor(Math.random() * SOLVER_COLORS.length)];
    localStorage.setItem("cw:color", color);
  }
  return { id, name, color };
}

function saveSolverName(name) {
  localStorage.setItem("cw:name", name);
}