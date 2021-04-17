const Color = Object.freeze({
  red: "red",
  green: "green",
  blue: "blue",
});

const Size = Object.freeze({
  small: "small",
  medium: "medium",
  large: "large",
});

class Product {
  constructor(name, color, size) {
    this.name = name;
    this.color = color;
    this.size = size;
  }
}

// Let's say we want to filter by properties of Product class.
// We can create another class that will handle these filters.
class ProductFilter {
  filterByColor(products, color) {
    return products.filter((p) => p.color === color);
  }
}

let apple = new Product("Apple", Color.green, Size.small);
let tree = new Product("Tree", Color.green, Size.large);
let house = new Product("House", Color.blue, Size.large);

let products = [apple, tree, house];

let pf = new ProductFilter();
console.log("Green Products:");
for (let p of pf.filterByColor(products, Color.green)) {
  console.log(` * ${p.name} is ${p.color}.`);
}
// Good we can filter by color now.
// Let's say our boss comes and wants to filter by size too.
// Well it's easy to implement. Just add another filter to ProductFilter class.

ProductFilter.prototype.filterBySize = (products, size) => {
  return products.filter((p) => p.size === size);
};
console.log("Large Products:");
for (let p of pf.filterBySize(products, Size.large)) {
  console.log(` * ${p.name} is ${p.size}.`);
}

// Well OCP (Open-Closed Principle) says objects are open for extension,
// but close for modification.
// In this case, when we add another filtering method to ProductFilter class
// we break OCP. Because once ProductFilter is defined it shouldn't be modified later on.

// Let's explain this with another example:
// The boss comes and says that now he wants to filter by both color
// and size...
ProductFilter.prototype.filterBySizeAndColor = (products, size, color) => {
  return products.filter((p) => p.size === size && p.color === color);
};
// OK. It's not very hard to implement but in the end it causes another problem
// which is called 'state space explosion'. Meaning that this entire approach doesn't work
// to infinity. Because the next time boss comes and wants, yet another filter that filters
// either size or color.
// In this case, let's say we have 3 criteria such as color, size and price than it will
// add up to 7 methods. And in the case of having 4 criteria number of methods will increase
// more, and so forth. To manage this scenario there is a pattern called 'Specification'.

// ---------------------
// SPECIFICATION PATTERN

// Whenever you want to filter by criteria you specify a class for it. So, it becomes
// more modular.
class ColorSpesification {
  constructor(color) {
    this.color = color;
  }
  isSatisfied(item) {
    return item.color === this.color;
  }
}
class SizeSpesification {
  constructor(size) {
    this.size = size;
  }
  isSatisfied(item) {
    return item.size === this.size;
  }
}
// It may look like overkill but as a result the filters which are defined
// will be untied from others. The specifications we defined will be unrelated
// to each other. This way, when you want to define a new specification you don't
// touch to existing classes, instead, you create a new specification.

// Let's create a better filter which is takes specs:
class BetterFilter {
  filter(items, spec) {
    return items.filter((x) => spec.isSatisfied(x));
  }
}

let bf = new BetterFilter();
console.log('Green products (new approach):')
for (let p of bf.filter(products, new ColorSpesification(Color.green))) {
    console.log(` * ${p.name} is ${p.color}.`)
}

// This approach is already better. But what happends when we want
// filter both by color and size. Well, we need a specification combinator:
class AndSpecifiation { // a combinator
    constructor(...specs) {
        this.specs = specs;
    }
    // we want that every spec is satisfied by the item that passed
    isSatisfied(item) {
        return this.specs.every(x => x.isSatisfied(item));
    }
}

console.log('Large and green products: ')
let spec = new AndSpecifiation(
    new ColorSpesification(Color.green), 
    new SizeSpesification(Size.large)
)
for (let p of bf.filter(products, spec)) {
    console.log(` * ${p.name} is large and green.`)
}

// Well this approach, even though looks better, is also broken. We will
// explore why later on.

// Since Javascript isn't fully Object-Oriented we didn't create a base class.
// Which is normally we should do like:
// class Specification {
//     constructor() {}
//     isSatisfied() {}
// }

// class ColorSpecification extends Specification {
//     constructor() {
//         super()
//     }
//     isSatisfied() {};
// }