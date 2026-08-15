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
        "clue": "\"Handy\" kitchen item",
        "answer": "MITT"
      },
      {
        "number": 5,
        "clue": "Smears with goo",
        "answer": "SLIMES"
      },
      {
        "number": 11,
        "clue": "Music genre with offbeat rhythms",
        "answer": "SKA"
      },
      {
        "number": 14,
        "clue": "So-called \"servebot\" in tennis, essentially",
        "answer": "ACER"
      },
      {
        "number": 15,
        "clue": "Action on the front lines",
        "answer": "COMBAT"
      },
      {
        "number": 16,
        "clue": "Hunk of cash",
        "answer": "WAD"
      },
      {
        "number": 17,
        "clue": "Words uttered while sorting potential gowns for an Indian wedding?",
        "answer": "SARI NOT SARI"
      },
      {
        "number": 19,
        "clue": "Word aptly hidden in \"moldy\"",
        "answer": "OLD"
      },
      {
        "number": 20,
        "clue": "Some marksmen",
        "answer": "SNIPERS"
      },
      {
        "number": 21,
        "clue": "Stringed instruments of old",
        "answer": "LYRES"
      },
      {
        "number": 23,
        "clue": "Inc. alternative",
        "answer": "LLC"
      },
      {
        "number": 24,
        "clue": "Kind of whale",
        "answer": "BALEEN"
      },
      {
        "number": 27,
        "clue": "Wedding feast delivery from India's capital?",
        "answer": "DELHI PLATTERS"
      },
      {
        "number": 31,
        "clue": "Unwelcome responsibility",
        "answer": "ONUS"
      },
      {
        "number": 33,
        "clue": "Rawboned",
        "answer": "GAUNT"
      },
      {
        "number": 34,
        "clue": "\"Deadline\" for a rush order",
        "answer": "NOW"
      },
      {
        "number": 35,
        "clue": "Bit of tailoring",
        "answer": "HEM"
      },
      {
        "number": 36,
        "clue": "Writer Rand",
        "answer": "AYN"
      },
      {
        "number": 38,
        "clue": "Great Leap Forward leader",
        "answer": "MAO"
      },
      {
        "number": 39,
        "clue": "Longoria with three Screen Actors Guild awards",
        "answer": "EVA"
      },
      {
        "number": 40,
        "clue": "Celestial sphere",
        "answer": "ORB"
      },
      {
        "number": 41,
        "clue": "Hold power, as a ruler",
        "answer": "REIGN"
      },
      {
        "number": 43,
        "clue": "\"You said it!\"",
        "answer": "AMEN"
      },
      {
        "number": 44,
        "clue": "Tying the knot during a colorful Hindu festival?",
        "answer": "HOLI MATRIMONY"
      },
      {
        "number": 48,
        "clue": "One who makes a lasting impression while just scratching the surface",
        "answer": "ETCHER"
      },
      {
        "number": 49,
        "clue": "Part of NATO: Abbr.",
        "answer": "ORG"
      },
      {
        "number": 50,
        "clue": "When repeated, \"You get the gist\"",
        "answer": "YADDA"
      },
      {
        "number": 52,
        "clue": "Enter furtively",
        "answer": "CREEPIN"
      },
      {
        "number": 56,
        "clue": "Mysterious sight at night",
        "answer": "UFO"
      },
      {
        "number": 57,
        "clue": "\"Esteemed reception guests, we regret to report that we've run out of flatbread,\" e.g.?",
        "answer": "NAAN APOLOGY"
      },
      {
        "number": 61,
        "clue": "Scratch the surface of, say",
        "answer": "MAR"
      },
      {
        "number": 62,
        "clue": "Like the physicist Niels Bohr and the astronomer Tycho Brahe",
        "answer": "DANISH"
      },
      {
        "number": 63,
        "clue": "Stock market unveilings, for short",
        "answer": "IPOS"
      },
      {
        "number": 64,
        "clue": "\"___ you done?\"",
        "answer": "ARE"
      },
      {
        "number": 65,
        "clue": "Luxury transports",
        "answer": "YACHTS"
      },
      {
        "number": 66,
        "clue": "Common workout target",
        "answer": "CORE"
      }
    ],
    "down": [
      {
        "number": 1,
        "clue": "The \"m\" in many a physics equation",
        "answer": "MASS"
      },
      {
        "number": 2,
        "clue": "Self-assured words",
        "answer": "ICAN"
      },
      {
        "number": 3,
        "clue": "Actress Polo",
        "answer": "TERI"
      },
      {
        "number": 4,
        "clue": "Toughest hits to get when hitting for the cycle in baseball",
        "answer": "TRIPLE"
      },
      {
        "number": 5,
        "clue": "Sear",
        "answer": "SCORCH"
      },
      {
        "number": 6,
        "clue": "\"___ of luck!\"",
        "answer": "LOT"
      },
      {
        "number": 7,
        "clue": "Quick communications, in brief",
        "answer": "IMS"
      },
      {
        "number": 8,
        "clue": "Postgraduate deg. with management courses",
        "answer": "MBA"
      },
      {
        "number": 9,
        "clue": "Musician's asset",
        "answer": "EAR"
      },
      {
        "number": 10,
        "clue": "Stylish shoe feature",
        "answer": "STIL"
      },
      {
        "number": 11,
        "clue": "Someone you will never stop despising",
        "answer": "SWORN ENEMY"
      },
      {
        "number": 12,
        "clue": "Green smoothie staple",
        "answer": "KALE"
      },
      {
        "number": 13,
        "clue": "Tosses in",
        "answer": "ADDS"
      },
      {
        "number": 18,
        "clue": "\"Little\" Dickens girl",
        "answer": "NELL"
      },
      {
        "number": 22,
        "clue": "Up to this point",
        "answer": "YET"
      },
      {
        "number": 24,
        "clue": "___-free (plastics label)",
        "answer": "BPA"
      },
      {
        "number": 25,
        "clue": "Tina Fey and Amy Poehler vis-à-vis \"Saturday Night Live\"",
        "answer": "ALUMS"
      },
      {
        "number": 26,
        "clue": "Singer ___ Del Rey",
        "answer": "LANA"
      },
      {
        "number": 27,
        "clue": "Longtime Hogwarts headmaster",
        "answer": "DUMBLEDORE"
      },
      {
        "number": 28,
        "clue": "Set aflame",
        "answer": "LIT"
      },
      {
        "number": 29,
        "clue": "Wander",
        "answer": "ROAM"
      },
      {
        "number": 30,
        "clue": "Graceful bird",
        "answer": "SWAN"
      },
      {
        "number": 31,
        "clue": "\"Pick me! Pick me!\"",
        "answer": "OHOH"
      },
      {
        "number": 32,
        "clue": "Infamous Roman ruler",
        "answer": "NERO"
      },
      {
        "number": 36,
        "clue": "Attractive plus-one",
        "answer": "ARMCANDY"
      },
      {
        "number": 37,
        "clue": "\"You said it!\"",
        "answer": "YEAH"
      },
      {
        "number": 42,
        "clue": "Canine warning",
        "answer": "GROWL"
      },
      {
        "number": 43,
        "clue": "Like a cherub",
        "answer": "ANGELIC"
      },
      {
        "number": 45,
        "clue": "\"___ be a real honor\"",
        "answer": "ITD"
      },
      {
        "number": 46,
        "clue": "Transforms",
        "answer": "MORPHS"
      },
      {
        "number": 47,
        "clue": "Cookie with an \"enrobed\" variety in the U.K.",
        "answer": "OREO"
      },
      {
        "number": 50,
        "clue": "Arizona city or county",
        "answer": "YUMA"
      },
      {
        "number": 51,
        "clue": "At a distance",
        "answer": "AFAR"
      },
      {
        "number": 52,
        "clue": "Film information on IMDb or Rotten Tomatoes",
        "answer": "CAST"
      },
      {
        "number": 53,
        "clue": "Cops, in slang",
        "answer": "POPO"
      },
      {
        "number": 54,
        "clue": "Iconic lab assistant of film",
        "answer": "IGOR"
      },
      {
        "number": 55,
        "clue": "Where Anheuser-Busch is \"BUD\"",
        "answer": "NYSE"
      },
      {
        "number": 58,
        "clue": "Battery for a mouse",
        "answer": "AAA"
      },
      {
        "number": 59,
        "clue": "Anti-apartheid org.",
        "answer": "ANC"
      },
      {
        "number": 60,
        "clue": "U.S. medical research agcy.",
        "answer": "NIH"
      }
    ]
  },
  "grid": [
    ["M", "I", "T", "T", "black", "S", "L", "I", "M", "E", "S", "black", "S", "K", "A"],
    ["A", "C", "E", "R", "black", "C", "O", "M", "B", "A", "T", "black", "W", "A", "D"],
    ["S", "A", "R", "I", "N", "O", "T", "S", "A", "R", "I", "black", "O", "L", "D"],
    ["S", "N", "I", "P", "E", "R", "S", "black", "black", "black", "L", "Y", "R", "E", "S"],
    ["black", "black", "black", "L", "L", "C", "black", "B", "A", "L", "E", "E", "N", "black", "black"],
    ["black", "black", "D", "E", "L", "H", "I", "P", "L", "A", "T", "T", "E", "R", "S"],
    ["O", "N", "U", "S", "black", "G", "A", "U", "N", "T", "black", "N", "O", "W", "black"],
    ["H", "E", "M", "black", "A", "Y", "N", "black", "M", "A", "O", "black", "E", "V", "A"],
    ["O", "R", "B", "black", "R", "E", "I", "G", "N", "black", "A", "M", "E", "N", "black"],
    ["H", "O", "L", "I", "M", "A", "T", "R", "I", "M", "O", "N", "Y", "black", "black"],
    ["black", "black", "E", "T", "C", "H", "E", "R", "black", "O", "R", "G", "black", "black", "black"],
    ["Y", "A", "D", "D", "A", "black", "black", "black", "C", "R", "E", "E", "P", "I", "N"],
    ["U", "F", "O", "black", "N", "A", "A", "N", "A", "P", "O", "L", "O", "G", "Y"],
    ["M", "A", "R", "black", "D", "A", "N", "I", "S", "H", "black", "I", "P", "O", "S"],
    ["A", "R", "E", "black", "Y", "A", "C", "H", "T", "S", "black", "C", "O", "R", "E"]
  ]
}
];