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
{
  "clues": {
    "across": [
      {
        "number": 1,
        "clue": "Biting comment",
        "answer": "DIG"
      },
      {
        "number": 4,
        "clue": "\"No thanks\"",
        "answer": "IPASS"
      },
      {
        "number": 9,
        "clue": "Bottom of the food chain, say",
        "answer": "PREY"
      },
      {
        "number": 13,
        "clue": "That, in Spanish",
        "answer": "ESO"
      },
      {
        "number": 14,
        "clue": "Easier to get along with",
        "answer": "NICER"
      },
      {
        "number": 15,
        "clue": "Job perk that might accumulate",
        "answer": "LEAVE"
      },
      {
        "number": 16,
        "clue": "Catchalls of the insurance industry",
        "answer": "BLANKETPOLICIES"
      },
      {
        "number": 19,
        "clue": "Edgar Allan Poe writing",
        "answer": "TALE"
      },
      {
        "number": 20,
        "clue": "Reine's counterpart",
        "answer": "ROI"
      },
      {
        "number": 21,
        "clue": "Country that produces surprisingly little Muscat wine",
        "answer": "OMAN"
      },
      {
        "number": 22,
        "clue": "Uses scissors on",
        "answer": "SNIPS"
      },
      {
        "number": 24,
        "clue": "Really giving an earful",
        "answer": "RAILINGAT"
      },
      {
        "number": 28,
        "clue": "Dissuade",
        "answer": "DETER"
      },
      {
        "number": 30,
        "clue": "Bit of body art, informally",
        "answer": "TAT"
      },
      {
        "number": 31,
        "clue": "Modern ____",
        "answer": "ERA"
      },
      {
        "number": 32,
        "clue": "Paradise on earth",
        "answer": "UTOPIA"
      },
      {
        "number": 35,
        "clue": "Where you might have to exchange tickets for food",
        "answer": "FAIR"
      },
      {
        "number": 36,
        "clue": "Reptile that can reach up to 10 feet in length",
        "answer": "MONITORLIZARD"
      },
      {
        "number": 40,
        "clue": "Got carried along by",
        "answer": "RODE"
      },
      {
        "number": 41,
        "clue": "Nonexpert",
        "answer": "LAYMAN"
      },
      {
        "number": 42,
        "clue": "Story extender",
        "answer": "AND"
      },
      {
        "number": 43,
        "clue": "Pose a question",
        "answer": "ASK"
      },
      {
        "number": 45,
        "clue": "Deluges with emails",
        "answer": "SPAMS"
      },
      {
        "number": 48,
        "clue": "Play Store purchase",
        "answer": "MOBILEAPP"
      },
      {
        "number": 52,
        "clue": "Series of steps",
        "answer": "STAIR"
      },
      {
        "number": 54,
        "clue": "Part of a pot",
        "answer": "ANTE"
      },
      {
        "number": 55,
        "clue": "\"Now I see!\"",
        "answer": "AHA"
      },
      {
        "number": 57,
        "clue": "Sitting on the bench, say",
        "answer": "IDLE"
      },
      {
        "number": 58,
        "clue": "Catchphrase of a classic MTV show ... or a hint for the starts of 16-, 24-, 36- and 48-Across",
        "answer": "WELCOMETOMYCRIB"
      },
      {
        "number": 62,
        "clue": "Book of legends",
        "answer": "ATLAS"
      },
      {
        "number": 63,
        "clue": "Unit of engine capacity",
        "answer": "LITER"
      },
      {
        "number": 64,
        "clue": "Hosp. area",
        "answer": "ICU"
      },
      {
        "number": 65,
        "clue": "Largest loch in Scotland by volume",
        "answer": "NESS"
      },
      {
        "number": 66,
        "clue": "Many ___ (a long time)",
        "answer": "MOONS"
      },
      {
        "number": 67,
        "clue": "\"___ Auto\" (Volkswagen slogan)",
        "answer": "DAS"
      }
    ],
    "down": [
      {
        "number": 1,
        "clue": "Net worth negatives",
        "answer": "DEBITS"
      },
      {
        "number": 2,
        "clue": "Setting for the game Myst",
        "answer": "ISLAND"
      },
      {
        "number": 3,
        "clue": "Netminder",
        "answer": "GOALIE"
      },
      {
        "number": 4,
        "clue": "___ saver (printing option for a crossword)",
        "answer": "INK"
      },
      {
        "number": 5,
        "clue": "Crabbing spot",
        "answer": "PIER"
      },
      {
        "number": 6,
        "clue": "Person who may have to deal with long lines",
        "answer": "ACTOR"
      },
      {
        "number": 7,
        "clue": "Color whose name comes from the Greek word for \"cuttlefish\"",
        "answer": "SEPIA"
      },
      {
        "number": 8,
        "clue": "Sign of a packed house",
        "answer": "SRO"
      },
      {
        "number": 9,
        "clue": "Praline nugget",
        "answer": "PECAN"
      },
      {
        "number": 10,
        "clue": "Galoshes and umbrellas",
        "answer": "RAINWEAR"
      },
      {
        "number": 11,
        "clue": "Noted wearer of a fig leaf",
        "answer": "EVE"
      },
      {
        "number": 12,
        "clue": "What a bobbing fist indicates in American Sign Language",
        "answer": "YES"
      },
      {
        "number": 15,
        "clue": "Hard cap",
        "answer": "LIMIT"
      },
      {
        "number": 17,
        "clue": "Only planet in the solar system not visible to the naked eye",
        "answer": "URANUS"
      },
      {
        "number": 18,
        "clue": "1970 classic by the Kinks",
        "answer": "LOLA"
      },
      {
        "number": 23,
        "clue": "Org. concerned with life beyond Earth",
        "answer": "SETI"
      },
      {
        "number": 25,
        "clue": "Winner of four World Cups",
        "answer": "ITALY"
      },
      {
        "number": 26,
        "clue": "Like much of Utah",
        "answer": "ARID"
      },
      {
        "number": 27,
        "clue": "Road crew goo",
        "answer": "TAR"
      },
      {
        "number": 29,
        "clue": "Start to attract fruit flies, perhaps",
        "answer": "ROT"
      },
      {
        "number": 33,
        "clue": "Dance performed in Smetana's \"The Bartered Bride\"",
        "answer": "POLKA"
      },
      {
        "number": 34,
        "clue": "Apt name for a financial adviser?",
        "answer": "IRA"
      },
      {
        "number": 35,
        "clue": "Huge supporter",
        "answer": "FAN"
      },
      {
        "number": 36,
        "clue": "\"The kissing disease,\" for short",
        "answer": "MONO"
      },
      {
        "number": 37,
        "clue": "Quirky types",
        "answer": "ODDBALLS"
      },
      {
        "number": 38,
        "clue": "Some Gmail convoys",
        "answer": "THREADS"
      },
      {
        "number": 39,
        "clue": "Throws in the microwave",
        "answer": "ZAPS"
      },
      {
        "number": 40,
        "clue": "Smash (into)",
        "answer": "RAM"
      },
      {
        "number": 43,
        "clue": "Singers with a range from F3 to F5",
        "answer": "ALTOS"
      },
      {
        "number": 44,
        "clue": "Appear to be",
        "answer": "SEEM"
      },
      {
        "number": 46,
        "clue": "City that's home to el Museo del Prado",
        "answer": "MADRID"
      },
      {
        "number": 47,
        "clue": "___ gel (moisture-absorbing stuff marked \"Do not eat\")",
        "answer": "SILICA"
      },
      {
        "number": 49,
        "clue": "Residents of the Realm of the Four Parts",
        "answer": "BRITS"
      },
      {
        "number": 50,
        "clue": "Barbecue setting, often",
        "answer": "PATIO"
      },
      {
        "number": 51,
        "clue": "Insta post",
        "answer": "PIC"
      },
      {
        "number": 53,
        "clue": "An eye for an I?",
        "answer": "OPTIC"
      },
      {
        "number": 56,
        "clue": "\"Preach it!\"",
        "answer": "AMEN"
      },
      {
        "number": 58,
        "clue": "Lacking color",
        "answer": "WAN"
      },
      {
        "number": 59,
        "clue": "Shorts season in Strasbourg",
        "answer": "ETE"
      },
      {
        "number": 60,
        "clue": "Tree with serrated leaves",
        "answer": "ELM"
      },
      {
        "number": 61,
        "clue": "Mos. on end",
        "answer": "YRS"
      }
    ]
  },
  "grid": [
    ["D","I","G","I","P","A","S","S","P","R","E","Y","black","black","black"],
    ["E","S","O","N","I","C","E","R","L","E","A","V","E","black","black"],
    ["B","L","A","N","K","E","T","P","O","L","I","C","I","E","S"],
    ["T","A","L","E","R","O","I","O","M","A","N","black","black","black","black"],
    ["S","N","I","P","S","R","A","I","L","I","N","G","A","T","black"],
    ["D","E","T","E","R","black","black","T","A","T","black","E","R","A","black"],
    ["black","black","black","U","T","O","P","I","A","black","black","F","A","I","R"],
    ["M","O","N","I","T","O","R","L","I","Z","A","R","D","black","black"],
    ["R","O","D","E","black","L","A","Y","M","A","N","black","black","black","black"],
    ["A","N","D","A","S","K","black","black","S","P","A","M","S","black","black"],
    ["M","O","B","I","L","E","A","P","P","S","T","A","I","R","black"],
    ["A","N","T","E","black","black","A","H","A","black","black","I","D","L","E"],
    ["W","E","L","C","O","M","E","T","O","M","Y","C","R","I","B"],
    ["A","T","L","A","S","black","L","I","T","E","R","black","I","C","U"],
    ["N","E","S","S","black","black","M","O","O","N","S","black","D","A","S"]
  ]
}
];