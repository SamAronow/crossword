/* ------------------------------------------------------------------
   add-puzzles.js — the queue

   Paste puzzle JSON objects into QUEUED, open add-puzzles.html, press the
   button. Each one is written to crossword/puzzles/<id>.

   Expected shape (extra keys are ignored):

     {
       title: "Thursday Themed",    // optional
       byline: "",                  // optional
       difficulty: "Medium",        // optional

       grid: [                      // one array per row; "black" marks a
         ["A","P","E","S","black"], // black square (".", "#" and "" work too)
         ...
       ],

       clues: {
         across: [ { number: 1, clue: "\"Planet of the ___\"", answer: "APES" }, … ],
         down:   [ { number: 1, clue: "Spanish love",          answer: "AMOR" }, … ]
       },

       circles: [0,0,1, …]          // optional, row-major, 1 = circled square
     }

   `answer` is optional but worth keeping: the page checks each one against
   the letters in the grid and refuses anything that disagrees, which catches
   a mis-transcribed row before it reaches the database.

   Rows of strings ("APES.") and clues as a plain map ({ 1: "clue text" })
   are still accepted.

   Names are set on the page, not here: each queued puzzle gets an editable
   name field, defaulting to the first unused "Puzzle N". The id comes from
   whatever you type, and the page tells you if it would replace something
   already in the database.

   Adding is idempotent: same id means overwrite, and anything typed into a
   room is untouched. So entries can sit here harmlessly; clear them out
   whenever you like.
------------------------------------------------------------------ */

const QUEUED = [

];