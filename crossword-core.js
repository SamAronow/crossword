/* ------------------------------------------------------------------
   crossword-core.js
   Turning a stored puzzle record into a grid with numbered entries.
   Shared by puzzle.html (solving) and new.html (building).

   Stored record shape — this is the whole template:

     {
       "title":      "Mini No. 1",
       "byline":     "Sam",
       "difficulty": "Easy",
       "grid":       "RUB..\nUSED.\nMELON\n.ROSE\n..WET",
       "clues": {
         "across": { "1": "Massage, as a sore shoulder", ... },
         "down":   { "1": "Spirit in a daiquiri", ... }
       },
       "createdAt": 1723600000000
     }

   In the grid, a letter is the answer for that square and "." is a black
   square. Rows are separated by newlines (an array of row strings is
   accepted too). Clue keys are the square numbers, which are computed
   from the grid — you never store them.
------------------------------------------------------------------ */

function normalizePuzzle(id, raw) {
  if (!raw) return null;

  let grid = raw.grid;
  if (typeof grid === "string") grid = grid.split(/\r?\n/);
  else if (grid && !Array.isArray(grid)) {
    grid = Object.keys(grid).sort((a, b) => a - b).map(k => grid[k]);
  }
  grid = (grid || [])
    .map(row => String(row).toUpperCase().replace(/[^A-Z.]/g, ""))
    .filter(row => row.length);

  const clues = raw.clues || {};
  return {
    id,
    title: raw.title || id,
    byline: raw.byline || "",
    difficulty: raw.difficulty || "",
    grid,
    clues: { across: clues.across || {}, down: clues.down || {} },
    createdAt: raw.createdAt || null
  };
}

function serializePuzzle(p) {
  return {
    title: p.title || p.id,
    byline: p.byline || "",
    difficulty: p.difficulty || "",
    grid: p.grid.join("\n"),
    clues: { across: p.clues.across || {}, down: p.clues.down || {} },
    createdAt: p.createdAt || firebase.database.ServerValue.TIMESTAMP
  };
}

/* Returns null if the grid isn't usable, otherwise the reason-free model. */
function gridProblem(grid) {
  if (!grid || !grid.length) return "Add some rows to the grid.";
  const w = grid[0].length;
  if (w < 2) return "Rows need at least two squares.";
  const bad = grid.findIndex(row => row.length !== w);
  if (bad > -1) return `Row ${bad + 1} has ${grid[bad].length} squares, but row 1 has ${w}.`;
  if (!grid.some(row => /[A-Z]/.test(row))) return "Every square is black.";
  return null;
}

function buildModel(p) {
  const rows = p.grid.length, cols = p.grid[0].length;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    cells[r] = [];
    for (let c = 0; c < cols; c++) {
      const ch = p.grid[r][c];
      cells[r][c] = {
        r, c,
        black: ch === ".",
        solution: ch === "." ? null : ch.toUpperCase(),
        number: null, across: null, down: null, el: null
      };
    }
  }
  const open = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols && !cells[r][c].black;
  const entries = { across: [], down: [] };
  let num = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c].black) continue;
      const startsAcross = !open(r, c - 1) && open(r, c + 1);
      const startsDown   = !open(r - 1, c) && open(r + 1, c);
      if (!startsAcross && !startsDown) continue;
      cells[r][c].number = num;
      if (startsAcross) {
        const list = [];
        for (let cc = c; open(r, cc); cc++) list.push(cells[r][cc]);
        entries.across.push({ dir: "across", num, cells: list, clue: (p.clues.across || {})[num] || "" });
      }
      if (startsDown) {
        const list = [];
        for (let rr = r; open(rr, c); rr++) list.push(cells[rr][c]);
        entries.down.push({ dir: "down", num, cells: list, clue: (p.clues.down || {})[num] || "" });
      }
      num++;
    }
  }
  entries.across.forEach(e => e.cells.forEach(cell => cell.across = e));
  entries.down.forEach(e => e.cells.forEach(cell => cell.down = e));

  const openCells = [];
  cells.forEach(row => row.forEach(cell => { if (!cell.black) openCells.push(cell); }));

  return { rows, cols, cells, entries, openCells, order: [...entries.across, ...entries.down] };
}

const entryAnswer = e => e.cells.map(cell => cell.solution).join("");

/* The puzzle new.html offers as a starting point. */
const SAMPLE_PUZZLE = {
  id: "mini-1",
  title: "Mini No. 1",
  byline: "Test puzzle",
  difficulty: "Easy",
  grid: ["RUB..", "USED.", "MELON", ".ROSE", "..WET"],
  clues: {
    across: {
      1: "Massage, as a sore shoulder",
      4: "Pre-owned",
      6: "Cantaloupe or honeydew",
      8: "Bouquet flower with thorns",
      9: "Like a towel after a shower"
    },
    down: {
      1: "Spirit in a daiquiri",
      2: "One with a login",
      3: "Underneath",
      5: "Amount of medicine to take",
      7: "Tennis court divider"
    }
  }
};
