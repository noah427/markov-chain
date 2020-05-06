const StatesManager = require("./statesManager");
const fs = require("fs");

module.exports = class Trainer {
  constructor(output, save) {
    this.statesManager = new StatesManager();
    this.save = save;
    this.output = output;

    if (fs.existsSync(this.save)) this.loadSave();
  }

  trainText(text = "") {
    // add states to the statesManager from a string

    text = text.replace(/[^A-Za-z0-9'’]/g, " ");

    const words = text
      .split(" ")
      .filter((v) => v != "")
      .map((v) => v.toLowerCase());

    for (let index = 0; index < words.length - 1; index++) {
      // don't do last word bc it has no word after it
      const word = words[index];

      this.statesManager.addChangeOccurance(word, words[index + 1]);
    }

    this.dumpToFile();
    this.saveState();
  }

  dumpToFile() {
    // this function should be called after training
    // dumps the content of the statesManager into a the output.json file

    let output = {};

    this.statesManager.states.forEach((state) => {
      let stateProbs = [];
      state.changes.forEach((change) => {
        stateProbs.push({ name: change.name, probability: change.probability });
      });
      output[state.name] = stateProbs.sort(
        (a, b) => a.probability >= b.probability
      );
    });

    fs.writeFileSync(this.output, JSON.stringify(output));
  }

  saveState() {
    let output = [];

    this.statesManager.states.forEach((state) => {
      let changes = [];
      state.changes.forEach((change) => {
        changes.push({ name: change.name, occurences: change.occurences });
      });
      output.push({ name: state.name, changes: changes });
    });
    fs.writeFileSync(this.save, JSON.stringify(output));
  }

  loadSave() {
    let data = fs.readFileSync(this.save).toString();

    if (data === "") return;

    data = JSON.parse(data);

    for (let state of data) {
      for (let change of state.changes) {
        this.statesManager.addChangeOccurance(
          state.name,
          change.name,
          change.occurences
        );
      }
    }
  }
};
