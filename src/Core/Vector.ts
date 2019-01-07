
namespace Core {

    export function vector(bits : boolean[]) {
        return createVector(bits, true);
    }

    function createVector(bits : boolean[], copy : boolean) {
        return new BaselineVector(bits, copy);
    }

    export abstract class Vector {

        abstract width() : number;
        abstract get(index : number) : boolean;

        add(other : Vector) : Vector {
            if (other.width() != this.width()) {
                throw 'trying to add vectors of width ' + this.width() + ' and ' + other.width();
            }
            let resultBits : boolean[] = [];
            let carry = false;
            for (let i : number = 0; i < this.width(); i++) {
                let a : boolean = this.get(i);
                let b : boolean = other.get(i);
                resultBits[i] = a !== b !== carry;
                carry = (a && b) || (a && carry) || (b && carry);
            }
            return createVector(resultBits, false);
        }

        not() : Vector {
            let resultBits : boolean[] = [];
            for (let i : number = 0; i < this.width(); i++) {
                resultBits[i] = !this.get(i);
            }
            return createVector(resultBits, false);
        }

        negate() : Vector {
            return this.not().add(one(this.width()));
        }

        subtract(other : Vector) : Vector {
            if (other.width() != this.width()) {
                throw 'trying to subtract vectors of width ' + this.width() + ' and ' + other.width();
            }
            return this.add(other.negate());
        }

        concat(other : Vector) : Vector {
            let resultBits : boolean[] = [];
            for (let i = 0; i < other.width(); i++) {
                resultBits.push(other.get(i));
            }
            for (let i = 0; i < this.width(); i++) {
                resultBits.push(this.get(i));
            }
            return createVector(resultBits, false);
        }

        range(from: number, to : number) {
            if (from !== Math.floor(from)) {
                throw 'called range() with non-integer "from" value ' + from;
            }
            if (to !== Math.floor(to)) {
                throw 'called range() with non-integer "to" value ' + to;
            }
            if (from < to || to < 0 || from >= this.width()) {
                throw 'invalid from/to values ' + from + '..' + to + ' for width ' + this.width();
            }
            let resultWidth = from - to + 1;
            let resultBits : boolean[] = [];
            for (let i = 0; i < resultWidth; i++) {
                resultBits[i] = this.get(to + i);
            }
            return createVector(resultBits, false);
        }

    }

    class BaselineVector extends Vector {

        private bits : boolean[];

        constructor(bits : boolean[], copy : boolean) {
            super();
            if (copy) {
                // sanitize, don't just slice()
                this.bits = [];
                for (var i = 0; i < bits.length; i++) {
                    this.bits[i] = (bits[i] == true);
                }
            } else {
                this.bits = bits;
            }
        }

        width() : number {
            return this.bits.length;
        }

        get(index : number) : boolean {
            if (index < 0 || index >= this.bits.length) {
                throw 'vector index ' + index + ' out of bounds for vector of size ' + this.bits.length;
            }
            return this.bits[index];
        }

    }

    export function allFalse(width : number) {
        let resultBits : boolean[] = [];
        for (let i : number = 0; i < width; i++) {
            resultBits[i] = false;
        }
        return createVector(resultBits, false);
    }

    export function zero(width : number) {
        return allFalse(width);
    }

    export function allTrue(width : number) {
        let resultBits : boolean[] = [];
        for (let i : number = 0; i < width; i++) {
            resultBits[i] = true;
        }
        return createVector(resultBits, false);
    }

    export function one(width : number) {
        let resultBits : boolean[] = [true];
        for (let i : number = 1; i < width; i++) {
            resultBits[i] = false;
        }
        return createVector(resultBits, false);
    }

    export function unsigned(width : number, value : number) {
        if (width > 50) {
            throw 'cannot use unsigned() to create vectors of width greater than 50 -- Javascript has worse-than-integer precision for those numbers';
        }
        if (value !== Math.floor(value)) {
            throw 'called unsigned() with non-integer value ' + value;
        }
        if (value < 0 || value >= (1 << width)) {
            throw 'value ' + value + ' out of range for width ' + width;
        }
        let resultBits : boolean[] = [true];
        for (let i : number = 0; i < width; i++) {
            resultBits[i] = ((value & (1 << i)) != 0);
        }
        return createVector(resultBits, false);
    }

}
