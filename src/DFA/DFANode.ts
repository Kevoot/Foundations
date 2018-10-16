import { DFANodeOperation } from "./DFANodeOperation";
import { DFAEdgeList } from "./DFAChecker";
import { State } from "../utils/Types";

export class DFANode {
    public _nextStates: State[];
    public _qState: number;
    public _isStartState: boolean;
    public _isEndState: boolean;

    constructor(qState: number, nextStates?: State[], isStartState?: boolean, isEndState?: boolean) {
        this._qState = qState;
        this._nextStates = [];

        if (Array.isArray(nextStates)) {
            for(let state of nextStates) {
                this._nextStates.push(state);
                let label = state.op._expected;
                DFAEdgeList.push({from: this._qState, to: state.next._qState, label: label});
            }
        }

        if (isStartState) {
            this._isStartState = true;
        }

        if (isEndState) {
            this._isEndState = true;
        }
    }

    public IsStartState(): boolean {
        return this._isStartState;
    }

    public IsEndState(): boolean {
        return this._isEndState;
    }

    public AddState(state: State | State[]): void {
        if(Array.isArray(state)) {
            for(let st of state) {
                this._nextStates.push(st);
                let label = st.op._expected;
                DFAEdgeList.push({
                    from: this._qState, 
                    to: st.next._qState, 
                    label: label
                });
            }
        }
        else {
            this._nextStates.push(state);
            DFAEdgeList.push({
                from: this._qState, 
                to: state.next._qState, 
                label: state.op._expected
            });
        }
    }

    public RemoveState(state: State): void {
        this._nextStates.splice(this._nextStates.indexOf(state));
    }

    public GetQStateNumber(): number {
        return this._qState;
    }

    public SetQStateNumber(newNumber: number): void {
        this._qState = newNumber;
    }

    public MoveToNextState(str: string) {
        if (str.length > 0) {
            let successStates: State[] = [];
            for(let state of this._nextStates) {
                if(state.op.Execute(str)) {
                    successStates.push(state);
                }
            }

            for(let success of successStates) {
                    success.next.MoveToNextState(str.substr(1, str.length - 1));
            }
        }
        else {
            if(this._isEndState)
                document.getElementById("outputAcceptState").innerHTML = 
                    "String was accepted at state" + this._qState;
            return;
        }
    }
}