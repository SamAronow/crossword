# Crossword — shared solving

A crossword you solve with other people in real time. Vanilla HTML and
JavaScript on Firebase Realtime Database — no build step, no framework, no
server of your own. Puzzles live in the database rather than in the code.

```
index.html             home page — lists whatever puzzles are in the database
rooms.html?id=...      start a room, or type in someone's code
puzzle.html?room=...   the solver, for one room
new.html               build and save a puzzle (opens with the sample filled in)
import.html            drop in .puz / .ipuz files from other sites
add-puzzles.html       one button: adds whatever is queued in add-puzzles.js
add-puzzles.js         the queue — paste puzzle JSON here
crossword-core.js      record shape, grid validation, square numbering
firebase-config.js     your Firebase config + the database paths
```

All eight files sit in one flat folder. There's no `puzzles.js` any more — if
one is left over from an early version, delete it.

## Setup

**1. Paste your Firebase web config** into `firebase-config.js`. Everything the
app writes lives under a single `crossword` key, so it can share a database with
your other projects.

**2. Set the database rules:**

```json
{
  "rules": {
    "crossword": {
      ".read": true,
      ".write": true
    }
  }
}
```

Anyone with the URL can read and write that subtree. That's the point — no
accounts, no login, just send someone a link — but it does mean *anyone* with
the URL. If you ever want it tighter, the usual move is anonymous auth plus
`".write": "auth != null"`.

**3. Serve the folder** — `python3 -m http.server 8000` — and open
`http://localhost:8000`. Make a puzzle in `new.html`, or queue some in
`add-puzzles.js` and press the button on `add-puzzles.html`. Opening the files
directly with `file://` mostly works, but a local server behaves more like the
real thing.

For solving with someone on another computer, push the folder to a repo and
deploy to Vercel. It's all static; there's nothing to configure.

## Rooms

A puzzle by itself is just a grid and clues. The typing happens in a **room**.

Click a puzzle and you're asked to start a room or enter a code. Starting one
mints a five-character code like `K7QTM`; anyone who types it in lands in your
grid, and the link `puzzle.html?room=K7QTM` is all they need — a room knows
which puzzle it belongs to. Two rooms on the same puzzle never see each other's
letters, so you and a friend can work one grid while someone else works another,
untouched.

Codes skip `O`/`0` and `I`/`1` so they survive being read aloud, and the code
box quietly drops spaces, dashes, and anything that isn't a code character. The
room code in the header doubles as a copy-link button. `rooms.html` also lists
rooms this browser has been in, with live progress on each, so a half-finished
grid isn't lost just because nobody wrote the code down.

Old `puzzle.html?id=…` links still work — they redirect to that puzzle's room
picker.

## How the syncing works

```
crossword/
  puzzles/<id>          the puzzle itself       (rarely changes)
    title:      "Mini No. 1"
    byline:     "Test puzzle"
    difficulty: "Easy"
    grid:       "RUB..\nUSED.\nMELON\n.ROSE\n..WET"
    clues:      { across: { "1": "Massage, as a sore shoulder", … },
                  down:   { "1": "Spirit in a daiquiri", … } }
    createdAt:  1723600000000

  rooms/<code>          one group solving one puzzle  (changes constantly)
    meta:           { puzzleId, createdAt, createdBy, startedAt, solvedAt }
    cells/2_3:      { l: "O", by: "s8fk2a", cl: "#7c3aed", at: 1723… }
    revealed/2_3:   true
    locked/2_3:     true          confirmed correct — frozen
    wrong/2_3:      true          checked and wrong
    players/s8fk2a: { name, color, r, c, dir, ts }
```

**One square, one database key.** Two people typing in different squares never
collide; the same square is last-write-wins. Each page attaches
`child_added` / `child_changed` / `child_removed` listeners to the room's
`cells`, so a letter shows up on everyone else's screen as it's typed. Your own
typing paints immediately and the listener just confirms it, so there's no lag
on your own keystrokes.

**Presence** is `players`, cleaned up by `onDisconnect().remove()` plus a
25-second heartbeat. Other solvers show up as coloured rings on the square
they're sitting in, initials in the header, and their letters appear in their
colour.

**The timer is shared** — it starts on the first letter anyone types and stops
when the grid is complete and correct.

**Puzzles and rooms are separate on purpose.** Clearing a grid empties that one
room and never touches the puzzle or any other room. `meta.puzzleId` is what
ties a room to its puzzle, so Clear leaves that key alone. Deleting
`rooms/<code>` in the Firebase console removes a room; deleting a puzzle while
rooms point at it doesn't lose their letters — re-add the puzzle and those rooms
come back to life.

## Adding puzzles

**`new.html`** is the builder. Type or paste a grid and the numbered preview and
one clue field per entry — each labelled with its answer — appear as you type.
Square numbers are computed from the grid and never stored, which is why you
never number clues by hand. It refuses to save ragged rows and warns about empty
clues. Any rectangle works; 15×15 is the same data shape as 5×5.

In a grid, a letter is that square's answer and `.` is a black square.

**`import.html`** takes puzzle files. Drop `.puz` (Across Lite) or `.ipuz` files
on it — or click to pick them — and it parses them in the browser and writes them
to `crossword/puzzles/<id>`. Title and author come from the file, circled squares
come across, and each puzzle gets an editable name before you commit. Nothing is
uploaded anywhere; the file is read locally and goes straight to your database.

Rebus squares and scrambled puzzles are refused with a reason rather than
half-imported.

Sources worth knowing: brendanemmettquigley.com posts free .puz twice a week,
crosshare.org hosts thousands of community puzzles, and `xword-dl` fetches .puz
from USA Today, Universal, LA Times, WSJ, Washington Post, Newsday, the New
Yorker and the Atlantic. NYT dropped .puz support in 2021, so it isn't a source.

**`add-puzzles.html`** is the bulk route: paste puzzle JSON objects into the
`QUEUED` array in `add-puzzles.js` and press the button.

Each queued puzzle gets an **editable name field**, defaulting to the first
unused `Puzzle N` — it skips numbers already in the database. The id is slugged
from whatever you type (`Sunday Themer` → `sunday-themer`), shown live under the
field, and flagged if it would replace an existing puzzle. The title from the
file, if there is one, is shown underneath so you can copy it.

Puzzles are given as JSON in this shape —

```js
{
  title: "Thursday Themed",        // optional
  grid: [
    ["A","P","E","S","black"],     // "black" marks a black square
    ...
  ],
  clues: {
    across: [ { number: 1, clue: "\"Planet of the ___\"", answer: "APES" }, … ],
    down:   [ { number: 1, clue: "Spanish love",          answer: "AMOR" }, … ]
  },
  circles: [0,0,1, …]              // optional, row-major, 1 = circled square
}
```

Rows of strings (`"APES."`) and clues as a plain map (`{ 1: "clue text" }`) are
still accepted, and mixing shapes in one queue is fine.

**Renaming.** Hover a puzzle on the home page and a Rename button appears; the
title becomes an editable field, Enter saves and Escape cancels. Only the title
changes — the id stays put, so existing links and rooms keep working.

Each queued puzzle is checked before anything is written, and the page shows a
tick or a cross per entry with the reason:

- the grid has to be rectangular
- every entry needs a clue
- a clue numbered for an entry that doesn't exist is an error, not a warning —
  it means the grid and the clue list disagree
- `answer`, if present, has to match the letters in the grid (`1A says RIB,
  grid has RUB`)

That last one is the reason to keep the answers in the JSON: it catches a
mis-transcribed row before it becomes a puzzle nobody can solve. Answers aren't
stored — they're already in the grid.

A puzzle that fails is skipped, not fatal; the good ones still go in. Adding is
idempotent — same id means overwrite, and anything typed into a room is
untouched — so entries can sit in the queue harmlessly.

## Keyboard (NYT behaviour)

| Key | What it does |
| --- | --- |
| Letter | Fills the square, moves to the next empty square in the word; when the word is full, jumps to the next unfinished clue |
| Backspace | Clears the square and steps back within the word |
| Delete | Clears the square, cursor stays put |
| Space | Switches between Across and Down |
| Enter | Jumps to the next clue in the same direction that still has a blank, landing on that blank (Shift-Enter goes back) |
| Arrow, same direction | Moves one square, skipping black squares |
| Arrow, other direction | Switches direction first, then moves on the next press |
| Tab / Shift-Tab | Next / previous clue, landing on its first empty square |
| Click a square | Selects it; clicking it again flips direction |

## Checking, and frozen squares

Check, Reveal and Clear are all shared — everyone in the room is looking at one
grid, so a check on your phone shows up on your friend's laptop without them
touching anything.

Checking a square has consequences beyond a red slash:

- **Correct → frozen.** The letter turns blue and can't be typed
  over, backspaced, deleted, or cleared by anyone, on any device. A refused
  keystroke gives the square a small shake so it doesn't read as a dead key, and
  the cursor moves on past it.
- **Wrong → red slash**, and the square stays editable. The mark clears itself
  the moment the letter changes, on every device.
- **Revealed squares are frozen too**, and read the same blue, with a red flag
  in the corner marking them as given rather than earned.

Solver colours deliberately skip blue, since blue now means "confirmed
correct" — a teammate's letters would otherwise look like checked ones. Anyone
whose browser is holding a blue from an earlier version gets moved to a new
colour on their next visit.

Clear skips frozen squares and says how many it's keeping before you confirm.
The upshot is that progress you've confirmed is progress: nobody can undo it by
leaning on a key, and Clear puzzle won't wipe out an hour of correct work.

There's deliberately no unfreeze button. If you truly need one — a puzzle
entered with a typo in its answers, say — delete `locked` under that room in the
Firebase console, or delete the room and start a fresh one.

## When something's wrong

**"Some files didn't load."** Every page checks its siblings on startup and names
whichever is missing. Usually the file isn't in the folder, got saved with a
stray `.txt` on the end, or the browser is holding an old copy — hard refresh
with Cmd-Shift-R. If you get a raw `X is not defined` in the console instead,
it's the same problem on a page that predates the check.

**"Can't reach the database."** The config in `firebase-config.js` is still
placeholder text, or the database rules don't allow reads. Check the browser's
Network tab.

**"Couldn't write to the database."** Rules allow reads but not writes. See step
2 above.

**"No room with that code."** Codes are five characters and never contain `O`,
`0`, `I`, or `1`. The room may also have been deleted from the console.

**A room's puzzle went missing.** Re-add the puzzle under the same id — via
`new.html`, or by queueing it in `add-puzzles.js` — and the room works again with
its letters intact.

**Starting over.** Delete `crossword/rooms` in the Firebase console to clear
every grid while keeping the puzzles. Delete `crossword` entirely to reset the
whole thing — but note the puzzles only live in the database now, so anything not
sitting in the queue would have to be rebuilt.

## Known limits

- Answers are in the puzzle record, which every client downloads, so anyone can
  dig them out of the network tab. Fine among friends. Closing that would mean
  keeping answers server-side and turning Check and Reveal into database calls.
- Open rules mean anyone with a room code can type in that grid, and anyone at
  all can add or overwrite puzzles.
- Mobile typing goes through a hidden input. It works, but it's the part most
  worth testing on your own phone.
- Nothing expires. Rooms accumulate until you delete them.