# Crossword — shared solving

Vanilla HTML/JS on Firebase Realtime Database, no build step. Puzzles live in
the database, not in the code.

```
index.html          home page — lists whatever puzzles are in the database
puzzle.html?id=...  the solver
new.html            add a puzzle (opens with the sample already filled in)
crossword-core.js   the stored-record shape, grid validation, numbering
firebase-config.js  your Firebase config + database paths
```

`puzzles.js` from the earlier version is gone — delete it if it's still in the
folder.

## Setup

**1.** Paste your Firebase web config into `firebase-config.js`.

**2.** Database rules:

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

Anyone with the URL can then read and write that subtree — which is the point,
but it does mean anyone with the URL.

**3.** Serve the folder (`python3 -m http.server 8000`) and open `new.html`.
It comes up pre-filled with the sample mini, so **one click on "Add to
database" seeds it** and you're solving. For two computers, push the folder to
a repo and deploy to Vercel — it's all static.

## What's stored where

```
crossword/
  puzzles/<id>        the puzzle itself — grid, clues, title  (rarely changes)
    title:      "Mini No. 1"
    byline:     "Test puzzle"
    difficulty: "Easy"
    grid:       "RUB..\nUSED.\nMELON\n.ROSE\n..WET"
    clues:      { across: { "1": "Massage, as a sore shoulder", … },
                  down:   { "1": "Spirit in a daiquiri", … } }
    createdAt:  1723600000000

  solves/<id>         what people have typed  (changes constantly)
    cells/2_3:   { l: "O", by: "s8fk2a", cl: "#7c3aed", at: 1723… }
    revealed/2_3: true
    meta:        { startedAt, solvedAt }
    players/s8fk2a: { name, color, r, c, dir, ts }
```

The two are separate on purpose: clearing a grid wipes `solves/<id>` and never
touches the puzzle. Deleting `solves/<id>` by hand in the Firebase console is a
clean reset.

In `grid`, a letter is that square's answer and `.` is a black square. Square
numbers are **computed from the grid**, never stored — which is why `new.html`
generates the clue fields for you instead of asking you to number them. Clue
keys are those computed numbers.

One square per database key means two people typing in different squares never
collide; the same square is last-write-wins. Each page listens with
`child_added` / `child_changed` / `child_removed` on `cells`, and local writes
paint immediately, so your own typing has no lag while your friend's letters
land as he types them.

`players` is presence — `onDisconnect().remove()` plus a 25-second heartbeat.
Other solvers show as coloured rings on the square they're in, initials in the
header, and their letters appear in their colour. The timer is shared: it
starts on the first letter anyone types and stops when the grid is correct.

## Adding a puzzle

`new.html` does it: type or paste a grid, and the numbered preview and one clue
field per entry (labelled with its answer) appear as you type. It refuses to
save a grid with ragged rows and warns about empty clues. Saving over an
existing id replaces the puzzle and leaves anything typed into it alone.

Any rectangle works — 15×15 is the same data shape as 5×5. The sample mini
gives RUB / USED / MELON / ROSE / WET across, RUM / USER / BELOW / DOSE / NET
down.

## Keyboard (NYT behaviour)

| Key | What it does |
| --- | --- |
| Letter | Fills the square, moves to the next empty square in the word; when the word is full, jumps to the next unfinished clue |
| Backspace | Clears the square and steps back within the word |
| Delete | Clears the square, cursor stays |
| Space / Enter | Switches between Across and Down |
| Arrow, same direction | Moves one square, skipping black squares |
| Arrow, other direction | Switches direction first, then moves on the next press |
| Tab / Shift-Tab | Next / previous clue, landing on its first empty square |
| Click a square | Selects it; clicking it again flips direction |

Check marks are per-browser (your red slashes are yours). Reveal and Clear are
shared, since they change the grid everyone is looking at.

Worth knowing: answers are in the puzzle record, which every client downloads,
so anyone can dig them out of the network tab. Fine among friends. Closing that
would mean keeping answers server-side and making Check/Reveal database calls.
