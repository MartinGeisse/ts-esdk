
namespace Core {

    export class Clock {

        private listeners : ClockListener[] = [];

        add(listener : ClockListener) : void {
            this.listeners.push(listener);
        }

        remove(listener : ClockListener) : void {
            let index = this.listeners.indexOf(listener);
            if (index >= 0) {
                this.listeners.splice(index, 1);
            }
        }

        fire() : void {
            for (let listener of this.listeners) {
                listener.computeNextState();
            }
            for (let listener of this.listeners) {
                listener.updateState();
            }
        }

        process(stateDescriptor : StateDescriptor, stateMapper : StateMapper) : Process {
            var process : Process = new Process(stateDescriptor, stateMapper);
            this.add(process);
            return process;
        }

    }

    export interface ClockListener {
        computeNextState() : void;
        updateState() : void;
    }

}
