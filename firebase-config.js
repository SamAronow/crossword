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
       puzzles/<id>   the puzzle itself: grid + clues   (rarely changes)
       solves/<id>    what people have typed into it    (changes constantly)
*/
const ROOT = "crossword";
const db = firebase.database();

const puzzleRef     = id => db.ref(`${ROOT}/puzzles/${id}`);
const allPuzzlesRef = ()  => db.ref(`${ROOT}/puzzles`);
const solveRef      = id => db.ref(`${ROOT}/solves/${id}`);

// Server-clock offset, so the shared timer agrees across computers.
let serverOffset = 0;
db.ref(".info/serverTimeOffset").on("value", s => { serverOffset = s.val() || 0; });
const serverNow = () => Date.now() + serverOffset;

// A stable per-browser identity, so we can colour each solver's letters
// and show who is currently in the puzzle.
const SOLVER_COLORS = ["#7c3aed", "#0891b2", "#059669", "#db2777", "#ea580c", "#4f46e5"];

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
  if (!color) {
    color = SOLVER_COLORS[Math.floor(Math.random() * SOLVER_COLORS.length)];
    localStorage.setItem("cw:color", color);
  }
  return { id, name, color };
}

function saveSolverName(name) {
  localStorage.setItem("cw:name", name);
}
