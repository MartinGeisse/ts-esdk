
namespace Example.Blink {

    export function run() {
        
        let width = 3;
        let clk : Core.Clock = new Core.Clock();
        var process = clk.process({
            counter: Core.zero(width),
            out: false,
        }, state => ({
            counter: state.counter.add(1),
            out: state.get(width - 1),
        }));
    
        for (let i = 0; i < 30; i++) {
            console.log(process.out);
            clk.fire();
        }

    }

}
