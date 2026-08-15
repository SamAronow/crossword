/* ------------------------------------------------------------------
   add-puzzles.js — the queue

   Paste puzzle JSON objects into QUEUED, open add-puzzles.html, press the
   button. Each one is written to crossword/puzzles/<id>.

   Three shapes are accepted, and mixing them in one queue is fine.

   1. The xword/NYT export — paste it whole, nothing to rearrange:

     {
       title: "HIT THE DECK",
       author: "…",  dow: "Sunday",         // become byline and difficulty
       size:  { cols: 21, rows: 21 },
       grid:  ["P","L","A","Y", …],          // one flat array, "." for black
       circles: [0,0,1, …],                  // shaded squares, kept
       clues:   { across: ["1. One side of a showdown", …], down: […] },
       answers: { across: ["PLAYER", …],     // parallel to the clue list,
                  down:   ["POTTED", …] }    // and checked against the grid
     }

   2. The hand-written shape (extra keys are ignored):

     {
       id: "step-by-step",          // optional — falls back to a slug of the
                                    // title, then to "puzzle-1", "puzzle-2"…
       title: "Thursday Themed",    // optional
       byline: "",                  // optional
       difficulty: "Medium",        // optional

       grid: [                      // one array per row; "black" marks a
         ["A","P","E","S","black"], // black square (".", "#" and "" work too)
         ...
       ],

       clues: {
         across: [ { number: 1, clue: "\"Planet of the ___\"", answer: "APES" }, … ],
         down:   [ { number: 1, clue: "Spanish love",         answer: "AMOR" }, … ]
       }
     }

   `answer` is optional but worth keeping: the page checks each one against
   the letters in the grid and refuses anything that disagrees, which catches
   a mis-transcribed row before it reaches the database.

   3. The oldest shape — grid as an array of strings ("APES.") and clues as
   plain objects ({ 1: "clue text" }).

   Names are set on the page, not here: each queued puzzle gets an editable
   name field, defaulting to the first unused "Puzzle N". The id comes from
   whatever you type, and the page tells you if it would replace something
   already in the database.

   Adding is idempotent: same id means overwrite, and anything typed into a
   room is untouched. So entries can sit here harmlessly; clear them out
   whenever you like.
------------------------------------------------------------------ */

const QUEUED = [

  // paste puzzle JSON here

];