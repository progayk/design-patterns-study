// Let's say we want to make research on geneology.
// To make it we need to define some sort of relationship:
let Relationship = Object.freeze({
  parent: 0,
  child: 1,
  sibling: 2,
});

class Person {
  constructor(name) {
    this.name = name;
  }
}

// We need to store relationship in somewhere:
// LOW-LEVEL MODULE:
class Relationships {
  constructor() {
    this.data = [];
  }
  addParentAndChild(parent, child) {
    this.data.push({
      from: parent,
      to: child,
      type: Relationship.parent,
    });
  }
}

// HIGH-LEVEL MODULE
class Research {
  constructor(relationships) {
    // find all chidlren of Jogn
    let relations = relationships.data;
    for (let r of relations.filter(
      (r) => r.from.name === "John" && r.type === Relationship.parent
    )) {
      console.log(`John has a child named ${r.to.name}`);
    }
  }
}

let parent = new Person("John");
let c1 = new Person("Chris");
let c2 = new Person("Matt");

let rels = new Relationships();
rels.addParentAndChild(parent, c1);
rels.addParentAndChild(parent, c2);

new Research(rels);

// Dependency Inversion Principle says High-Level Modules should not
// depend on Low-Level Modules. Instead, they should depend on abstractions.
// With absctactions we typically mean 'abstract classes' or 'interfaces'.
// Of cource javascript doesn't have neither of them.

// The key problem in above example is that we use Low-level data storage
// directly. Which means, in a scenario that we change or storage data type from
// array, for example, to a map or some tree structure. Then, you will have to
// refactor on Relationships class and Research class, because in above example
// high-level module depends on implementation details of low-level module.

// So, what we gonna do is remove concrete dependency on high-level module(Research class)
// and make it only care about finding what's needed (which is finding John's children).

class RelationshipBrowser {
  // this serves as a guide. It says whoever wants to extend by this class
  // should implement findAllChildrenOf method.
  constructor() {
    if (this.constructor.name === "RelationshipBrowser") {
      throw new Error("RelationshipBrowser is abstract!");
    }
  }
  findAllChildrenOf(name) {}
}

// This way if the storage changes we want to only change that class but
// not the entire application.
// Single Responsibility Principle states:
// "A class could have only one reason to change."

class RelationshipsTwo extends RelationshipBrowser {
  constructor() {
    super();
    this.data = [];
  }

  addParentAndChild(parent, child) {
    this.data.push({
      from: parent,
      to: child,
      type: Relationship.parent,
    });
  }

  findAllChildrenOf(name) {
    return this.data
      .filter((r) => r.from.name === name && r.type === Relationship.parent)
      .map((r) => r.to);
  }
}

class ResearchTwo {
  constructor(browser) {
    for (let p of browser.findAllChildrenOf("John")) {
      console.log(`John has a child named ${p.name}`);
    }
  }
}

console.log("\nDependency Inversed Example: ");
let relsTwo = new RelationshipsTwo();
relsTwo.addParentAndChild(parent, c1);
relsTwo.addParentAndChild(parent, c2);
new ResearchTwo(relsTwo);


// In this way, by depending on abstractions, we can for example
// seperatly use a different browser for testing and for production code.