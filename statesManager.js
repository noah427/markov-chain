module.exports = class StateManager {
  constructor() {
    this.states = new Map();
  }

  // addState(name) {
  //   this.states.set(name, new State(name));
  // }

  // initialAmount is what the change occurences is set to if the change is not already registered
  addChangeOccurance(stateName, changeName, initialAmount = 1) {
    if (!this.states.has(stateName)) {
      // create the state if it doesn't exist yet
      this.states.set(stateName, new State(stateName));
    }

    let state = this.states.get(stateName);
    state.addChangeOccurance(changeName, initialAmount);
    this.states.set(stateName, state);
  }
};

class State {
  constructor(name) {
    this.name = name;
    this.changes = new Map();
  }

  // initialAmount is what the change occurences is set to if the change is not already registered
  addChangeOccurance(name, initialAmount = 1) {
    if (!this.changes.has(name)) {
      // if the change doesn't already exist, make it
      this.changes.set(name, new Change(name, initialAmount));
      this.recalculateProbabilities();
      return;
    }

    // update occurences
    let change = this.changes.get(name);
    change.occurences++;
    this.changes.set(name, change);

    // recalc the probabilty
    this.recalculateProbabilities();
  }

  recalculateProbabilities() {
    var totalOccurances = 0;

    this.changes.forEach((change) => {
      totalOccurances += change.occurences; // add to total occurances
    });

    this.changes.forEach((change) => {
      change.probability = change.occurences / totalOccurances; // divide for probability
      this.changes.set(change.name, change);
    });
  }
}

class Change {
  constructor(name, occurences = 1) {
    this.name = name;
    this.occurences = occurences;
    this.probability = 0; // probabilty out of 100
  }
}
