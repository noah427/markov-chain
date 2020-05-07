const fs = require("fs");

module.exports = class Consultor {
  constructor(input) {
    this.inputFile = input;
    try {
      this.input = JSON.parse(fs.readFileSync(input).toString());
    } catch {}
  }

  loadFromFile() {
    this.input = JSON.parse(fs.readFileSync(this.inputFile).toString());
  }

  anyWord() {
    let objectKeys = Object.keys(this.input);
    return objectKeys[rng(0, objectKeys.length)];
  }

  followingWord(word) {
    word = word.toLowerCase();

    let highest = { number: 0, word: null };

    if (this.input[word] == undefined) {
      return this.anyWord();
    }

    for (let change of this.input[word]) {
      let num = change.probability * 100 * rng(1, 100);
      if (num > highest.number) {
        highest = { number: num, word: change.name };
      }
    }
    return highest.word;
  }

  generateText(len) {
    let output = "";
    let lastWord = "";
    let seedWord = this.anyWord();

    lastWord = seedWord;

    output = output.concat(seedWord + " ");

    for (let index = 0; index < len; index++) {
      lastWord = this.followingWord(lastWord);

      output = output.concat(`${lastWord} `);
    }

    return output;
  }
};

function rng(min, max) {
  return Math.floor(Math.random() * max + min);
}
