import { State } from "./State";
import { RENodes } from "../utils/globals";

export class NFA {
    public initialState: State;
    public currentState: State;

    constructor() {
        this.initialState = new State(false, undefined, undefined);
        this.currentState = this.initialState;
    }

    public handleUnion(state: State): State {
        let newState = new State(false, undefined, undefined);
        state.AddOutgoing({from: state, to: newState, label: "Epsilon"});
        newState.AddIncoming({from: newState, to: state, label: "Epsilon"});
        this.currentState = newState;
        return newState;
    }

    public handleKleene(str: string): void {
        this.currentState = this.currentState.Parent(str);
        this.currentState.isAccepting = true;
        this.currentState = this.currentState.Transition(str);
        this.currentState.AddIncoming({from: this.currentState, to: this.currentState, label: str});
        this.currentState.AddOutgoing({from: this.currentState, to: this.currentState, label: str});
    }

    public handleConcat(str: string): void {
        let nextState = new State(false, undefined, undefined);
        this.currentState.AddOutgoing({from: this.currentState, to: nextState, label: str});
        nextState.AddIncoming({from: this.currentState, to: nextState, label: str});
        nextState.isAccepting = true;
        this.currentState.isAccepting = false;
        this.currentState = nextState;
    }
}