/* ------------------------------------------------------------------
   add-puzzles.js — the queue

   Paste puzzle JSON objects into QUEUED, open add-puzzles.html, press the
   button. Each one is written to crossword/puzzles/<id>.

   Expected shape (extra keys are ignored):

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

   The older shape still works too — grid as an array of strings ("APES.")
   and clues as plain objects ({ 1: "clue text" }).

   Adding is idempotent: same id means overwrite, and anything typed into a
   room is untouched. So entries can sit here harmlessly; clear them out
   whenever you like.
------------------------------------------------------------------ */

const QUEUED = [{
  "clues": {
    "across": [
      {
        "number": 1,
        "clue": "\"Planet of the ___\"",
        "answer": "APES"
      },
      {
        "number": 5,
        "clue": "Wood strip found in many Ikea bed supports",
        "answer": "SLAT"
      },
      {
        "number": 9,
        "clue": "Take pleasure in",
        "answer": "ENJOY"
      },
      {
        "number": 14,
        "clue": "Size opposite of mini-",
        "answer": "MAXI"
      },
      {
        "number": 15,
        "clue": "Prepares to throw a dart, say",
        "answer": "AIMS"
      },
      {
        "number": 16,
        "clue": "Crystal-filled rock",
        "answer": "GEODE"
      },
      {
        "number": 17,
        "clue": "Newspaper opinion piece",
        "answer": "OPED"
      },
      {
        "number": 18,
        "clue": "*Title of a 1990s ABC sitcom and a 1990s New Kids on the Block hit",
        "answer": "STEPBYSTEP"
      },
      {
        "number": 20,
        "clue": "Cereal often found with pretzels in a party snack mix",
        "answer": "RICECHEX"
      },
      {
        "number": 22,
        "clue": "Vertical jumping ability, in basketball lingo",
        "answer": "UPS"
      },
      {
        "number": 23,
        "clue": "Sheep's cry",
        "answer": "BAA"
      },
      {
        "number": 24,
        "clue": "\"___ to Go!,\" 2024 Chappell Roan hit sometimes compared to the Village People's \"Y.M.C.A.\"",
        "answer": "HOT"
      },
      {
        "number": 25,
        "clue": "Attracted to people of any gender, for short",
        "answer": "PAN"
      },
      {
        "number": 28,
        "clue": "*Detailed, real-time description",
        "answer": "PLAYBYPLAY"
      },
      {
        "number": 33,
        "clue": "Shape for a red-and-white striped Christmas candy",
        "answer": "CANE"
      },
      {
        "number": 34,
        "clue": "Rodeo rope",
        "answer": "LASSO"
      },
      {
        "number": 35,
        "clue": "Foggy mental state",
        "answer": "HAZE"
      },
      {
        "number": 36,
        "clue": "Raisins, when on a celery-and-peanut-butter \"log\"",
        "answer": "ANTS"
      },
      {
        "number": 37,
        "clue": "Wrinkly citrus fruit",
        "answer": "UGLI"
      },
      {
        "number": 38,
        "clue": "\"What a shame\"",
        "answer": "SOSAD"
      },
      {
        "number": 39,
        "clue": "Riverbank deposit",
        "answer": "SILT"
      },
      {
        "number": 40,
        "clue": "Prompted, on stage",
        "answer": "CUED"
      },
      {
        "number": 41,
        "clue": "Lyft competitor",
        "answer": "UBER"
      },
      {
        "number": 42,
        "clue": "Zellweger of \"Bridget Jones's Diary\"",
        "answer": "RENEE"
      },
      {
        "number": 43,
        "clue": "Joint sometimes bent in protest",
        "answer": "KNEE"
      },
      {
        "number": 44,
        "clue": "*How to tackle big writing projects, per a seminal Anne Lamott book",
        "answer": "BIRDBYBIRD"
      },
      {
        "number": 46,
        "clue": "Go on and on and on",
        "answer": "YAP"
      },
      {
        "number": 47,
        "clue": "LAX posting",
        "answer": "ETA"
      },
      {
        "number": 48,
        "clue": "Frito-___",
        "answer": "LAY"
      },
      {
        "number": 49,
        "clue": "Not just some or most",
        "answer": "ALL"
      },
      {
        "number": 50,
        "clue": "Got off the ground, as a start-up company",
        "answer": "LAUNCHED"
      },
      {
        "number": 55,
        "clue": "*Many an off-road vehicle ... or a literal description of the answer to each asterisked clue (including this one!)",
        "answer": "FOURBYFOUR"
      },
      {
        "number": 59,
        "clue": "Otherworldly glow",
        "answer": "AURA"
      },
      {
        "number": 60,
        "clue": "It means slow (not big!) in music",
        "answer": "LARGO"
      },
      {
        "number": 61,
        "clue": "\"Well, ___ that special!\"",
        "answer": "ISNT"
      },
      {
        "number": 62,
        "clue": "Poetry competition",
        "answer": "SLAM"
      },
      {
        "number": 63,
        "clue": "\"See what I'm talkin' 'bout?\"",
        "answer": "YKNOW"
      },
      {
        "number": 64,
        "clue": "Brooklyn basketballers ... and what they swish",
        "answer": "NETS"
      },
      {
        "number": 65,
        "clue": "Effortlessness",
        "answer": "EASE"
      }
    ],
    "down": [
      {
        "number": 1,
        "clue": "Spanish love",
        "answer": "AMOR"
      },
      {
        "number": 2,
        "clue": "Big ___ (nickname of baseball's David Ortiz)",
        "answer": "PAPI"
      },
      {
        "number": 3,
        "clue": "Company bigwig",
        "answer": "EXEC"
      },
      {
        "number": 4,
        "clue": "*Next to each other, like many washers and dryers",
        "answer": "SIDEBYSIDE"
      },
      {
        "number": 5,
        "clue": "Strut down the \"RuPaul's Drag Race\" runway, say",
        "answer": "SASHAY"
      },
      {
        "number": 6,
        "clue": "Lo-cal",
        "answer": "LITE"
      },
      {
        "number": 7,
        "clue": "Visa or Mastercard rival, informally",
        "answer": "AMEX"
      },
      {
        "number": 8,
        "clue": "Small recipe amt.",
        "answer": "TSP"
      },
      {
        "number": 9,
        "clue": "Home of the Great Pyramid",
        "answer": "EGYPT"
      },
      {
        "number": 10,
        "clue": "Loch ___ monster",
        "answer": "NESS"
      },
      {
        "number": 11,
        "clue": "Scribble (down)",
        "answer": "JOT"
      },
      {
        "number": 12,
        "clue": "Sappho's \"___ to Aphrodite\"",
        "answer": "ODE"
      },
      {
        "number": 13,
        "clue": "Slangy affirmative",
        "answer": "YEP"
      },
      {
        "number": 19,
        "clue": "Lifted, as one's spirits",
        "answer": "BUOYED"
      },
      {
        "number": 21,
        "clue": "___ San Lucas, Mexico",
        "answer": "CABO"
      },
      {
        "number": 24,
        "clue": "Venture, as a guess",
        "answer": "HAZARD"
      },
      {
        "number": 25,
        "clue": "Pressed sandwich",
        "answer": "PANINI"
      },
      {
        "number": 26,
        "clue": "Part of a reindeer's rack",
        "answer": "ANTLER"
      },
      {
        "number": 27,
        "clue": "Prepared one's home for a new arrival",
        "answer": "NESTED"
      },
      {
        "number": 28,
        "clue": "Spirited and determined",
        "answer": "PLUCKY"
      },
      {
        "number": 29,
        "clue": "\"___ Beach: The Real Orange County\" (MTV reality show of the mid-aughts)",
        "answer": "LAGUNA"
      },
      {
        "number": 30,
        "clue": "Catching some Z's",
        "answer": "ASLEEP"
      },
      {
        "number": 31,
        "clue": "Irrational fear",
        "answer": "PHOBIA"
      },
      {
        "number": 32,
        "clue": "Word before printer or pointer",
        "answer": "LASER"
      },
      {
        "number": 33,
        "clue": "*Considered individually",
        "answer": "CASEBYCASE"
      },
      {
        "number": 38,
        "clue": "In a nonobvious way",
        "answer": "SUBTLY"
      },
      {
        "number": 42,
        "clue": "\"Deadpool\" actor Reynolds",
        "answer": "RYAN"
      },
      {
        "number": 45,
        "clue": "Says out loud without thinking",
        "answer": "BLURTS"
      },
      {
        "number": 47,
        "clue": "Spot for a roller skater's pad",
        "answer": "ELBOW"
      },
      {
        "number": 49,
        "clue": "Best Picture winner found hiding in \"and the Oscar goes to ...\"",
        "answer": "ARGO"
      },
      {
        "number": 50,
        "clue": "\"Heads, I win. Tails, you ___!\" (sneaky coin flip agreement)",
        "answer": "LOSE"
      },
      {
        "number": 51,
        "clue": "Parent's sister",
        "answer": "AUNT"
      },
      {
        "number": 52,
        "clue": "Hawaiian storytelling dance",
        "answer": "HULA"
      },
      {
        "number": 53,
        "clue": "Times of one's life, say",
        "answer": "ERAS"
      },
      {
        "number": 54,
        "clue": "Title for Helen Mirren and Emma Thompson",
        "answer": "DAME"
      },
      {
        "number": 55,
        "clue": "Take to the sky",
        "answer": "FLY"
      },
      {
        "number": 56,
        "clue": "Acorn-bearing tree",
        "answer": "OAK"
      },
      {
        "number": 57,
        "clue": "Caterer's coffee dispenser",
        "answer": "URN"
      },
      {
        "number": 58,
        "clue": "Above-water sign of a shark",
        "answer": "FIN"
      }
    ]
  },
  "grid": [
    ["A", "P", "E", "S", "black", "S", "L", "A", "T", "black", "E", "N", "J", "O", "Y"],
    ["M", "A", "X", "I", "black", "A", "I", "M", "S", "black", "G", "E", "O", "D", "E"],
    ["O", "P", "E", "D", "black", "S", "T", "E", "P", "B", "Y", "S", "T", "E", "P"],
    ["R", "I", "C", "E", "C", "H", "E", "X", "black", "U", "P", "S", "black", "black", "black"],
    ["black", "black", "black", "B", "A", "A", "black", "black", "H", "O", "T", "black", "P", "A", "N"],
    ["P", "L", "A", "Y", "B", "Y", "P", "L", "A", "Y", "black", "C", "A", "N", "E"],
    ["L", "A", "S", "S", "O", "black", "H", "A", "Z", "E", "black", "A", "N", "T", "S"],
    ["U", "G", "L", "I", "black", "S", "O", "S", "A", "D", "black", "S", "I", "L", "T"],
    ["C", "U", "E", "D", "black", "U", "B", "E", "R", "black", "R", "E", "N", "E", "E"],
    ["K", "N", "E", "E", "black", "B", "I", "R", "D", "B", "Y", "B", "I", "R", "D"],
    ["Y", "A", "P", "black", "E", "T", "A", "black", "black", "L", "A", "Y", "black", "black", "black"],
    ["black", "black", "black", "A", "L", "L", "black", "L", "A", "U", "N", "C", "H", "E", "D"],
    ["F", "O", "U", "R", "B", "Y", "F", "O", "U", "R", "black", "A", "U", "R", "A"],
    ["L", "A", "R", "G", "O", "black", "I", "S", "N", "T", "black", "S", "L", "A", "M"],
    ["Y", "K", "N", "O", "W", "black", "N", "E", "T", "S", "black", "E", "A", "S", "E"]
  ]
}];