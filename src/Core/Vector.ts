
namespace Core {

    export abstract class Vector {
        abstract width() : number;
        abstract get(index : number) : boolean;
        abstract add(other : Vector) : Vector;
        abstract not() : Vector;
        abstract negate() : Vector;
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
            return new BaselineVector(resultBits, false);
        }

        not() : Vector {
            let resultBits : boolean[] = [];
            for (let i : number = 0; i < this.width(); i++) {
                resultBits[i] = !this.get(i);
            }
            return new BaselineVector(resultBits, false);
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

    }

    export function vector(bits : boolean[]) {
        return new BaselineVector(bits, true);
    }

    export function allFalse(width : number) {
        let resultBits : boolean[] = [];
        for (let i : number = 0; i < width; i++) {
            resultBits[i] = false;
        }
        return new BaselineVector(resultBits, false);
    }

    export function zero(width : number) {
        return allFalse(width);
    }

    export function allTrue(width : number) {
        let resultBits : boolean[] = [];
        for (let i : number = 0; i < width; i++) {
            resultBits[i] = true;
        }
        return new BaselineVector(resultBits, false);
    }

    export function one(width : number) {
        let resultBits : boolean[] = [true];
        for (let i : number = 1; i < width; i++) {
            resultBits[i] = false;
        }
        return new BaselineVector(resultBits, false);
    }

}
