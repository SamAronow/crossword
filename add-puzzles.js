/* ------------------------------------------------------------------
   add-puzzles.js
   Everything this app ships with, ready to (re)load into
   crossword/puzzles/<id>. Loaded by add-puzzles.html.

   The 5x5 sample comes straight from SAMPLE_PUZZLE in crossword-core.js
   (the same one new.html opens with), so there's one copy of it. After it
   are three original 11x11 easies: symmetric black squares, no entry under
   three letters, every square crossed in both directions.

   Rooms didn't change this shape — a puzzle record is still just the grid,
   the clues, and its title. What rooms changed is where the typing goes.
------------------------------------------------------------------ */

const BATCH_PUZZLES = [

  // The 5x5 sample, defined in crossword-core.js
  ...(typeof SAMPLE_PUZZLE !== "undefined" ? [SAMPLE_PUZZLE] : []),

  {
    id: "easy-1",
    title: "Easy No. 1",
    byline: "Built for this app",
    difficulty: "Easy",
    grid: [
      "...WAS..CAB",
      ".FLIRT.BORE",
      "MAINTENANCE",
      "ACT..WENT..",
      "STEM..WARP.",
      "TORAH.SNOOP",
      ".RARE..ALTO",
      "..TOAD..LEE",
      "FLUORESCENT",
      "EARN.APART.",
      "EYE..FAN..."
    ],
    clues: {
      across: {
        1:  "Used to be",
        4:  "Yellow ride hailed at the curb",
        7:  "Bat one's eyelashes at",
        9:  "Put to sleep, in a way",
        10: "Upkeep",
        12: "Part of a play",
        13: "Departed",
        14: "A flower's stalk",
        16: "Bend out of shape",
        18: "Scroll kept in a synagogue ark",
        20: "Poke around where you shouldn't",
        22: "Hard to come by",
        23: "Voice between soprano and tenor",
        24: "Warty hopper",
        26: "Sheltered side of a ship",
        27: "Like the buzzing tubes in an office ceiling",
        31: "Bring home, as a paycheck",
        32: "Separated",
        33: "The hole in a needle",
        34: "Ceiling cooler"
      },
      down: {
        1:  "Come in first",
        2:  "A museum's stock in trade",
        3:  "Slow-simmered one-pot dinner",
        4:  "Gadget with joysticks and buttons",
        5:  "A rainbow's shape",
        6:  "Spelling contest, or a buzzer",
        7:  "3 and 5, for 15",
        8:  "Novels, poems and plays, collectively",
        9:  "Fruit that comes in a bunch",
        10: "A sail's support",
        11: "The six o'clock broadcast",
        15: "Strand on a desert island",
        17: "Powerful",
        19: "Catch, as a sound",
        21: "Frost or Dickinson",
        25: "Unable to hear",
        27: "Charge for a service",
        28: "Put down",
        29: "Place for a massage",
        30: "Aluminum soda container"
      }
    }
  },

  {
    id: "easy-2",
    title: "Easy No. 2",
    byline: "Built for this app",
    difficulty: "Easy",
    grid: [
      "ATOM..RAMEN",
      "ROPES.ERASE",
      "MOTTO.FIRST",
      "...ALL.ATE.",
      "GOALIE..INK",
      "ARC.DAM.ACE",
      "PIT..VALLEY",
      ".GIG.EYE...",
      "VIOLA.OMEGA",
      "INNER.ROGER",
      "ASSET..NOTE"
    ],
    clues: {
      across: {
        1:  "Tiny thing with a nucleus",
        5:  "Noodle soup topped with a soft-boiled egg",
        10: "Learn the ___ (pick up the basics)",
        12: "Rub out",
        13: "Words on a coat of arms",
        14: "Blue ribbon placement",
        15: "Every last one",
        17: "Had lunch",
        18: "The player wearing the big gloves",
        21: "A pen's fluid",
        23: "Curved path of a thrown ball",
        24: "A beaver's construction",
        26: "Serve that never gets returned",
        27: "A peach's center",
        28: "Low ground between hills",
        30: "One-night booking for a band",
        32: "A hurricane's calm center",
        33: "String instrument a bit bigger than a violin",
        35: "Last letter of the Greek alphabet",
        39: "Opposite of outer",
        40: "\"Message received!\"",
        41: "Item on the plus side of the ledger",
        42: "Quickly jotted message"
      },
      down: {
        1:  "Shoulder-to-hand limb",
        2:  "Also",
        3:  "Choose",
        4:  "Copper or zinc",
        5:  "Whistle-blower on the court",
        6:  "Solo in an opera",
        7:  "___ arts (karate and judo)",
        8:  "The heart of the matter",
        9:  "What a trapeze artist falls into",
        11: "Neither liquid nor gas",
        16: "Head out",
        18: "Space between two teeth",
        19: "Beginnings",
        20: "___ speak louder than words",
        22: "It opens a lock",
        25: "City hall's top official",
        29: "Sour yellow fruit",
        31: "Delight",
        33: "By way of",
        34: "Painting and sculpture",
        36: "Sense of self-importance",
        37: "Obtain",
        38: "Is, for two or more"
      }
    }
  },

  {
    id: "easy-3",
    title: "Easy No. 3",
    byline: "Built for this app",
    difficulty: "Easy",
    grid: [
      "MAYA..HAS..",
      "EXERT.ERECT",
      "TEACH.RETRO",
      "...HEY..TIN",
      ".CRIME.MINE",
      ".REVEALING.",
      "TILE.RANGE.",
      "USE..SUE...",
      "BEARD.GREAT",
      "ESSAY.HARSH",
      "..EYE..LAKE"
    ],
    clues: {
      across: {
        1:  "Ancient civilization of the Yucatan",
        5:  "Owns",
        8:  "Put forth, as effort",
        10: "Standing straight up",
        13: "Lead a class",
        14: "Styled like the seventies",
        15: "Attention-getting shout",
        17: "Metal in a cookie container",
        18: "What the police investigate",
        20: "Belonging to me",
        21: "Telling more than intended",
        23: "Kitchen floor square",
        24: "A stove, or a chain of mountains",
        25: "Put to work",
        26: "Take to court",
        27: "Growth a razor removes",
        30: "\"Terrific!\"",
        34: "Five-paragraph assignment",
        35: "Severe",
        36: "Peeper",
        37: "Body of water smaller than a sea"
      },
      down: {
        1:  "Ran into",
        2:  "Lumberjack's tool",
        3:  "Vote in favor",
        4:  "Where old records are kept",
        5:  "Belonging to that woman",
        6:  "Exist",
        7:  "Where a story takes place",
        9:  "Recurring idea in a novel",
        11: "Recoil in embarrassment",
        12: "Quality of a voice",
        16: "365-day spans",
        18: "Emergencies, in the plural",
        19: "Let go of",
        20: "Quartz, for one",
        22: "Response to a good joke",
        23: "Toothpaste holder",
        28: "Beam of light",
        29: "Change hair color with",
        31: "Historical period",
        32: "Pose a question",
        33: "The most common word in English"
      }
    }
  }
];
