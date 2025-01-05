var gameConfig = {
  "type1": {
    "easy": {
      "maxStart": 40,
      "minStart": 20,
      "possibleValues": [
        {"numberd": 1, "speed": 1.5},
        {"numberd": 3, "speed": 2},
        {"numberd": 5, "speed": 2.5}
      ],
      "createNumInterval": 1000,
      "bombChance": 0.0
    },
    "medium": {
      "maxStart": 90,
      "minStart": 50,
      "possibleValues": [
        {"numberd": 1, "speed": 1.7},
        {"numberd": 3, "speed": 2.1},
        {"numberd": 5, "speed": 2.7},
        {"numberd": 7, "speed": 3}
      ],
      "createNumInterval": 500,
      "bombChance": 0.05
    },
    "hard": {
      "maxStart": 120,
      "minStart": 80,
      "possibleValues": [
        {"numberd": 1, "speed": 2},
        {"numberd": 3, "speed": 2.5},
        {"numberd": 5, "speed": 3},
        {"numberd": 7, "speed": 3.3},
        {"numberd": 9, "speed": 4}
      ],
      "createNumInterval": 300,
      "bombChance": 0.1
    }
  },
  "type2": {
    "easy": {
      "initialDiff": 40,
      "initialMax": 200,
      "initialMin": 100,
      "growInterval": 85,
      "numbersCountCap": "infinity"
    },
    "medium": {
      "initialDiff": 60,
      "initialMax": 300,
      "initialMin": 150,
      "growInterval": 70,
      "numbersCountCap": 8
    },
    "hard": {
      "initialDiff": 80,
      "initialMax": 400,
      "initialMin": 200,
      "growInterval": 50,
      "numbersCountCap": 4
    }
  },
  "type3": {
    "easy": {
      "randNum": 20,
      "initialDiff":80,
      "initialMax": 200,
      "initialMin": 100,
      "timerBar": 8000,
      "bombChance": 0.0
    },
    "medium": {
      "randNum": 30,
      "initialDiff": 100,
      "initialMax": 300,
      "initialMin": 150,
      "timerBar": 5000,
      "bombChance": 0.05
    },
    "hard": {
      "randNum": 40,
      "initialDiff": 120,
      "initialMax": 400,
      "initialMin": 200,
      "timerBar": 3000,
      "bombChance": 0.1
    }
  }
}
