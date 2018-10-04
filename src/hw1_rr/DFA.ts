export type transition = {
    key: {
        val1: any,
        val2: any,
    }
    value: any;
}

export class DFA {
    start: string;
    accepts: any[];
    trans: transition[];

    constructor(start: string, accepts: string[], trans: transition | transition[]) {
        this.trans = [];

        if(Array.isArray(trans)){
            this.trans = trans;
        }
        else {
            this.trans.push(trans);
        }

        this.start = start;
        this.accepts = accepts;
    }
    
    public interp(input: string): boolean {
        let current = this.start;
        for(let i = 0; i < input.length; i++) {
            let found = this.trans.find(entry => (entry.key.val1 == current && entry.key.val2 == input.substr(i + 1, 1)));
            if(found) {
                current = found.value;
            }
            else current = input.substr(i + 1, 1);
        }
        
        return (this.accepts.findIndex(entry => entry === current)) > -1 ? true : false;
    }
}

export function main() {
    let trans = [];
    trans.push({key: {val1: "a", val2: "b"}, value: "b"});
    trans.push({key: {val1: "b", val2: "a"}, value: "a"});
    trans.push({key: {val1: "b", val2: ""}, value: "b" });

    let input = "zyzyabab";

    let abab = new DFA(input.substr(0, 1), new Array("b"), trans);

    console.log(abab.interp(input));
}

$(document).on("click", "#submitButton", (e) => {
    main();
})