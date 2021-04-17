class Journal {
  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count;
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }

  removeEntry(index) {
    delete this.entries[index];
  }

  toString() {
    return Object.values(this.entries).join("\n");
  }
}

Journal.count = 0;

let j = new Journal();
j.addEntry("I cried today.");
j.addEntry("I took coffee.");
console.log(j.toString());

j.removeEntry(2);
console.log(j.toString());

// Let's we want to save the journal to a file.
// We can handle this functionality by creating methods inside
// this Journal class as so:

// class Journal {
// ...
// saveToFile(filename) {
//      fs.writeFileSync(filename, this.toString())
// }
// ...
// }

// But, by implementing this functionality in this very class, we
// break Single Responsibility rule. The better option would be creating
// another class and add file write and read methods into it.

const fs = require("fs");

class PersistanceManager {
    preprocess(journal) {
        //
    }
    saveToFile(journal, filename) {
        fs.writeFileSync(filename, journal.toString());
    }
}

let pm = new PersistanceManager();
let filename = './my-journal.txt'
pm.saveToFile(j, filename)