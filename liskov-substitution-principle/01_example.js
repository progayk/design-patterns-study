// If you have a base type which should equally be
// taken a derived type.

class Rectangle {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    get area() {
        return this.width * this.height;
    }
    toString() {
        return `${this.width}x${this.height}`;
    }
}

let rc = new Rectangle(200, 300);
console.log(rc.toString());

// Let's you want to define Square class. And this class
// should enforce that width and height be equal.
class Square extends Rectangle {
    constructor(size) {
        super(size, size);
    }
}

let sq = new Square(5);
console.log(sq.toString());
sq.width = 10;
console.log(sq.toString());
// It's no longer a square.

// One possible way to get around this is like:
class RectangleTwo {
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }
    get width() { return this._width };
    get height() { return this._height };

    set width(value) { this._width = value }
    set height(value) { this._height = value }

    get area() {
        return this._width * this._height;
    }
    toString() {
        return `${this._width}x${this._height}`;
    }
}

class SquareTwo extends RectangleTwo {
    constructor(size) {
        super(size, size);
    }
    set width(value) { this._width = this._height = value }
    set height(value) { this._width = this._height = value }
}

// This way when you modify the square it will keep itself as square
let sq2 = new SquareTwo(5);
console.log(sq2.toString());
sq2.width = 10;
console.log(sq2.toString());

// Now, let's examine an example which the above method can fail:

let useIt = (rc) => {
    let width = rc._width;
    rc.height = 10;
    console.log(
        `Expected area of ${10 * width}, got ${rc.area}`
    )
}

useIt(new RectangleTwo(5, 10)); // Expected area of 50, got 50
useIt(new SquareTwo(5)); // Expected area of 50, got 100
// As we see there is an unexpected side-effect
// If function takes a base Rectangle class, then it should work with all the
// derived classes without breaking the functionality

// The solution to this problem could be defining a seperate class for
// Square or maybe be add a method to Rectangle as 'isSquare'...