import { Link } from "./Link";
import { findNextQStateNum, AddRENode, nodeNums } from "../utils/globals";

export class State {
    public num: number;
    public isAccepting: boolean;
    public incoming: Link[];
    public outgoing: Link[];

    constructor(accepting: boolean, incoming?: Link[], outgoing?: Link[]) {
        this.num = findNextQStateNum();
        nodeNums.push(this.num);
        this.isAccepting = accepting;
        this.incoming = incoming ? incoming : [];
        this.outgoing = outgoing ? outgoing : [];
        AddRENode(this);
    }

    public AddOutgoing(l: Link): void {
        this.outgoing.push(l);
    }

    public AddIncoming(l: Link): void {
        this.incoming.push(l);
    }

    public ContainsOutgoingLink(l: Link): boolean {
        if(this.outgoing.findIndex(entry => 
            entry.from === l.from &&
            entry.to === l.to &&
            entry.label === l.label) > -1)
                return true;
    }

    public Transition(str: string): State {
        let newState: State;
        for(let out of this.outgoing) {
            if(out.label === str) {
                newState = out.to;
            }
        }
        return newState;
    }

    public Parent(str: string): State {
        let newState: State;
        for(let inc of this.incoming) {
            if(inc.label === str) {
                newState = inc.from;
            }
        }
        return newState;
    }
}