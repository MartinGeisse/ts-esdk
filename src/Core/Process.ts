
namespace Core {

    export interface StateDescriptor {
        [key : string] : any;
    };

    export interface State {
        [key : string] : any;
    };

    export interface StateUpdate {
        [key : string] : any;
    }

    export type StateMapper = (state : State) => StateUpdate;

    export class Process implements ClockListener, State {

        private __elements : {[key : string] : ProcessElement} = {};
        private __stateMapper : StateMapper;
        private __stateUpdate : StateUpdate;
        [key : string] : any;

        // TODO use type parameter to ensure matching types for stateDescriptor and stateMapper!
        // BUT: cannot handle state updates with different types (e.g. memory)!

        public constructor(stateDescriptor : StateDescriptor, stateMapper : StateMapper) {
            for (let key in stateDescriptor) {
                let element = stateDescriptor[key];
                if (typeof element == 'boolean') {
                    this.__elements[key] = new BooleanRegister();
                    this[key] = element;
                } else if (element instanceof Vector) {
                    this.__elements[key] = new VectorRegister();
                    this[key] = element;
                } else {
                    throw 'invalid state descriptor element: ' + element;
                }
            }
            this.__stateMapper = stateMapper;
        }

        computeNextState() : void {
            this.__stateUpdate = this.__stateMapper(this);
        }

        updateState() : void {
            for (var key in this.__elements) {
                var processElement = this.__elements[key];
                var oldState = this[key];
                var stateUpdate = this.__stateUpdate[key];
                var newState = processElement.applyUpdate(oldState, stateUpdate);
                this[key] = newState;
            }
        }

    }

    export interface ProcessElement {

        // may modify old state, must return new state
        applyUpdate(oldState : any, stateUpdate : any) : any;

    }

    export abstract class Register implements ProcessElement {

        applyUpdate(oldState : any, stateUpdate : any) : any {
            var valid = this.validateUpdate(oldState, stateUpdate);
            if (!valid) {
                throw 'invalid state update ' + stateUpdate + ' for old state ' + oldState;
            }
            return stateUpdate;
        }

        abstract validateUpdate(oldState : any, stateUpdate : any) : boolean;

    }

    export class BooleanRegister extends Register {
        validateUpdate(oldState : any, stateUpdate : any) : boolean {
            return (typeof stateUpdate == 'boolean');
        }
    }

    export class VectorRegister extends Register {
        validateUpdate(oldState : any, stateUpdate : any) : boolean {
            let oldVector : Vector = oldState as Vector;
            return (stateUpdate instanceof Vector) && (stateUpdate.width() == oldState.width());
        }
    }

}
